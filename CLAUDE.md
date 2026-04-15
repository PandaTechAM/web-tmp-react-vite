# CLAUDE.md

Guidance for Claude Code working in this repository.

## Project

This is the Pandatech React + Vite template. It is the starting point for new frontend projects: clone, rename, prune, build. Replace this section with the actual project description after you derive a real project from the template.

## Toolchain (pinned, stable)

- Node **25** (Docker builds use `node:25-alpine`)
- TypeScript **6.0.x**
- Vite **8** (Rolldown bundler under the hood)
- React **19.2**
- React Router **7** (data routers, `lazy:` route loaders)
- Redux Toolkit **2** (with RTK Query)
- Ant Design **6** + `@ant-design/icons` **6**
- ESLint **9** (pinned, NOT 10)
- nginx **1.29** in production runtime
- `@types/node` tracks the Node major used in Docker

### Why ESLint is pinned to 9

Three plugins block ESLint 10:

- `eslint-plugin-react@7.37` (max ESLint 9.7)
- `eslint-plugin-react-hooks@7.0` (max ESLint 9)
- `eslint-plugin-jsx-a11y@6.10` (max ESLint 9)

Move them all together when they support 10. Do not bump ESLint individually.

### Why TypeScript is pinned to 6.0

`typescript-eslint@8.58` peer is `>=4.8.4 <6.1.0`. So `^6.0.x` is fine, `^6.1.x` is not. Move both together.

## Scripts

- `npm run dev` -- Vite dev server (HTTPS on `react.pandatech.it:5173` if certs are present, plain HTTP otherwise)
- `npm run build` -- `tsc -b && vite build`
- `npm run preview` -- preview the production build
- `npm run lint` -- ESLint on the whole tree
- `npm run lint:fix` -- ESLint with `--fix`
- `npm run format` / `format:check` -- Prettier
- `npm run type-check` -- `tsc --noEmit`

Definition of "clean": `npm run type-check`, `npm run build`, and `npm run lint` must all exit 0 with zero warnings.

## Source layout

```
src/
├── api/         RTK Query base + endpoint slices
├── assets/      Static resources
├── components/  Reusable UI (incl. RouteErrorBoundary)
├── hooks/       Custom hooks (typed store hooks)
├── layouts/     Layout shells
├── pages/       Route components (lazy-loaded)
├── router/      Router config + path constants
├── store/       Redux store
├── styles/      Global CSS + antd theme
└── types/       Shared TS types
```

## Path aliases

`vite.config.ts` auto-discovers every top-level subfolder of `src/`. When you add a new folder, also add the matching `paths` entry in `tsconfig.app.json`:

```json
"newFolder": ["./src/newFolder"],
"newFolder/*": ["./src/newFolder/*"]
```

Both must agree or imports will fail at build time.

## Application shell

- `src/main.tsx` mounts Provider (Redux) → ConfigProvider (antd theme) → AntdApp (message/notification context) → Suspense (lazy-route fallback shows a centered `<Spin>`) → RouterProvider.
- `src/router/router.tsx` declares the routes. The root layout route has an `errorElement` (`components/RouteErrorBoundary`) so route-level throws render a friendly page instead of blanking the app.
- Routes use the React Router 7 `lazy:` loader pattern (`async () => ({ Component })`) so each page lands in its own chunk.
- `src/router/paths.ts` is the single source of truth for route paths. Import `RouterPaths` rather than hard-coding strings.

## State / data flow

- `src/store/store.ts` registers the single RTK Query `api` reducer. `setupListeners` is wired so per-query `refetchOnFocus` / `refetchOnReconnect` opt-ins work.
- `src/api/api.ts` defines the `baseQuery` (with bearer token from `localStorage`) and `baseQueryWithReauth` which serializes refresh attempts via an `async-mutex`. This is template scaffolding; swap in the real auth flow per project (see "Things to avoid" below for the security note on `localStorage`).
- `src/api/exampleApi.ts` is a placeholder showing the `injectEndpoints` pattern. Delete once real endpoints exist.
- Add new feature endpoints with `api.injectEndpoints({...})` in their own file under `src/api/`. The base `api` slice owns `tagTypes`; declare invalidation tags there as the project grows.
- Use `useAppDispatch` / `useAppSelector` from `hooks/storeHooks` instead of the untyped versions from `react-redux`.

## Environment variables

- Declared in `src/vite-env.d.ts` (currently only `VITE_BASE_URL`).
- `src/api/api.ts` throws at module init if `VITE_BASE_URL` is missing. There is no silent fallback. Add the env var to `.env.local` for local dev, and to the CI `build-args` (or container env) for builds.
- `.env.local` is git-tracked as the project's local-dev template; never put real secrets there. Other `.env*` variants are gitignored.

## Linting & formatting

