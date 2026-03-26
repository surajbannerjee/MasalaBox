import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native'
import CustomSelect from '../../components/CustomSelect'
import { SimpleButton } from '../../components/SimpleButton'
import { colors } from '../../constants/colors'
import { hp, wp } from '../../constants/constants'
import { deviceHeight, H1, p } from '../../constants/fontConstants'
import { BLUR, slide1 } from '../../constants/images'

const LANGS = [
    { key: 'en', label: 'English' },
    { key: 'hi', label: 'हिंदी' },
]

const COUNTRIES = [
    { key: 'IN', code: '+91', label: 'India', flag: '🇮🇳' },
    { key: 'US', code: '+1', label: 'USA', flag: '🇺🇸' },
    { key: 'GB', code: '+44', label: 'UK', flag: '🇬🇧' },
]

const AnimatedLoginScreen = () => {
    const router = useRouter()

    const [lang, setLang] = useState(LANGS[0])
    const [country, setCountry] = useState(COUNTRIES[0])
    const [phone, setPhone] = useState('')
    const inputRef = useRef(null)

    const onContinue = () => {
        // navigate to otp with phone and country code
        const full = `${country.code}${phone}`
        router.push({ pathname: '/auth/otp', params: { phone: full } })
    }

    return (
        <KeyboardAvoidingView style={styles.containerBG} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <Image source={slide1} style={styles.videoBG} contentFit="cover" />
            {/* Top bar */}
            <View style={styles.topBar}>
                <View style={{ width: "100%", maxWidth: wp(35) }}>
                    <CustomSelect
                        data={LANGS.map(l => ({ key: l.key, value: l.label }))}
                        multiple={false}
                        placeholder="Language"
                        boxStyles={{ padding: hp(2) }}
                        dropdownStyles={{ width: "100%", backgroundColor: colors.secondary }}
                        onSelect={(key) => {
                            const sel = LANGS.find(x => x.key === key)
                            if (sel) setLang(sel)
                        }}
                    />
                </View>

                <View style={{ width: "100%", maxWidth: wp(30) }}>
                    <CustomSelect
                        data={COUNTRIES.map(c => ({ key: c.key, value: `${c.flag} ${c.code}` }))}
                        multiple={false}
                        placeholder="Country"
                        boxStyles={{ padding: hp(2) }}
                        dropdownStyles={{ width: "100%", backgroundColor: colors.secondary }}
                        onSelect={(key) => {
                            const sel = COUNTRIES.find(x => x.key === key)
                            if (sel) setCountry(sel)
                        }}
                    />
                </View>
            </View>

            {/* Center content */}

                <View style={styles.center}>
                    <Image 
                    source={BLUR}
                     style={styles.BgBlur} />
                <View style={styles.centerTextBox}>
                    <Text style={styles.heading}>Welcome back</Text>
                    <Text style={styles.sub}>Enter your phone number to continue</Text>
                </View>


                {/* Phone row */}
                <View style={styles.phoneRow}>
                    <View style={styles.smallCode}>
                        <Text style={styles.smallCodeText}>{country.flag} {country.code}</Text>
                    </View>
                    <TextInput
                        ref={inputRef}
                        style={styles.phoneInput}
                        keyboardType="phone-pad"
                        placeholder="Enter mobile number"
                        placeholderTextColor={colors.white}
                        value={phone}
                        onChangeText={(t) => setPhone(t.replace(/[^0-9]/g, ''))}
                        maxLength={10}
                    />
                </View>
            </View>
            {/* bottom Box */}
            <View></View>

            {/* Bottom fixed button */}
            {phone.length >= 1 && (
                <View style={styles.fixedButton}>
                    <SimpleButton
                        showRightIcon
                        rightIcon="arrow-forward"
                        rightIconAnimation="bounce"
                     title="Continue" onPress={onContinue} />
                </View>
            )}
            {/* Language & Country selects handled by CustomSelect above */}
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
    BgBlur:{
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
        color:colors.white,
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

export default AnimatedLoginScreen
