import { useMemo } from 'react'
import { Platform, ScrollView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ScreenErrorBoundary } from '@/components/error'
import { Button, Text } from '@/components/ui'
import { useColors } from '@/hooks/useColors'
import { useThemeStore } from '@/stores/themeStore'
import {
  borderRadius,
  spacing,
  BottomTabInset,
  MaxContentWidth,
  type Colors,
  type ThemeMode,
} from '@/lib/theme'

const themeModes: { value: ThemeMode; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    scrollView: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    container: {
      maxWidth: MaxContentWidth,
      flexGrow: 1,
    },
    titleContainer: {
      gap: spacing.md,
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.xl * 2,
    },
    section: {
      marginHorizontal: spacing.lg,
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      gap: spacing.md,
    },
    sectionHeader: {
      gap: spacing.xs,
    },
    modeRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
  })

function SettingsScreenContent() {
  const safeAreaInsets = useSafeAreaInsets()
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + spacing.md,
  }
  const colors = useColors()
  const styles = useMemo(() => createStyles(colors), [colors])
  const mode = useThemeStore((state) => state.mode)
  const setMode = useThemeStore((state) => state.setMode)

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: spacing.xl * 2,
      paddingBottom: spacing.lg,
    },
  })

  return (
    <ScrollView
      style={styles.scrollView}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
    >
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text variant="h2">Settings</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="label">Appearance</Text>
            <Text variant="caption">
              Saved on this device and restored on launch.
            </Text>
          </View>
          <View style={styles.modeRow}>
            {themeModes.map(({ value, label }) => (
              <Button
                key={value}
                size="sm"
                variant={mode === value ? 'primary' : 'outline'}
                onPress={() => setMode(value)}
              >
                {label}
              </Button>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default function SettingsScreen() {
  return (
    <ScreenErrorBoundary screenName="Settings">
      <SettingsScreenContent />
    </ScreenErrorBoundary>
  )
}
