# Panyakorn Boonyong Portfolio

Modern one-page portfolio for Panyakorn Boonyong, built with Next.js, TypeScript, and Tailwind CSS.

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
