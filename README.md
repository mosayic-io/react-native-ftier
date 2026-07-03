# React Native Starter Template

A [Kealy Studio](https://kealystudio.com) template — part of the **free tier** of the *App Dev with AI* course.

This is your starting point for building a real iOS, Android, and web app with [Expo](https://expo.dev) and React Native, designed to be developed with AI coding tools like Claude Code. It runs entirely in [Expo Go](https://expo.dev/go) — no paid accounts, native builds, or backend required.

## What's inside

- **Expo SDK 56** (React Native 0.85, React 19.2.3) with **expo-router** file-based routing and typed routes
- **Design token theme system** — semantic colors, spacing, typography, and radius scales in `src/lib/theme.ts`, with full light/dark support
- **Persisted theme picker** — light/dark/system mode on the Settings tab, stored with Zustand + AsyncStorage and restored on launch
- **UI primitives** — `Button`, `Input`, and `Text` components built on the theme tokens
- **Error boundaries** — a global boundary in the root layout plus a `ScreenErrorBoundary` wrapping every screen
- **Local storage** — `@react-native-async-storage/async-storage` with typed helpers in `src/lib/storage.ts`
- **Common device capabilities pre-installed** — camera, photo picker, media library, location, haptics, video, SVG, gradients, blur, clipboard, sharing, file system, and WebView, with permissions pre-configured — so builds never need a native rebuild when you start using them
- **TypeScript strict mode**, ESLint, and the **React Compiler** (automatic memoization)
- **CLAUDE.md** — project conventions so your AI assistant writes correct, current Expo code

## Requirements

- [Node.js](https://nodejs.org) 22.13 or newer
- For the iOS Simulator: Xcode (Mac only) · For the Android Emulator: Android Studio
- Or just your phone with the [Expo Go](https://expo.dev/go) app

## Get started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the app:

   ```bash
   npm start
   ```

3. In the terminal output, press `i` for the iOS Simulator, `a` for the Android Emulator, `w` for the web — or scan the QR code with Expo Go on your phone.

## Project structure

```
src/
├── app/            # Screens — each file is a route (Home, Settings)
├── components/
│   ├── ui/         # Button, Input, Text
│   ├── error/      # Error boundaries
│   └── AppTabs     # Tab bar (native + web variants)
├── hooks/          # useColors, useIsDark, useColorScheme
├── lib/            # theme.ts (design tokens), storage.ts (AsyncStorage helpers)
└── stores/         # Zustand stores (theme mode, persisted on device)
```

## Where to make changes

- Screens live in `src/app/` — each file is a route ([file-based routing](https://docs.expo.dev/router/introduction/))
- Colors, spacing, and typography all come from `src/lib/theme.ts` — change the tokens there and the whole app follows
- Reusable components live in `src/components/ui/`
- Global state goes in `src/stores/` (see `themeStore.ts` for the persisted-store pattern)

Add new libraries with `npx expo install <package>` (not plain `npm install`) so versions stay compatible with the SDK.

## Useful commands

```bash
npm run lint       # ESLint
npm run typecheck  # TypeScript
```

## License

© Kealy Studio. Provided to students of the App Dev with AI course for use in their own projects. Not for redistribution as a template.
