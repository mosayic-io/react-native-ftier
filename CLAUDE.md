# CLAUDE.md

Expo SDK 56 app — React Native 0.85, React 19.2.3, TypeScript (strict), file-based routing via expo-router. Runs on iOS, Android, and web, entirely in Expo Go — no dev build or backend required.

## Expo has changed — check the docs first

Your training data on Expo is likely stale. Consult the official docs before writing code — do not use patterns from older SDKs from memory:

- https://docs.expo.dev/llms.txt — index of all AI-formatted documentation files
- https://docs.expo.dev/llms-full.txt — complete Expo docs (Expo Router, development process)
- https://docs.expo.dev/llms-sdk.txt — complete Expo SDK module docs
- https://docs.expo.dev/versions/v56.0.0/ — versioned docs for this exact SDK

## Commands

- `npm start` — start the dev server (press `i` / `a` / `w` for iOS / Android / web)
- `npm run ios` / `npm run android` / `npm run web` — start directly on a platform
- `npm run lint` — ESLint via `expo lint`
- `npm run typecheck` — TypeScript check via `tsc --noEmit`

Install libraries with `npx expo install <package>` — never plain `npm install` for runtime packages. It picks versions compatible with SDK 56.

## Project structure

```
src/
├── app/                  # Expo Router file-based routing
│   ├── _layout.tsx       # Root layout: ErrorBoundary, ThemeProvider, tabs
│   ├── index.tsx         # Home screen
│   └── settings.tsx      # Settings screen (theme mode picker)
├── components/
│   ├── ui/               # UI primitives (Button, Input, Text)
│   ├── error/            # Error boundaries (ErrorBoundary, ScreenErrorBoundary)
│   └── AppTabs.tsx       # Tab bar (native tabs; AppTabs.web.tsx for web)
├── hooks/                # Global hooks (useColors, useIsDark, useColorScheme)
├── lib/                  # theme.ts (design tokens), storage.ts (AsyncStorage helpers)
└── stores/               # Global Zustand stores (themeStore)
```

- Path aliases: `@/*` → `src/*`, `@/assets/*` → `assets/*` (see `tsconfig.json`).
- Platform-specific files: `Component.web.tsx` overrides `Component.tsx` on web (see `AppTabs`, `useColorScheme`). Prefer this over inline `Platform.OS` branching for anything non-trivial.
- New features with data logic go in `src/features/<feature>/` with hooks (e.g. `src/features/notes/hooks/useNotes.ts`), keeping screens thin.

## Theme system — CRITICAL

**All colors, spacing, typography, and border radius values MUST come from `src/lib/theme.ts`.** Never use inline colors or hardcoded style values without explicit user approval.

Tokens: `lightColors` / `darkColors` (`background`, `surface`, `text`, `secondary`, `tertiary`, `border`, `primary`, `accent`, `danger`, `warning`, `success`), `spacing` (xs–xl), `fontSize` (xs–3xl), `fontWeight`, `borderRadius` (sm/md/lg/full).

Get theme-aware colors with the `useColors()` hook, and follow the `createStyles` pattern:

```tsx
import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { useColors } from '@/hooks/useColors'
import { spacing, borderRadius, type Colors } from '@/lib/theme'

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: spacing.lg,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      borderColor: colors.border,
    },
  })

function MyComponent() {
  const colors = useColors()
  const styles = useMemo(() => createStyles(colors), [colors])

  return <View style={styles.container}>…</View>
}
```

Acceptable exceptions (no token needed): layout props (`flex`, `flexDirection`, `alignItems`, `justifyContent`, positioning), relative sizing (`width: '100%'`), platform shadow values, and `opacity` for pressed/disabled states.

The theme mode (light/dark/system) lives in `src/stores/themeStore.ts`, persisted with AsyncStorage. The Settings screen changes it; `useColors()`/`useIsDark()` respect it everywhere automatically.

## Component architecture

- **UI primitives** (`src/components/ui/`): `Button` (variants: primary, secondary, outline, ghost, danger; sizes sm/md/lg; `loading`, `fullWidth`, `leftIcon`), `Input` (label, error, hint, icons, password toggle), `Text` (variants: h1, h2, h3, body, bodySmall, caption, label, code; `color` and `weight` props). Import from the barrel: `import { Button, Text } from '@/components/ui'`.
- **Error boundaries** (`src/components/error/`): the root layout is wrapped in `ErrorBoundary`. Always wrap screen components with `ScreenErrorBoundary`:

```tsx
export default function MyScreen() {
  return (
    <ScreenErrorBoundary screenName="My Screen">
      <MyScreenContent />
    </ScreenErrorBoundary>
  )
}
```

- **Screen-specific components** stay in the screen file. Only extract to `src/components/` when reused across screens.

## State & persistence

- **Client state**: Zustand stores in `src/stores/`. For state that should survive restarts, use the `persist` middleware with AsyncStorage — see `themeStore.ts` for the pattern.
- **One-off persistence**: the typed `storage` helper in `src/lib/storage.ts` (JSON over AsyncStorage).
- There is no backend in this template. Data lives on-device.

## Installed libraries

Use these for their respective purposes. Do not introduce alternatives without explicit user approval.

| Purpose | Library |
|---------|---------|
| Navigation | `expo-router` (file-based; native tabs in `AppTabs.tsx`, web tabs in `AppTabs.web.tsx`) |
| Images | `expo-image` — always use instead of React Native's `Image` |
| Animations | `react-native-reanimated` |
| Gestures | `react-native-gesture-handler` |
| Storage | `@react-native-async-storage/async-storage` |
| State management | `zustand` (stores in `src/stores/`) |
| Icons | `@expo/vector-icons` (Ionicons); native tab icons use `sf`/`md` props on `NativeTabs.Trigger.Icon` |
| Camera | `expo-camera` (permissions configured in `app.json`) |
| Photo picking | `expo-image-picker` |
| Photo library | `expo-media-library` |
| Location | `expo-location` |
| Haptics | `expo-haptics` |
| Video playback | `expo-video` |
| SVG | `react-native-svg` |
| Gradients / blur | `expo-linear-gradient`, `expo-blur` |
| Web content | `react-native-webview` |
| Utilities | `expo-clipboard`, `expo-sharing`, `expo-file-system` |

The device-capability modules (camera, location, media, etc.) are pre-installed even though the template code doesn't use them yet — this is deliberate, so their native code is already included in any development or EAS build and adding a feature never requires a rebuild. Use these instead of introducing alternatives. Pure-JS libraries can be added freely at any time.

## Conventions

- **React Compiler is enabled** (`experiments.reactCompiler` in `app.json`) — it handles memoization automatically. The explicit `useMemo` in the `createStyles` pattern is part of the shared convention; don't add further manual memoization.
- **Typed routes are enabled** (`experiments.typedRoutes`). Route strings passed to `Link` / `router` are type-checked; run the dev server once to regenerate types after adding routes.
- File naming: PascalCase for components (`Button.tsx`, `AppTabs.tsx`), camelCase for hooks/stores/lib (`useColors.ts`, `themeStore.ts`).
- App config lives in `app.json` (name, slug, scheme `reactnativeftier`, icons, splash screen). Changes to it require restarting the dev server.
