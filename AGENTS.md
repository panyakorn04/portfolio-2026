<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-skills -->
# Next.js skills — use them

This repo ships project skills in `.agents/skills/`. Activate them proactively (no need to ask first) when the work matches:

- **nextjs-code-review** — when reviewing Next.js App Router changes: Server/Client Component boundaries, Server Actions, data fetching, caching, middleware, metadata, API routes. Use before finishing a feature or preparing a PR.
- **nextjs-performance** — when writing or optimizing Next.js code that touches Core Web Vitals (LCP, INP, CLS), `next/image`, `next/font`, caching (`unstable_cache`, `revalidateTag`, ISR), Server Components, Suspense streaming, or bundle size.
- **vercel-react-best-practices** — 69 prioritized React performance rules covering waterfalls, bundle size, re-renders, and advanced patterns. Use when writing or reviewing any React component.
- **vercel-composition-patterns** — composable component architecture patterns (compound components, render props, context) for scalable Next.js apps.
- **shadcn** — shadcn/ui component usage, customization, and Tailwind integration. Use when modifying or extending UI components.
- **react-doctor** — validates animation durations, enforces typography scale, checks component accessibility, and prevents layout anti-patterns in Tailwind CSS.
- **ui-ux-pro-max** — advanced UI/UX design patterns for polished frontend interfaces.
- **deploy-to-vercel** — deploy Next.js apps with correct config and environment setup (if deploying to Vercel).
- **web-design-guidelines** — web design best practices for layout, color, typography, and responsive design.
- **writing-guidelines** — content and documentation writing standards.
- **vercel-optimize** — Vercel Optimize integration for A/B testing and feature flags.
- **vercel-cli-with-tokens** — Vercel CLI usage with authentication tokens.
- **vercel-react-view-transitions** — React view transitions and animations.
- **migrate-radix-to-base** — migration helpers from Radix UI to Base UI.

Load a skill's `references/*.md` files on demand for the specific area you are working on rather than reading everything up front.
<!-- END:nextjs-skills -->