- Flat config: `eslint.config.js`
- `eslint-plugin-import-x` (NOT `eslint-plugin-import`)
- TS-aware lint via `typescript-eslint`'s `recommendedTypeChecked`
- React Compiler rules off (codebase has not been migrated)
- `no-console` allows `error` and `warn` only
- Prettier integrated via `eslint-plugin-prettier`. The inline prettier options in `eslint.config.js` mirror `.prettierrc` (including `endOfLine: "auto"`) so the CLI and ESLint agree on Windows checkouts.
- `vite-plugin-checker` surfaces TS + ESLint errors in the dev overlay (`useFlatConfig: true`)

### Disabled lint rules and why

- `react-hooks/exhaustive-deps`: off. Many components intentionally narrow effect deps; the rule's auto-fix is too eager. Re-evaluate per project if the codebase stays disciplined.
- `react-hooks/immutability`, `refs`, `set-state-in-effect`, `preserve-manual-memoization`, `purity`: off. These are React Compiler rules; opt in once the codebase is migrated.
- `@typescript-eslint/no-unused-vars`: off. TypeScript already enforces this via `noUnusedLocals` / `noUnusedParameters` in `tsconfig.app.json`. Avoiding double diagnostics.
- `@typescript-eslint/no-explicit-any`, `no-unsafe-call`, `no-unsafe-assignment`, `no-unsafe-member-access`: off. Practical concession for the antd / RTK Query type surface; tighten per project if domain code can hold the line.
- `@typescript-eslint/no-floating-promises`: off. `react-router` `useNavigate()` returns a `Promise<void>`; the codebase wraps it in `void navigate(...)` instead of awaiting. Re-enable once you have a project-wide pattern.

## Build / runtime

- Dev server: `https://react.pandatech.it:5173` (HTTPS auto-enabled when `cert/*.pem` files exist; see `cert/README.md`).
- Production: multi-stage Docker, `node:25-alpine` builds, `nginx:1.29-alpine` serves on port 3000.
- `nginx.conf` handles gzip, immutable 1-year cache for `/assets/`, no-cache for `index.html`, SPA fallback, plus a baseline of security headers (CSP is intentionally NOT set; add per project).
- `vite.config.ts` `manualChunks` splits `antd-vendor`, `redux-vendor`, `react-vendor`, and a generic `vendor` chunk so app code changes do not invalidate the long-cached vendor bundles. `chunkSizeWarningLimit` is 800 kB to absorb antd.

## CI/CD

`.github/workflows/ci.yml` builds + pushes to the Pandatech Nexus registry on push to `development`, `qa`, `staging`, `main`. The `development` branch also `kubectl apply`s `kubernetes/deployment.yaml`. Action versions are pinned: `actions/checkout@v6`, `docker/login-action@v4`, `docker/build-push-action@v7`. The Cleanup step is the canonical pattern with `IMAGE_REF` variable, `[ -n ]` guard, `xargs -r`. Per-branch env is set in the "Configure environment" step (`VITE_BASE_URL`, `K8S_*`, `DEPLOYMENT_ENV`).

Required secrets: `nexus_username`, `nexus_password`. Self-hosted runner (`runs-on: self-hosted`) with kubeconfig at `/home/runner/.kube/config`.

The Nexus registry is HTTP-only and whitelisted in the host docker daemon's `insecure-registries`. If you ever add another `docker/setup-buildx-action@v4` step, you MUST set `with: { driver: docker }` so the buildx kit talks to the local daemon instead of spinning up a `docker-container` builder that bypasses the whitelist.

## Things to avoid

- Do NOT add `--legacy-peer-deps` or `--force` to install commands. If install fails, diagnose the peer-dep error and fix the version mismatch.
- Do NOT bring back `vite-plugin-pwa`, `vite-plugin-eslint*`, `vite-plugin-chunk-split`, `vite-plugin-imagemin`, `eslint-plugin-import` (use `import-x`), `react-quill` (use `react-quill-new`), `@types/dompurify`, `@types/react-router-dom`.
- Do NOT add `baseUrl` to `tsconfig.app.json`. Use `paths` only.
- Do NOT import Node built-ins in client code. They are only valid in `vite.config.ts` (covered by `tsconfig.node.json`).
- Do NOT use `forwardRef`. React 19 takes `ref` as a regular prop.
- Do NOT silently reformat the codebase to a different prettier style. Adjust the eslint config if the project's style differs from the template default.
- Do NOT skip git hooks (`--no-verify`, `--no-gpg-sign`).
- The token in `localStorage` (see `src/api/api.ts`) is template scaffolding for cookie-less APIs. If your backend issues httpOnly cookies, swap the bearer header for `credentials: 'include'` and delete the `localStorage` calls before shipping; tokens in `localStorage` are XSS-readable.
