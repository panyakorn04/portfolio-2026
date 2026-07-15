#!/bin/bash
set -euo pipefail

# report-deploy-failure.sh
# Runs on deploy failure to analyze and create structured GitHub Issue + LLM comment
# Called from .github/workflows/deploy-vps.yml

echo "=== Deploy Failure Reporter (qwen2.5-coder:7b) ==="

SHORT_SHA="${GITHUB_SHA:0:7}"
RUN_URL="${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}"
COMMIT_URL="${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/commit/${GITHUB_SHA}"

echo "Commit: $SHORT_SHA"
echo "Run: $RUN_URL"

# 1. Collect logs from completed failed jobs. The overall workflow is still
# running while this reporter executes, so run-level --log-failed may not be
# available yet. Job-level logs are available as soon as each failed job ends.
echo "=== Collecting failure logs ==="
FAIL_LOGS=""
LOG_ATTEMPT=1
MAX_LOG_ATTEMPTS=4

while [ "$LOG_ATTEMPT" -le "$MAX_LOG_ATTEMPTS" ] && [ -z "$FAIL_LOGS" ]; do
  FAILED_JOB_IDS=$(gh api \
    "repos/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}/jobs?per_page=100" \
    --jq '.jobs[] | select(.conclusion == "failure") | .id' 2>/dev/null || true)

  while IFS= read -r JOB_ID; do
    [ -n "$JOB_ID" ] || continue
    # Use the job-log REST endpoint directly. `gh run view --job --log-failed`
    # still rejects logs until the entire workflow run is completed, but this
    # reporter itself keeps the run active.
    JOB_LOG=$(gh api \
      "repos/${GITHUB_REPOSITORY}/actions/jobs/${JOB_ID}/logs" \
      2>/dev/null || true)
    if [ -n "$JOB_LOG" ]; then
      FAIL_LOGS="${FAIL_LOGS}${JOB_LOG}
"
    fi
  done <<< "$FAILED_JOB_IDS"

  if [ -z "$FAIL_LOGS" ] && [ "$LOG_ATTEMPT" -lt "$MAX_LOG_ATTEMPTS" ]; then
    echo "Failed-job logs not ready; retrying (${LOG_ATTEMPT}/${MAX_LOG_ATTEMPTS})"
    sleep 5
  fi
  LOG_ATTEMPT=$((LOG_ATTEMPT + 1))
done

if [ -z "$FAIL_LOGS" ]; then
  FAIL_LOGS=$(gh run view "$GITHUB_RUN_ID" \
    --repo "$GITHUB_REPOSITORY" \
    --log-failed 2>/dev/null || true)
fi

if [ -z "$FAIL_LOGS" ]; then
  FAIL_LOGS="Logs unavailable after ${MAX_LOG_ATTEMPTS} attempts"
else
  # Job logs also contain successful post-job cleanup after the failed step.
  # Prefer explicit failure/error lines so cleanup cannot push the root cause
  # outside the prompt budget; fall back to the end of the raw log.
  ACTIONABLE_LOGS=$(printf "%s" "$FAIL_LOGS" | \
    grep -iE '##\[error\]|permission denied|connection timed out|connection refused|ssh: connect|dial tcp|fatal:|error:|failed|failure' || true)
  if [ -n "$ACTIONABLE_LOGS" ]; then
    FAIL_LOGS=$(printf "%s" "$ACTIONABLE_LOGS" | tail -c 5500)
  else
    FAIL_LOGS=$(printf "%s" "$FAIL_LOGS" | tail -c 5500)
  fi
fi

if echo "$FAIL_LOGS" | grep -qiE "timeout|connection refused|ssh: connect|dial tcp.*22"; then
  echo "Note: Possible transient SSH/network issue detected"
  FAIL_LOGS="TRANSIENT? ${FAIL_LOGS}"
fi

# 2. Find existing open issue for this SHA or create a new one
echo "=== Finding or creating issue ==="
EXISTING=$(gh issue list \
  --repo "${GITHUB_REPOSITORY}" \
  --state open \
  --label "deploy-failure,agent-loop" \
  --json number,title \
  --jq ".[] | select(.title | contains(\"${SHORT_SHA}\")) | .number" | head -1 || true)

if [ -n "$EXISTING" ]; then
  ISSUE_NUMBER="$EXISTING"
  echo "Reusing existing issue #$ISSUE_NUMBER"
