import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router'

import '@/global.css'

import AppTabs from '@/components/AppTabs'
import { ErrorBoundary } from '@/components/error'
import { useIsDark } from '@/hooks/useColors'

export default function RootLayout() {
  const isDark = useIsDark()

  return (
    <ErrorBoundary>
      <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <AppTabs />
      </ThemeProvider>
    </ErrorBoundary>
  )
}
