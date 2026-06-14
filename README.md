# Panyakorn Boonyong Portfolio

Modern bilingual portfolio for Panyakorn Boonyong, built with Next.js, TypeScript, and Tailwind CSS.

## Tech stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Kanit font via `next/font/google`

## Local development

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Optional environment variable:

```bash
cp .env.example .env.local
```

```text
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Production check

```bash
npm run lint
npm run build
```

## CI/CD

This repository includes GitHub Actions workflows:

```text
.github/workflows/ci.yml                  # Runs lint + production build
.github/workflows/deploy-hostinger.yml    # Deploys to Hostinger over SSH after CI passes
```

### CI behavior

CI runs on:

- Pull requests into `main`
- Pushes to `main`

It executes:

```bash
npm ci
npm run lint
npm run build
```

### CD behavior for Hostinger

The deploy workflow runs when the `CI` workflow on `main` succeeds. It can also be triggered manually from GitHub Actions using **Run workflow**.

Add these GitHub repository secrets before enabling deployment:

| Secret | Example | Required |
|---|---|---|
| `HOSTINGER_HOST` | `123.123.123.123` or `your-server.hostinger.com` | Yes |
| `HOSTINGER_USERNAME` | `u123456789` | Yes |
| `HOSTINGER_SSH_KEY` | Private SSH key with access to Hostinger | Yes |
| `HOSTINGER_PORT` | `65002` or `22` | Optional |
| `HOSTINGER_PROJECT_PATH` | `/home/u123456789/domains/example.com/portfolio` | Yes |
| `HOSTINGER_RESTART_COMMAND` | `pm2 reload portfolio` | Optional |

The deployment script runs on Hostinger:

```bash
cd "$HOSTINGER_PROJECT_PATH"
git fetch origin main
git reset --hard origin/main
npm ci
npm run build
# then runs HOSTINGER_RESTART_COMMAND, or falls back to pm2 if available
```

> If you use Hostinger's built-in **Node.js App → Import Git Repository** deployment, you may not need `deploy-hostinger.yml`. In that setup, keep `ci.yml` for quality checks and let Hostinger auto-deploy from `main`.

## Content to update before publishing

- GitHub: https://github.com/panyakorn04
- LinkedIn: https://www.linkedin.com/in/eee-panyakorn-512b17304/
- Add custom domain after deployment
- Replace private project descriptions with approved screenshots or sanitized mockups if available
- Add measurable metrics / impact once confirmed

## Important files

```text
src/app/[lang]/page.tsx           # Localized portfolio page content
src/app/[lang]/layout.tsx         # Localized metadata and root layout
src/app/(root)/page.tsx           # Redirect from / to default locale
src/app/sitemap.ts                # Localized sitemap.xml output
src/app/robots.ts                 # robots.txt output
src/app/globals.css               # Global styles
public/assets/profile.png         # Profile photo extracted from resume
public/Panyakorn_Boonyong_Resume.pdf
```

## Deploying to Vercel

1. Push this folder to a GitHub repository.
2. Import the repository in Vercel.
3. Keep the default build command:

```bash
npm run build
```

4. Keep the default output settings for Next.js.
5. Add the final Vercel/custom domain URL back into the resume and portfolio contact links.

## Deploying to Hostinger

Recommended Hostinger settings for this Next.js app:

```text
Type: Node.js App
Source: Import GitHub Repository
Branch: main
Node.js version: 22.x or 24.x
Install command: npm ci
Build command: npm run build
Start command: npm run start
Output directory: .next
```
