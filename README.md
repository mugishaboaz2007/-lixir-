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
- Responsive desktop and mobile layouts.

## Production build

```sh
npm run lint
npm run build
npm run preview
```

The static site is generated in `dist/` and can be hosted on any static hosting provider. Build command: `npm run build`; output directory: `dist`.

## Data and limitations

This MVP keeps all task data in the browser's local storage. Data is specific to the browser and device, is not synchronized, and can be removed by clearing site data. There is no account recovery or server backup. No environment variables or external services are required. Google Fonts are loaded from Google Fonts; the UI falls back to system sans-serif fonts if the service is unavailable.

## Next steps for a shared production app

Add authentication and a hosted database only if cross-device sync or shared lists become a requirement. If using Supabase, create per-user task ownership and enforce it with Row Level Security before exposing data access from the client.
# -lixir-
# -lixir-
# -lixir-
# -lixir-
# -lixir-
