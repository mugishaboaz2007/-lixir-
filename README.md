# to

Élixir is a responsive, editorial task manager built with React and Vite. It pairs a dark aubergine palette and lavender accents with local-first task storage in this browser.

The shared-code native Android and iOS app is in [`mobile/`](mobile/README.md) and uses Expo, React Native, TypeScript, and on-device storage.

## Run locally

Requirements: Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## Features

- Create tasks with a list and optional due date.
- Complete and delete tasks.
- Browse Today, Inbox, Upcoming, and Completed views.
- Search tasks by name.
- Persist tasks across reloads in the current browser.
- Open the installed app offline after its first successful online load.
- Persist tasks in IndexedDB, including while offline.
- Install the web app on supported browsers and devices.
- Responsive desktop and mobile layouts.

## Production build

```sh
npm run lint
npm run build
npm run preview
```

The static site is generated in `dist/` and can be hosted on any static hosting provider. Build command: `npm run build`; output directory: `dist`.

## Data and limitations

This MVP keeps all task data in IndexedDB on the current browser and device. Existing tasks in the previous `localStorage` format are copied into IndexedDB on first launch; the old copy is retained. Data is not synchronized with a server, has no account recovery or backup, and can be removed by clearing site data. There is no backend or authentication in this project, so offline changes remain local and no server synchronization is attempted. The service worker caches the production app shell and same-origin static files; it does not cache private API responses. Serve the app over HTTPS (or localhost) and open it online once before expecting offline launch. No additional dependencies or environment variables are required. System fonts are used so the interface does not depend on a third-party font service.

## Next steps for a shared production app

Add authentication and a hosted database only if cross-device sync or shared lists become a requirement. If using Supabase, create per-user task ownership and enforce it with Row Level Security before exposing data access from the client.
# -lixir-
# -lixir-
# -lixir-
# -lixir-
# -lixir-
# -lixir-
# -lixir-
