import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'

async function listFiles(directory, base = directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(entries.map((entry) => {
    const fullPath = path.join(directory, entry.name)
    return entry.isDirectory() ? listFiles(fullPath, base) : [
      `/${path.relative(base, fullPath).split(path.sep).join('/')}`,
    ]
  }))
  return files.flat()
}

function offlineServiceWorker() {
  return {
    name: 'elixir-offline-service-worker',
    apply: 'build',
    async closeBundle() {
      const outputDirectory = path.resolve('dist')
      const files = (await listFiles(outputDirectory)).filter((file) => !file.endsWith('.map'))
      const versionHash = createHash('sha256')
      for (const file of files) versionHash.update(file).update(await readFile(path.join(outputDirectory, file.slice(1))))
      const version = versionHash.digest('hex').slice(0, 12)
      const worker = `const CACHE_NAME = 'elixir-shell-${version}';\nconst APP_FILES = ${JSON.stringify(files)};\nself.addEventListener('install', (event) => { event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES))); });\nself.addEventListener('activate', (event) => { event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith('elixir-shell-') && key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim())); });\nself.addEventListener('message', (event) => { if (event.data === 'SKIP_WAITING') self.skipWaiting(); });\nself.addEventListener('fetch', (event) => { const request = event.request; const url = new URL(request.url); if (request.method !== 'GET' || url.origin !== self.location.origin) return; if (request.mode === 'navigate') { event.respondWith(fetch(request).then((response) => { if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', response.clone())); return response; }).catch(async () => (await caches.match('/index.html')) || Response.error())); return; } event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => { if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone())); return response; }))); });\n`
      await writeFile(path.join(outputDirectory, 'sw.js'), worker)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), offlineServiceWorker()],
})
