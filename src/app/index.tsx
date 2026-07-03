import { Image } from 'expo-image'
import { useEffect, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated'

import { Screen } from '@/components'
import { ScreenErrorBoundary } from '@/components/error'
import { Text } from '@/components/ui'
import { useColors } from '@/hooks'
import { borderRadius, spacing, type Colors } from '@/lib'

const features = ['Light & dark theme', 'Local storage', 'File-based routing']

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    logoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    glow: {
      position: 'absolute',
      width: 220,
      height: 220,
      borderRadius: borderRadius.full,
      backgroundColor: colors.accent,
      opacity: 0.12,
    },
    logo: {
      width: 96,
      height: 96,
    },
    title: {
      textAlign: 'center',
    },
    subtitle: {
      textAlign: 'center',
      paddingHorizontal: spacing.lg,
    },
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    chip: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.full,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
  })

function HomeScreenContent() {
  const colors = useColors()
  const styles = useMemo(() => createStyles(colors), [colors])

  const float = useSharedValue(0)
  const pulse = useSharedValue(1)

  useEffect(() => {
    float.set(
      withRepeat(
        withTiming(-8, { duration: 2200, easing: Easing.inOut(Easing.quad) }),
        -1,
        true
      )
    )
    pulse.set(
      withRepeat(
        withTiming(1.15, { duration: 2200, easing: Easing.inOut(Easing.quad) }),
        -1,
        true
      )
    )
  }, [float, pulse])

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: float.get() }],
  }))
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.get() }],
  }))

  return (
    <Screen centered>
      <View style={styles.logoContainer}>
        <Animated.View style={[styles.glow, pulseStyle]} />
        <Animated.View entering={ZoomIn.springify().damping(12)} style={floatStyle}>
          <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.delay(150).duration(600)}>
        <Text variant="h1" style={styles.title}>
          Your app starts here
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300).duration(600)}>
        <Text color="secondary" style={styles.subtitle}>
          Open your AI assistant and describe what you want to build.
        </Text>
      </Animated.View>

      <View style={styles.chipRow}>
        {features.map((feature, index) => (
          <Animated.View
            key={feature}
            entering={FadeInDown.delay(450 + index * 100).duration(600)}
            style={styles.chip}
          >
            <Text variant="caption">{feature}</Text>
          </Animated.View>
        ))}
      </View>
    </Screen>
  )
}

export default function HomeScreen() {
  return (
    <ScreenErrorBoundary screenName="Home">
      <HomeScreenContent />
    </ScreenErrorBoundary>
  )
}
