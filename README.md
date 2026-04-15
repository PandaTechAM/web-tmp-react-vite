# React Vite Template

Pandatech's opinionated baseline for new React + Vite projects. Clone, rename, prune what you do not need, and start building.

## What's inside

A minimal but production-ready setup with the toolchain pinned to versions verified working together. Pre-wired:

- **React 19** with the new JSX runtime, no `forwardRef` legacy patterns
- **Vite 8** (Rolldown) + `@vitejs/plugin-react` for fast HMR (uses native `oxc` transform)
- **TypeScript 6** with project references (`tsconfig.app.json` + `tsconfig.node.json`)
- **ESLint 9** flat config with `typescript-eslint`, `eslint-plugin-import-x`, `eslint-plugin-react`, `react-hooks`, `jsx-a11y`, and Prettier integration
- **React Router 7** with lazy-loaded routes
- **Redux Toolkit 2** + **RTK Query** with a mutex-guarded reauth pattern
- **Ant Design 6** + **`@ant-design/icons` 6** with a `ConfigProvider` theme
- **mkcert HTTPS** dev server on `https://react.pandatech.it:5173` (auto-detected, see `cert/README.md`)
- **Docker** multi-stage build (`node:25-alpine` -> `nginx:1.29-alpine`) with gzip + immutable asset cache + SPA fallback
- **GitHub Actions CI** wired to the Pandatech registry with env-per-branch and Kubernetes deploy on `development`

## Pre-installed packages

### Production

| Package                           | Why                                                   |
| --------------------------------- | ----------------------------------------------------- |
| `react`, `react-dom`              | Core                                                  |
| `react-router-dom`                | Routing                                               |
| `@reduxjs/toolkit`, `react-redux` | State + RTK Query                                     |
| `antd`, `@ant-design/icons`       | UI library                                            |
| `classnames`                      | Conditional class composition                         |
| `dompurify`                       | Sanitizing HTML before `dangerouslySetInnerHTML`      |
| `async-mutex`                     | Used by the RTK Query reauth flow in `src/api/api.ts` |

### Dev

| Package                                               | Why                                   |
| ----------------------------------------------------- | ------------------------------------- |
| `typescript`, `@types/*`                              | Type system                           |
| `vite`, `@vitejs/plugin-react`, `vite-plugin-checker` | Build + HMR + inline type/lint errors |
| `eslint` family (9.x pinned), `prettier`, `globals`   | Linting + formatting                  |
| `postcss`, `autoprefixer`                             | CSS processing                        |

## Common optional packages (NOT pre-installed)

Add these only if your project actually needs them:

| Package                                                                                | Use case                                        |
| -------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `i18next`, `react-i18next`, `i18next-browser-languagedetector`, `i18next-http-backend` | Internationalization                            |
| `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/modifiers`                             | Drag and drop                                   |
| `lottie-react`                                                                         | Lottie animations                               |
| `@ant-design/charts`                                                                   | Charts                                          |
| `react-quill-new`                                                                      | Rich text editor (the React 19 compatible fork) |
| `@microsoft/signalr`                                                                   | SignalR client                                  |
| `vitest`, `@testing-library/react`, `@testing-library/jest-dom`                        | Unit testing                                    |
| `playwright`                                                                           | E2E testing                                     |

## Quick start

```bash
# 1. Clone (or use as a template)
git clone <this-repo> my-new-project
cd my-new-project

# 2. Update name in package.json
# Edit "name": "react-vite-template" -> "my-new-project"

# 3. Install
npm install

# 4. (Optional) Set up local HTTPS
# See cert/README.md - one-time mkcert install per machine

# 5. Run
npm run dev
```

## Scripts

| Command                | Purpose                                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| `npm run dev`          | Vite dev server. HTTPS on `react.pandatech.it:5173` if certs exist, plain HTTP otherwise |
| `npm run build`        | Type-check then bundle to `dist/`                                                        |
| `npm run preview`      | Serve the production build locally                                                       |
| `npm run lint`         | Run ESLint on the whole tree                                                             |
| `npm run lint:fix`     | Run ESLint with `--fix`                                                                  |
| `npm run format`       | Run Prettier across the tree                                                             |
| `npm run format:check` | Verify Prettier formatting without writing                                               |
| `npm run type-check`   | Run `tsc --noEmit`                                                                       |

## Path aliases

`vite.config.ts` auto-discovers every top-level subfolder of `src/` and exposes it as a bare import:

```ts
import HomePage from 'pages/HomePage' // src/pages/HomePage.tsx
import { store } from 'store/store' // src/store/store.ts
import { antdTheme } from 'styles/theme' // src/styles/theme.ts
```

When you add a new top-level folder under `src/`, also add the matching entry in `tsconfig.app.json` `paths` so TypeScript resolves it. Pattern:

```json
"newFolder": ["./src/newFolder"],
"newFolder/*": ["./src/newFolder/*"]
```

## Folder layout

```
src/
├── api/         RTK Query base + endpoint slices
├── assets/      Images, fonts, static resources
├── components/  Reusable UI components
├── hooks/       Custom hooks (typed store hooks etc.)
├── layouts/     Layout shells (sidebar, header, etc.)
├── pages/       Route components, lazy-loaded
├── router/      Router config + path constants
├── store/       Redux store config
├── styles/      Global CSS, antd theme tokens
└── types/       Shared TS types
```

## What to do before starting your project

1. Rename the project in `package.json`, `kubernetes/deployment.yaml`, and `README.md`
2. Pick a unique dev port in `vite.config.ts` if multiple Pandatech projects run simultaneously
3. Edit `.env.local` with your real API base URL
4. Update `src/styles/theme.ts` with your brand tokens
5. Replace the demo home page in `src/pages/HomePage.tsx`
6. Update `src/api/api.ts` if your auth/refresh flow differs from the default
7. Update CI env vars (`VITE_*` build args, registry path) in `.github/workflows/ci.yml`
8. Add or remove packages per the optional list above
9. Install local CA once: `mkcert -install` (see `cert/README.md`)

## Things this template deliberately does NOT include

- **PWA / service worker** — bring `vite-plugin-pwa` back only if you actually need offline support
- **Unit tests / Vitest** — opt in per project
- **Storybook** — opt in per project
- **i18n** — opt in per project (most internal admin panels do not need it)
- **Tailwind / styled-components / emotion** — antd ships its own CSS-in-JS; pick one if you must
- **`baseUrl` in `tsconfig.app.json`** — deprecated in TS 6, use `paths` only
- **`eslint-plugin-import`** — replaced by `eslint-plugin-import-x` (flat-config compatible)

## Toolchain pin reasoning

ESLint is pinned to **9.x** (not 10) because three plugins still cap at ESLint 9: `eslint-plugin-react@7.37`, `eslint-plugin-react-hooks@7.0`, and `eslint-plugin-jsx-a11y@6.10`. Bump them all together when they support 10.

TypeScript is pinned to **6.0.x** because `typescript-eslint@8.58` peer is `<6.1.0`. Move both together when typescript-eslint loosens the cap.

`@types/node` tracks **Node 25** to match the Docker build image (`node:25-alpine`).
