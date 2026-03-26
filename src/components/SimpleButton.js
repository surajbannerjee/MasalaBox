import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';
import { hpPx, wpPx } from '../constants/constants';
import { deviceHeight, H6 } from '../constants/fontConstants';
import AnimatedIcon from './AnimatedIcon';
export const SimpleButton = ({
    title,
    onPress,
    rightIcon = 'FontAwesome6:arrow-right-long',
    style = {},
    textStyle = {},
    disabled = false,
    showRightIcon = true,
    rightIconAnimation = undefined,
}) => {
    return (
        <TouchableOpacity
            style={[styles.button, style, disabled && styles.disabled]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}
        >
            <Text style={[styles.text, textStyle]}>{title}</Text>
            {showRightIcon && (
                <View style={styles.iconRight}>
                    <AnimatedIcon name={rightIcon} size={20} color={colors.white} animationType={rightIconAnimation} />
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: hpPx(8),
        paddingVertical: deviceHeight * 0.015,
        paddingHorizontal: deviceHeight * 0.025,
        minHeight: deviceHeight * 0.075,
    },
    text: {
        fontSize: H6,
        color: colors.white,
        fontWeight: '600',
    },
    iconRight: {
        marginLeft: wpPx(12),
    },
    disabled: {
        opacity: 0.6,
    },
});

export default SimpleButton;
