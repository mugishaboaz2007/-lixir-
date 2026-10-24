# Élixir for Android and iOS

Native task manager with an editorial, dark-luxe interface, built with Expo SDK 58, React Native, TypeScript, Expo Router, and AsyncStorage. The existing Vite web app remains in the repository root; this folder is the shared-code mobile app.

## Local development

Requirements: Node.js LTS and an Expo-compatible phone, Android Studio emulator, or Xcode simulator.

```sh
npm ci
npm run typecheck
npm start
```

Install Expo Go on a physical phone and scan the QR code, or press `a` / `i` in the Expo terminal to launch an installed Android emulator / iOS simulator. For native development builds, use the EAS `development` profile below.

## Features

- Add tasks with a category and optional due date.
- Complete and remove tasks, with a confirmation before deletion.
- Browse Today, Inbox, Upcoming, and Done tabs.
- Search tasks by name.
- Store tasks on-device for offline use and persistence across launches.
- Keyboard-aware form, input validation, safe areas, accessible labels, and storage error recovery.

No account or network service is required. Data is local to this device and is not synchronized or backed up. Clearing app data removes saved tasks. There are no permissions requested by this MVP.

## EAS builds

Sign in to Expo and configure the project once:

```sh
npx eas-cli login
npx eas-cli build:configure
```

Create an Android preview APK for device testing:

```sh
npx eas-cli build --platform android --profile preview
```

Create installable development builds with Expo Dev Client:

```sh
npx eas-cli build --platform android --profile development
npx eas-cli build --platform ios --profile development
```

Create production store builds:

```sh
npx eas-cli build --platform android --profile production
npx eas-cli build --platform ios --profile production
```

The production Android profile produces an Android App Bundle. EAS prompts to create or select signing credentials and stores managed credentials with the Expo account. Do not commit signing material. iOS signing requires an Apple Developer account and EAS will guide certificate and provisioning setup. Google Play Console and Apple Developer Program accounts may require paid enrollment. Neither store build nor publication has been performed from this workspace.

The Expo free plan currently includes up to 15 Android and 15 iOS builds each month at low queue priority; paid build credits are optional for this MVP. Store distribution requires a Google Play Console account ($25 one time) and Apple Developer Program membership ($99 per year). Fees are in USD; regional pricing, taxes, and account eligibility can vary. Current [EAS pricing](https://expo.dev/pricing), [Google Play registration](https://support.google.com/googleplay/android-developer/answer/6112435), and [Apple membership](https://developer.apple.com/programs/) should be checked before enrollment.

Identifiers are currently `com.boaz.to` for both platforms; replace them with identifiers under a domain or namespace you control before a public release. Store submission is separate from building; use EAS Submit or upload the generated artifacts through the respective store portals after preparing privacy disclosures, screenshots, and listing copy.

## Verification

Run `npm run typecheck` for TypeScript validation. Android and iOS emulators, Android SDK tools, Xcode, EAS credentials, and physical devices are not configured in the current environment, so native runtime and release builds must be checked on a configured development machine or through EAS Build.

## Security note

As of 2026-10-22, `npm audit --omit=dev` reports 19 high findings through Expo/Metro dependencies, including `braces` and `node-forge`. The cited advisories currently list no patched versions, and npm's forced fix would downgrade Expo to an unsupported SDK; no forced downgrade was applied. These packages are in the build/tooling dependency graph and are not task data services or credentials, but the advisories should be rechecked before release: [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), [node-forge advisory](https://github.com/advisories/GHSA-86w9-cpqp-85rv).
