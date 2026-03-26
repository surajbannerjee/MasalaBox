import {
    AntDesign,
    Entypo,
    EvilIcons,
    Feather,
    FontAwesome,
    FontAwesome5,
    FontAwesome6,
    Fontisto,
    Foundation,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
    Octicons,
    SimpleLineIcons,
    Zocial,
} from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

// No semantic map: provide icon family + icon name directly

// Available icon families (Lucide optional - not bundled by default)
const FAMILIES = {
    AntDesign,
    Entypo,
    EvilIcons,
    Feather,
    FontAwesome,
    FontAwesome5,
    FontAwesome5Brands: FontAwesome5,
    FontAwesome6,
    FontAwesome6Brands: FontAwesome6,
    Fontisto,
    Foundation,
    Ionicons,
    MaterialDesignIcons: MaterialCommunityIcons,
    MaterialCommunityIcons,
    MaterialIcons,
    Octicons,
    SimpleLineIcons,
    Zocial,
};

const FALLBACK_ORDER = [
    'Ionicons',
    'MaterialCommunityIcons',
    'Feather',
    'AntDesign',
    'MaterialIcons',
    'Entypo',
    'EvilIcons',
    'FontAwesome',
    'Fontisto',
    'Foundation',
    'Octicons',
    'SimpleLineIcons',
    'Zocial',
    'FontAwesome5',
    'FontAwesome6',
];

const AnimatedIcon = ({
    name,
    size = 20,
    color = '#000',
    style = {},
    animationType = 'none',
    onPress,
    pressScale = 0.9,
    bounce = false,
    rotate = false,
    pulse = false,
    shake = false,
    family, // optional: icon family name; if omitted, uses MaterialCommunityIcons
    tryFamilies, // optional: override fallback family order when family not provided
    ...props
}) => {
    const scale = useSharedValue(1);
    const rotation = useSharedValue(0);
    const opacity = useSharedValue(1);

    React.useEffect(() => {
        if (animationType === 'bounce') {
            scale.value = withRepeat(
                withSequence(
                    withTiming(1.2, { duration: 500 }),
                    withTiming(1, { duration: 500 })
                ),
                -1,
                true
            );
        } else if (animationType === 'rotate') {
            rotation.value = withRepeat(
                withTiming(360, { duration: 2000 }),
                -1,
                false
            );
        } else if (animationType === 'pulse') {
            opacity.value = withRepeat(
                withSequence(
                    withTiming(0.5, { duration: 1000 }),
                    withTiming(1, { duration: 1000 })
                ),
                -1,
                true
            );
        } else if (animationType === 'shake') {
            rotation.value = withRepeat(
                withSequence(
                    withTiming(-10, { duration: 100 }),
                    withTiming(10, { duration: 100 }),
                    withTiming(-10, { duration: 100 }),
                    withTiming(0, { duration: 100 })
                ),
                3,
                false
            );
        }
    }, [animationType]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { scale: scale.value },
                { rotate: `${rotation.value}deg` }
            ],
            opacity: opacity.value,
        };
    });

    const tapGesture = Gesture.Tap()
        .onBegin(() => {
            if (onPress) {
                scale.value = withSpring(pressScale);
            }
        })
        .onFinalize(() => {
            if (onPress) {
                scale.value = withSpring(1);
                runOnJS(onPress)();
            }
        });

    // Support "Family:iconName" syntax as well as separate family prop
    let resolvedFamily = family;
    let resolvedName = name;
    if (typeof name === 'string' && name.includes(':')) {
        const [fam, ...rest] = name.split(':');
        resolvedFamily = fam;
        resolvedName = rest.join(':');
    }
    let IconComponent = MaterialCommunityIcons;
    const finalName = typeof resolvedName === 'string' && resolvedName.length > 0 ? resolvedName : 'help-circle-outline';

    if (resolvedFamily && FAMILIES[resolvedFamily]) {
        IconComponent = FAMILIES[resolvedFamily];
    } else {
        // Try to detect which family contains this icon name
        const order = Array.isArray(tryFamilies) && tryFamilies.length ? tryFamilies : FALLBACK_ORDER;
        for (const fam of order) {
            const Comp = FAMILIES[fam];
            if (Comp && Comp.glyphMap && Object.prototype.hasOwnProperty.call(Comp.glyphMap, finalName)) {
                IconComponent = Comp;
                break;
            }
        }
    }

    // Final safety: if chosen family doesn't actually have the glyph, fall back to a known-safe icon
    let renderName = finalName;
    if (!IconComponent.glyphMap || !Object.prototype.hasOwnProperty.call(IconComponent.glyphMap, finalName)) {
        IconComponent = MaterialCommunityIcons;
        renderName = 'help-circle-outline';
    }

    return (
        <GestureDetector gesture={tapGesture}>
            <Animated.View style={[{ width: size, height: size }, animatedStyle, style]}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <IconComponent name={renderName} size={size} color={color} />
                </View>
            </Animated.View>
        </GestureDetector>
    );
};

export default AnimatedIcon;