else
  ISSUE_BODY=$(cat <<ISSUEBODY
## Deploy Failure — Agent Loop Feedback

**Commit:** [${SHORT_SHA}](${COMMIT_URL})
**Run:** [Open logs & jobs](${RUN_URL})
**Triggered by:** ${GITHUB_EVENT_NAME}

**Analysis model:** qwen2.5-coder:7b

### Agent Loop Instructions
1. Read the AI analysis comment posted below.
2. Apply the **smallest possible fix**.
3. Commit and push.
4. This workflow will run again automatically.
5. Repeat until the deploy is green.

**Goal:** Get the frontend (Next.js + GHCR) deploying successfully to VPS.
ISSUEBODY
)

  ISSUE_URL=$(gh issue create \
    --repo "${GITHUB_REPOSITORY}" \
    --title "🚨 Deploy Frontend failed: ${SHORT_SHA}" \
    --body "$ISSUE_BODY" \
    --label "deploy-failure,agent-loop,needs-fix")
  ISSUE_NUMBER="${ISSUE_URL##*/}"

  if ! [[ "$ISSUE_NUMBER" =~ ^[0-9]+$ ]]; then
    echo "Unable to parse issue number from: $ISSUE_URL" >&2
    exit 1
  fi

  echo "Created new issue #$ISSUE_NUMBER"
fi

# 3. Call the backend LLM (qwen2.5-coder:7b) with strict prompt + retry
echo "=== Calling backend LLM (qwen2.5-coder:7b) ==="

SYSTEM='You are a strict, precise DevOps + software engineer.

MANDATORY RULES:
- Output MUST start exactly with the four headings below and NOTHING before them.
- Output MUST contain ONLY these four sections.
- Be extremely concise.
- Always recommend the smallest change first (YAML/build args > code).
- If low confidence, write exactly: "Low confidence - logs are insufficient".
- This analysis is ADVISORY ONLY. Human must review.

REQUIRED FORMAT (exact):

### Root Cause
(1-2 sentences citing the specific error from logs)

### Recommended Fix
(smallest possible change)

### Files / Steps
- exact paths or steps

### How to Verify
```bash
commands
```'

USER_BASE="The Next.js frontend deploy to VPS using GHCR just failed.

Run URL: ${RUN_URL}
Commit: ${SHORT_SHA}

Truncated logs:
${FAIL_LOGS}

Analyze strictly according to the rules and required format above."

MAX_RETRIES=3
ATTEMPT=1
ANALYSIS=""

while [ $ATTEMPT -le $MAX_RETRIES ]; do
  echo "Attempt ${ATTEMPT}/${MAX_RETRIES}"

  USER_MSG="$USER_BASE"
  if [ $ATTEMPT -gt 1 ]; then
    USER_MSG="${USER_MSG}

This is retry attempt ${ATTEMPT}. Previous response was invalid or incomplete. Follow the exact 4-heading format strictly this time."
  fi

  jq -n \
    --arg model "qwen2.5-coder:7b" \
    --arg sys "$SYSTEM" \
    --arg usr "$USER_MSG" \
    '{
      model: $model,
      messages: [
        {role: "system", content: $sys},
        {role: "user", content: $usr}
      ]
    }' > /tmp/llm.json

  RESPONSE=$(curl -s --max-time 90 \
    -X POST https://api.panyakorn.com/api/ai/chat \
    -H "Content-Type: application/json" \
    -d @/tmp/llm.json || echo '{}')

  ANALYSIS=$(echo "$RESPONSE" | jq -r '.data.message.content // ""' 2>/dev/null || echo "")

  if echo "$ANALYSIS" | grep -q "### Root Cause" && \
     echo "$ANALYSIS" | grep -q "### Recommended Fix" && \
     echo "$ANALYSIS" | grep -q "### Files / Steps" && \
     echo "$ANALYSIS" | grep -q "### How to Verify"; then
    echo "✓ Valid structured response received"
    break
  fi

  echo "✗ Invalid or incomplete response"
  ATTEMPT=$((ATTEMPT + 1))
  sleep 2
done

if [ -z "$ANALYSIS" ] || ! echo "$ANALYSIS" | grep -q "### Root Cause"; then
  ANALYSIS="**LLM did not produce a valid structured response after ${MAX_RETRIES} attempts.**

This is ADVISORY ONLY. Please review the full logs yourself."
else
  ANALYSIS="${ANALYSIS}

---
*Attempts used: ${ATTEMPT}/${MAX_RETRIES}*"
fi

# 4. Post the analysis as a comment on the issue
echo "=== Posting analysis as comment to issue #$ISSUE_NUMBER ==="
gh issue comment "$ISSUE_NUMBER" \
  --repo "${GITHUB_REPOSITORY}" \
  --body "## 🤖 Analysis from qwen2.5-coder:7b (via backend)

> **ADVISORY ONLY** — LLM output is for guidance. Always cross-check against the full logs.

$ANALYSIS

---
*Auto-generated • Model: qwen2.5-coder:7b • Retries enabled*"

echo "✅ Analysis posted to issue #$ISSUE_NUMBER (after ${ATTEMPT} attempt(s))"
