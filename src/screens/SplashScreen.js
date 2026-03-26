import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated'
import { LoadingSpinner } from '../components/Loading'
import { colors } from '../constants/colors'
import { hpPx, wpPx } from '../constants/constants'
import { LOGO } from '../constants/images'

const SplashScreen = () => {
  const router = useRouter()
  const logoScale = useSharedValue(0.7)
  const titleOpacity = useSharedValue(0)
  const titleTranslate = useSharedValue(12)
  const subOpacity = useSharedValue(0)
  const subTranslate = useSharedValue(12)

  useEffect(() => {
    // Entrance animation
    logoScale.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.exp) })

    // gentle pulsing after entrance
    logoScale.value = withDelay(600, withRepeat(withTiming(1.06, { duration: 1000 }), -1, true))

    titleOpacity.value = withDelay(400, withTiming(1, { duration: 500 }))
    titleTranslate.value = withDelay(400, withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) }))

    subOpacity.value = withDelay(600, withTiming(1, { duration: 500 }))
    subTranslate.value = withDelay(600, withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) }))

    // navigate to onboarding after animations
    const navTimer = setTimeout(() => {
      try {
        router.replace('/onboarding')
      } catch (e) {
        // ignore if router not available in this environment
      }
    }, 2400)

    return () => clearTimeout(navTimer)
  }, [])

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoScale.value,
  }))

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslate.value }],
  }))

  const subStyle = useAnimatedStyle(() => ({
    opacity: subOpacity.value,
    transform: [{ translateY: subTranslate.value }],
  }))

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoWrapper, logoStyle]}>
        <Image source={LOGO} style={styles.logo} contentFit="contain" />
      </Animated.View>

      <Animated.View style={titleStyle}>
        <Text style={styles.title}>FoodHub</Text>
      </Animated.View>

      <Animated.View style={[subStyle, { marginTop: hpPx(8) }]}>
        <Text style={styles.subtitle}>Delicious food, delivered</Text>
      </Animated.View>

      <View style={styles.loaderContainer} pointerEvents="none">
        <LoadingSpinner size={hpPx(40)} color="#fff" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: wpPx(16),
  },
  logoWrapper: {
    width: wpPx(200),
    height: hpPx(200),
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: wpPx(180),
    height: hpPx(180),
  },
  title: {
    marginTop: hpPx(24),
    fontSize: hpPx(28),
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: hpPx(14),
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  }
  ,
  loaderContainer: {
    position: 'absolute',
    bottom: hpPx(48),
    left: 0,
    right: 0,
    alignItems: 'center',
  }
})

export default SplashScreen