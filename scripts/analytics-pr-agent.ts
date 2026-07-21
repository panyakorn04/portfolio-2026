#!/usr/bin/env bun
/**
 * Analytics PR Agent
 *
 * Scheduled workflow that:
 * 1. Fetches analytics data from PostHog
 * 2. Reads current source files
 * 3. Sends to Claude for analysis + code improvement suggestions
 * 4. Creates a GitHub Pull Request with changes
 *
 * Required env vars:
 *   POSTHOG_PROJECT_ID    — PostHog project ID (number)
 *   POSTHOG_PERSONAL_API_KEY — PostHog Personal API Key (from Settings → Personal API Keys)
 *   ANTHROPIC_API_KEY     — Anthropic API key for Claude
 *   GH_TOKEN              — GitHub token with contents+pull-requests write
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { readdirSync, statSync, mkdtempSync } from "node:fs";
import { join, relative } from "node:path";

const POSTHOG_BASE = "https://us.i.posthog.com";
const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";
const SOURCE_DIRS = ["src/components", "src/app/[lang]", "src/lib"];
const BRANCH_PREFIX = "analytics-agent";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required env: ${name}`);
    process.exit(1);
  }
  return value;
}

// ── PostHog API ──────────────────────────────────────────────

async function queryPostHog(projectId: string, apiKey: string, payload: unknown) {
  const res = await fetch(`${POSTHOG_BASE}/api/projects/${projectId}/query/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    console.warn(`PostHog query failed (${res.status}): ${text.slice(0, 300)}`);
    return null;
  }
  return res.json();
}

async function fetchAnalytics(projectId: string, apiKey: string) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];

  const [pageviews, errors, autocapture] = await Promise.all([
    queryPostHog(projectId, apiKey, {
      kind: "TrendQuery",
      trends_filter: {
        display: "ActionsBarGraph",
        events: [{ id: "$pageview", type: "events" }],
        date_from: thirtyDaysAgo,
        breakdown: "$pathname",
        breakdown_type: "event",
        breakdown_limit: 20,
      },
    }),
    queryPostHog(projectId, apiKey, {
      kind: "TrendQuery",
      trends_filter: {
        display: "ActionsBarGraph",
        events: [{ id: "$exception", type: "events" }],
        date_from: thirtyDaysAgo,
        breakdown: "$exception_message",
        breakdown_type: "event",
        breakdown_limit: 10,
      },
    }),
    queryPostHog(projectId, apiKey, {
      kind: "TrendQuery",
      trends_filter: {
        display: "ActionsBarGraph",
        events: [{ id: "$autocapture", type: "events" }],
        date_from: thirtyDaysAgo,
        breakdown: "$event_type",
        breakdown_type: "event",
        breakdown_limit: 10,
      },
    }),
  ]);

  return { pageviews, errors, autocapture };
}

// ── Read source files ────────────────────────────────────────

function readSourceFiles(): string {
  const result: string[] = [];

  for (const dir of SOURCE_DIRS) {
    const fullPath = join(process.cwd(), dir);
    if (!existsSync(fullPath)) continue;

    const files = readdirSync(fullPath, { recursive: true })
      .filter((f) => {
        const s = statSync(join(fullPath, f as string));
        return s.isFile() && /\.(tsx|ts)$/.test(f as string);
      })
      .slice(0, 30) as string[];

    for (const file of files) {
      const content = readFileSync(join(fullPath, file), "utf-8");
      const relPath = relative(process.cwd(), join(fullPath, file));
      result.push(`--- ${relPath} ---\n${content}\n`);
    }
  }

  return result.join("\n");
}

// ── Claude API ──────────────────────────────────────────────

async function callClaude(analytics: string, sourceCode: string, apiKey: string): Promise<{ analysis: string; changes: { path: string; content: string }[] }> {
  const systemPrompt = `You are a UI/UX engineer analyzing PostHog analytics for a Next.js portfolio website at panyakorn.com (Thai/English bilingual).

Analyze the data and source code, then output improvements. Your output must have two sections:

<analysis>
- Key findings from analytics
- Suggested UI/UX improvements with rationale
</analysis>

<changes>
<file path="src/components/Example.tsx">
// updated code
</file>
</changes>

Only include <changes> if you have concrete code modifications. If everything looks good, omit <changes> entirely.

Follow these principles:
- Improve accessibility, performance, and visual polish
- Fix any pages with high error rates
- Optimize layout for most-viewed pages
- Use existing project conventions (Tailwind CSS, same component patterns)
- Do NOT add external dependencies
- Keep the existing code style and structure`;

  const res = await fetch(ANTHROPIC_API, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `## Analytics data (last 30 days)\n\n${analytics}\n\n## Current source files\n\n${sourceCode}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Claude API error (${res.status}): ${text.slice(0, 500)}`);
  }

  const data = await res.json();
  const content = data.content?.[0]?.text || "";

  // Parse analysis section
  const analysisMatch = content.match(/<analysis>([\s\S]*?)<\/analysis>/);
  const analysis = analysisMatch?.[1]?.trim() || "No analysis provided.";

  // Parse file changes
  const changes: { path: string; content: string }[] = [];
  const fileRegex = /<file path="([^"]+)">([\s\S]*?)<\/file>/g;
  let match;
  while ((match = fileRegex.exec(content)) !== null) {
    changes.push({ path: match[1], content: match[2].trim() });
  }

  return { analysis, changes };
}

// ── Git / PR operations ─────────────────────────────────────

function runGit(args: string[]) {
  execSync(`git ${args.join(" ")}`, { stdio: "pipe", encoding: "utf-8" });
}

function createBranchAndPR(
  analysis: string,
  changes: { path: string; content: string }[],
) {
  const date = new Date().toISOString().split("T")[0];
  const branchName = `${BRANCH_PREFIX}/${date}`;

  // Check if branch already exists
  try {
    execSync(`git rev-parse --verify ${branchName}`, { stdio: "pipe" });
    console.log(`Branch ${branchName} already exists — skipping`);
    return;
  } catch {}

  runGit(["checkout", "-b", branchName]);

  for (const change of changes) {
    const fullPath = join(process.cwd(), change.path);
    writeFileSync(fullPath, change.content, "utf-8");
  }

  if (changes.length === 0) {
    console.log("No changes suggested — not creating PR");
    runGit(["checkout", "main"]);
    runGit(["branch", "-D", branchName]);
    return;
  }

  runGit(["add", "-A"]);
  const diff = execSync("git diff --cached --stat", { encoding: "utf-8" });
  if (!diff.trim()) {
    console.log("No diff after applying changes — skipping PR");
    runGit(["checkout", "main"]);
    runGit(["branch", "-D", branchName]);
    return;
  }

  const commitMsg = `fix(ui): analytics-driven improvements — ${date}\n\n${analysis.slice(0, 2000)}`;
  runGit(["commit", "-m", commitMsg]);
  runGit(["push", "origin", branchName]);

  const prBody = [
    `## Analytics-driven UI improvements`,
    ``,
    `This PR was auto-generated by the Analytics PR Agent based on PostHog data.`,
    ``,
    `### Analysis`,
    ``,
    analysis,
    ``,
    `### Changes`,
    ``,
    ...changes.map((c) => `- \`${c.path}\``),
    ``,
    `---`,
    `*Generated on ${new Date().toISOString()}*`,
  ].join("\n");

  const prUrl = execSync(
    `gh pr create --base main --head ${branchName} --title "fix(ui): analytics-driven improvements — ${date}" --body "${prBody.replace(/"/g, '\\"')}"`,
    { encoding: "utf-8" },
  ).trim();

  console.log(`PR created: ${prUrl}`);

  // Switch back to main
  runGit(["checkout", "main"]);
}

// ── Main ─────────────────────────────────────────────────────

async function main() {
  console.log("Analytics PR Agent starting...");

  const projectId = requireEnv("POSTHOG_PROJECT_ID");
  const apiKey = requireEnv("POSTHOG_PERSONAL_API_KEY");
  const anthropicKey = requireEnv("ANTHROPIC_API_KEY");

  console.log("Fetching PostHog analytics...");
  const analytics = await fetchAnalytics(projectId, apiKey);
  const analyticsJson = JSON.stringify(analytics, null, 2);

  console.log("Reading source files...");
  const sourceCode = readSourceFiles();

  console.log("Calling Claude for analysis...");
  const { analysis, changes } = await callClaude(analyticsJson, sourceCode, anthropicKey);

  console.log("\n=== Analysis ===\n");
  console.log(analysis);

  if (changes.length === 0) {
    console.log("No code changes suggested.");
    return;
  }

  console.log(`\n${changes.length} file change(s) suggested:`);
  for (const c of changes) {
    console.log(`  - ${c.path} (${c.content.length} bytes)`);
  }

  console.log("\nCreating branch and PR...");
  createBranchAndPR(analysis, changes);

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
