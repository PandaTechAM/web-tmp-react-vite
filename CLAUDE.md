# CLAUDE.md

Guidance for Claude Code working in this repository.

## Project

This is the Pandatech React + Vite template. It is the starting point for new frontend projects: clone, rename, prune, build. Replace this section with the actual project description after you derive a real project from the template.

## Toolchain (pinned, stable)

- Node **25** (Docker builds use `node:25-alpine`)
- TypeScript **6.0.x**
- Vite **8**
- React **19.2**
- React Router **7**
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
├── components/  Reusable UI
├── hooks/       Custom hooks
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

## Linting & formatting

- Flat config: `eslint.config.js`
- `eslint-plugin-import-x` (NOT `eslint-plugin-import`)
- TS-aware lint via `typescript-eslint`'s `recommendedTypeChecked`
- React Compiler rules off (codebase has not been migrated)
- `no-console` allows `error` and `warn` only
- Prettier integrated via `eslint-plugin-prettier` -- `npm run lint` enforces formatting too
- `vite-plugin-checker` surfaces TS + ESLint errors in the dev overlay (`useFlatConfig: true`)

## Build / runtime

- Dev server: `https://react.pandatech.it:5173` (HTTPS auto-enabled when `cert/*.pem` files exist)
- Production: multi-stage Docker, `node:25-alpine` builds, `nginx:1.29-alpine` serves on port 3000
- `nginx.conf` handles gzip, immutable 1-year cache for `/assets/`, no-cache for `index.html`, SPA fallback

## CI/CD

`.github/workflows/ci.yml` builds + pushes to the Pandatech registry on push to `development`, `qa`, `staging`, `main`. The `development` branch also `kubectl apply`s `kubernetes/deployment.yaml`. Action versions are pinned: `actions/checkout@v6`, `docker/login-action@v4`, `docker/build-push-action@v7`. The Cleanup step is the canonical pattern with `IMAGE_REF` variable, `[ -n ]` guard, `xargs -r`.

## Things to avoid

- Do NOT add `--legacy-peer-deps` or `--force` to install commands. If install fails, diagnose the peer-dep error and fix the version mismatch.
- Do NOT bring back `vite-plugin-pwa`, `vite-plugin-eslint*`, `vite-plugin-chunk-split`, `vite-plugin-imagemin`, `eslint-plugin-import` (use `import-x`), `react-quill` (use `react-quill-new`), `@types/dompurify`, `@types/react-router-dom`.
- Do NOT add `baseUrl` to `tsconfig.app.json`. Use `paths` only.
- Do NOT import Node built-ins in client code. They are only valid in `vite.config.ts` (covered by `tsconfig.node.json`).
- Do NOT use `forwardRef`. React 19 takes `ref` as a regular prop.
- Do NOT silently reformat the codebase to a different prettier style. Adjust the eslint config if the project's style differs from the template default.
- Do NOT skip git hooks (`--no-verify`, `--no-gpg-sign`).
