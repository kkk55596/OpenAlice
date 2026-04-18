# Deploy OpenAlice on Zeabur

This guide deploys OpenAlice as a single service on Zeabur.

## 1) Prepare repository

Make sure your fork/branch includes:

- Build script: `pnpm build`
- Zeabur runtime script: `pnpm start:zeabur`

`start:zeabur` runs a bootstrap step that writes `data/config/connectors.json` so OpenAlice listens on Zeabur's `PORT` environment variable.

## 2) Create project on Zeabur

1. Log in to Zeabur and create a new project.
2. Add service from your GitHub repository.
3. Select the root directory of this repo.

## 3) Configure build/start

Use these settings in Zeabur:

- **Install Command**: `pnpm install --frozen-lockfile`
- **Build Command**: `pnpm build`
- **Start Command**: `pnpm start:zeabur`

## 4) Configure environment variables

Recommended minimum variables:

- `NODE_ENV=production`
- `PORT` (Zeabur usually injects this automatically)

For cloud deployment, avoid local Claude login mode. Configure API-key based provider in `data/config/ai-provider.json`, for example:

- Vercel AI SDK + Anthropic/OpenAI/Google key
- Or Agent SDK with API key mode

## 5) First boot checks

After deployment, verify:

1. Logs show: `[zeabur-bootstrap] Web connector port set to ...`
2. Service becomes healthy and exposes a public URL.
3. Open the URL and confirm Web UI is reachable.

## 6) Persistent data

OpenAlice stores runtime data under `data/` (sessions, configs, snapshots, logs). In production, attach a persistent volume in Zeabur and mount it for this service to avoid data loss on redeploy.

## Notes

- This repo is a monorepo; the root build already handles package builds via Turborepo.
- If deployment is slow, keep dependency cache enabled in Zeabur.

## Troubleshooting

### Error: `Cannot find module '/src/packages/ibkr/index.js'`

If Zeabur logs show:

```txt
Error: Cannot find module '/src/packages/ibkr/index.js'
```

it usually means Zeabur is starting the wrong entrypoint (or wrong root directory in a monorepo).

Fix it with these exact settings:

- **Root Directory**: repository root (`/`) — **not** `packages/ibkr`
- **Install Command**: `pnpm install --frozen-lockfile`
- **Build Command**: `pnpm build`
- **Start Command**: `pnpm start:zeabur`

Then redeploy. OpenAlice runtime entrypoint should be `dist/main.js` from the repo root (via `start:zeabur`), not `packages/ibkr/index.js`.

