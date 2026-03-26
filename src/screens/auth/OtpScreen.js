import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import LottieView from 'lottie-react-native'
import { useEffect, useRef, useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import OTPTextInput from 'react-native-otp-textinput'
import AnimatedIcon from '../../components/AnimatedIcon'
import { SimpleButton } from '../../components/SimpleButton'
import { colors } from '../../constants/colors'
import { deviceWidth, hp, wp } from '../../constants/constants'
import { deviceHeight, H1, H1BIG, p } from '../../constants/fontConstants'
import { ANIMATIONS, BLUR, slide1 } from '../../constants/images'

const OtpScreen = ({ searchParams }) => {
  const router = useRouter()
  const phone = (searchParams && searchParams.phone) || ''

  const otpRef = useRef(null)
  const [otp, setOtp] = useState('')
  const [seconds, setSeconds] = useState(30)
  const [resendVisible, setResendVisible] = useState(false)

  useEffect(() => {
    let timer
    if (seconds > 0) {
      timer = setInterval(() => setSeconds(s => s - 1), 1000)
    } else {
      setResendVisible(true)
    }
    return () => clearInterval(timer)
  }, [seconds])

  const handleResend = () => {
    // trigger resend OTP logic here
    console.log('Resend OTP to', phone)
    setSeconds(30)
    setResendVisible(false)
  }

  const onVerify = () => {
    // Here you would verify OTP; for now navigate to main or pop
    // Example: router.replace('/main')
    console.log('Verifying OTP', otp)
  }

  return (
    <KeyboardAvoidingView style={styles.containerBG} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Image source={slide1} style={styles.videoBG} contentFit="cover" />
      {/* Top bar */}
      <View style={styles.topBar}>
        <AnimatedIcon name={'ion:arrow-back-circle'} size={H1BIG} color={colors.white} animationType={'bounce'} onPress={() => router.back()} />
      </View>
      <LottieView source={ANIMATIONS.OTP} style={styles.lottie} autoPlay loop />
      <View  style={styles.lottieRow}>
        {/* OTP.json */}
         
      <View style={styles.center}>
        <Image
          source={BLUR}
          style={styles.BgBlur} />

        <View style={styles.centerTextBox}>
          <Text style={styles.heading}>Verify phone</Text>
          <Text style={styles.sub}>Enter the 4-digit code sent to {phone}</Text>
        </View>

        <View style={styles.otpWrap}>
          <OTPTextInput
            ref={otpRef}
            inputCount={4}
            handleTextChange={(value) => setOtp(value)}
            containerStyle={styles.otpContainer}
            textInputStyle={styles.otpInput}
            offTintColor={'transparent'}
          />
        </View>
        {/* timer countdown */}
        {!resendVisible ? (
          <Text style={styles.timerText}>Resend in 00:{seconds < 10 ? `0${seconds}` : seconds}</Text>
        ) : (
          <Pressable onPress={handleResend} hitSlop={8} accessibilityRole="button">
            <Text style={styles.resendText}>Resend</Text>
          </Pressable>
        )}
      </View>
      </View>

      <View></View>

      {otp.length >= 4 && (
        <View style={styles.fixedButton}>
          <SimpleButton
            showRightIcon
            rightIcon="arrow-forward"
            rightIconAnimation="bounce"
            title="Continue"
            onPress={onVerify}
          />
        </View>
      )}

    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  containerBG: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.secondary,
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    position: 'relative'
  },
  videoBG: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
    height: deviceHeight * 1.2,
    width: deviceHeight * 1,
    filter: 'brightness(0.4)',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: deviceHeight * 0.03
  },
  langBtn: {
    padding: hp(2)
  },
  langText: {
    color: '#fff',
    fontWeight: '700'
  },
  countryBtn: {
    padding: hp(2)
  },
  countryText: {
    color: '#fff',
    fontWeight: '700'
  },
  center: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: hp(5),
    // backgroundColor: 'rgba(0,0,0,0.4)',
    padding: hp(2),
    borderRadius: hp(3),
    height: hp(40),
    backdropFilter: 'blur(10px)',
    overflow: 'hidden',
    position: 'relative',
  },
  BgBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: hp(40),
    width: wp(90),
  },
  centerTextBox: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: hp(1),
  },
  otpWrap: {
    width: deviceWidth * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
  },

  lottieRow: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: hp(5),

  },
  lottie: {
    width: wp(40),
    height: wp(40),
    position: 'absolute',
    top: hp(7),
    left: wp(30),
    zIndex: 0,
  },
  otpContainer: {
    width: "100%",
    justifyContent: 'space-between'
  },
  otpInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    color: colors.white,
    borderRadius: hp(2),
    height: hp(8),
    width: wp(16),
    textAlign: 'center',
    fontSize: p,
    fontWeight: '700'
  },
  timerText: {
    color: 'rgba(255,255,255,0.9)',
    marginTop: hp(1),
    fontSize: p,
  },
  resendText: {
    color: colors.primary,
    marginTop: hp(1),
    fontSize: p,
    fontWeight: '700',
    textDecorationLine: 'underline'
  },
  heading: {
    fontSize: H1,
    fontWeight: '900',
    color: '#fff',
  },
  sub: {
    fontSize: p,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  phoneRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center'
  },
  smallCode: {
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: hp(2),
    marginRight: wp(2)
  },
  smallCodeText: {
    color: colors.white,
    fontWeight: '700'
  },
  phoneInput: {
    flex: 1,
    paddingVertical: hp(2),
    paddingHorizontal: wp(2),
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: hp(2),
    fontSize: p,
    color: colors.white,
  },
  fixedButton: {
    // position: 'absolute',
    // left: wp(5),
    // bottom: hp(2),
    // width: wp(90),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: hp(16),
    maxHeight: '50%',
    borderTopLeftRadius: hp(12),
    borderTopRightRadius: hp(12)
  },
  dropdownContent: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: hp(8),
    padding: hp(8),
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: hp(8),
    elevation: 6
  },
  langDropdown: {
    top: hp * 0.06,
    left: wp(16),
    width: wp(160)
  },
  countryDropdown: {
    top: hp * 0.06,
    right: wp(16),
    width: wp(220)
  },

})


export default OtpScreen
