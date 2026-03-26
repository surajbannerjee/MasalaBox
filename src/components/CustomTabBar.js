import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { hpPx, wpPx } from '../constants/constants';
import { deviceHeight, small } from '../constants/fontConstants';
import AnimatedIcon from './AnimatedIcon';

// Colors
const PRIMARY = colors.primary; // Floating circle color (purple)
const ACTIVE_LABEL = colors.primary; // Active text color
const INACTIVE = colors.inactive; // Inactive icon/label
const SURFACE_BG = colors.surface; // Background behind the tab bar to create the notch illusion

// Map route names to icon + label used in the design
const routeMeta = (routeName, options) => {
    switch (routeName) {
        case 'index':
            return { icon: 'Octicons:home', label: options?.title || 'Home' };
        case 'explore':
            return { icon: 'Ionicons:search', label: options?.title || 'Search' };
        case 'cart':
            return { icon: 'Feather:shopping-bag', label: options?.title || 'Cart' };
        case 'favorites':
            return { icon: 'Feather:heart', label: options?.title || 'Favorites' };
        case 'profile':
            return { icon: 'FontAwesome:user-o', label: options?.title || 'Profile' };
        default:
            return { icon: 'Ionicons:home', label: options?.title || String(routeName || '') };
    }
};

// Single tab item with animated Y shift when focused
const TabItem = ({ routeKey, label, iconName, focused, onPress, onLongPress }) => {
    const y = useSharedValue(0);
    React.useEffect(() => {
        y.value = withTiming(focused ? -20 : 0, { duration: 500 });
    }, [focused]);

    const iconShift = useAnimatedStyle(() => ({
        backgroundColor: focused ? PRIMARY : 'transparent',
        transform: [{ translateY: y.value }],
    }), [focused]);

    return (
        <TouchableOpacity
            key={routeKey}
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.item}
            activeOpacity={0.8}
        >
            <Animated.View style={[styles.iconWrapper, iconShift]}>
                <AnimatedIcon
                    name={iconName}
                    size={22}
                    color={focused ? '#fff' : INACTIVE}
                    animationType={'none'}
                />
            </Animated.View>
            <Text style={[styles.label, { color: focused ? ACTIVE_LABEL : INACTIVE }]}>{label}</Text>
        </TouchableOpacity>
    );
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
    const insets = useSafeAreaInsets?.() || { bottom: 0 };

    // Only show routes that aren't hidden via href: null, and enforce desired order
    const ORDER = ['index', 'favorites', 'explore', 'cart', 'profile']; // home, heart, search, cart, user
    const visibleRoutes = state.routes
        .filter((r) => ORDER.includes(r.name) && descriptors[r.key]?.options?.href !== null)
        .sort((a, b) => ORDER.indexOf(a.name) - ORDER.indexOf(b.name));

    return (
        <View style={[styles.container]}>
            <View style={styles.row}>
                {visibleRoutes.map((route) => {
                    const { options } = descriptors[route.key];
                    const focused = state.routes[state.index]?.key === route.key;
                    const meta = routeMeta(route.name, options);

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });
                        if (!focused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    return (
                        <TabItem
                            key={route.key}
                            routeKey={route.key}
                            label={meta.label}
                            iconName={meta.icon}
                            focused={focused}
                            onPress={onPress}
                            onLongPress={onLongPress}
                        />
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffffdc',
        borderTopWidth: 1,
        borderTopColor: '#E9E9EE',
        paddingTop: 0,
        paddingBottom: 0,
        borderRadius: hpPx(100),
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: hpPx(-2) },
        elevation: 8,
        overflow: 'visible',
        position: "absolute",
        bottom: 0,
        left: "50%",
        transform: [{ translateX: "-50%" }],
        width: '95%',
        height: hpPx(80),
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 0,
        flex: 1,
        height: "100%",
        gap: wpPx(5),
    },
    item: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
        width: deviceHeight * 0.089,
        position: 'relative',
    },
    iconWrapper: {
        width: wpPx(50),
        height: hpPx(50),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: deviceHeight * 1,
        position: 'absolute',
        top: hpPx(-15),
        transformOrigin: 'top center',
    },
    label: {
        fontSize: small,
        fontWeight: '700',
        paddingTop: deviceHeight * 0.03,
    },
    // removed floating highlight and notch styles
});

export default CustomTabBar;
