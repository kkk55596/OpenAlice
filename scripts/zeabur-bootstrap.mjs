import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const CONFIG_DIR = resolve('data/config')
const CONNECTORS_FILE = resolve(CONFIG_DIR, 'connectors.json')

async function main() {
  const port = Number(process.env.PORT || 3002)
  if (!Number.isFinite(port) || port <= 0) {
    throw new Error(`Invalid PORT: ${process.env.PORT}`)
  }

  await mkdir(CONFIG_DIR, { recursive: true })

  let connectors = {}
  try {
    const raw = await readFile(CONNECTORS_FILE, 'utf8')
    connectors = JSON.parse(raw)
  } catch {
    connectors = {}
  }

  const next = {
    ...connectors,
    web: {
      ...(connectors.web || {}),
      port,
    },
  }

  await writeFile(CONNECTORS_FILE, `${JSON.stringify(next, null, 2)}\n`, 'utf8')

  console.log(`[zeabur-bootstrap] Web connector port set to ${port}`)
}

main().catch((err) => {
  console.error('[zeabur-bootstrap] Failed to prepare config:', err)
  process.exit(1)
})
