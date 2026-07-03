import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { Screen } from '@/components'
import { ScreenErrorBoundary } from '@/components/error'
import { Button, Text } from '@/components/ui'
import { useColors } from '@/hooks'
import { useThemeStore } from '@/stores'
import { borderRadius, spacing, type Colors, type ThemeMode } from '@/lib'

const themeModes: { value: ThemeMode; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    titleContainer: {
      alignItems: 'center',
      paddingVertical: spacing.xl * 2,
    },
    section: {
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
  const colors = useColors()
  const styles = useMemo(() => createStyles(colors), [colors])
  const mode = useThemeStore((state) => state.mode)
  const setMode = useThemeStore((state) => state.setMode)

  return (
    <Screen scroll>
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
    </Screen>
  )
}

export default function SettingsScreen() {
  return (
    <ScreenErrorBoundary screenName="Settings">
      <SettingsScreenContent />
    </ScreenErrorBoundary>
  )
}
