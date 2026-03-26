import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { hpPx, wpPx } from '../constants/constants';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import AnimatedIcon from './AnimatedIcon';

const ORANGE = '#F2613F';
const ORANGE_LIGHT = '#F8B48A';
const TEXT = '#FFFFFF';

const Row = ({ icon, label, onPress, showDivider = true }) => (
    <Pressable onPress={onPress} style={styles.row} android_ripple={{ color: 'rgba(255,255,255,0.1)' }}>
        <View style={styles.rowIconWrap}>
            <View style={styles.rowIconBadge}>
                <AnimatedIcon name={icon} size={18} color={ORANGE} />
            </View>
        </View>
        <Text style={styles.rowText}>{label}</Text>
        {showDivider && <View style={styles.rowDivider} />}
    </Pressable>
);

const Sidebar = () => {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { isOpen, close } = useSidebar();
    const { user, logout } = useAuth();
    const openValue = useSharedValue(0);

    React.useEffect(() => {
        openValue.value = withTiming(isOpen ? 1 : 0, { duration: 250 });
    }, [isOpen]);

    const overlayStyle = useAnimatedStyle(() => ({
        opacity: interpolate(openValue.value, [0, 1], [0, 0.35]),
        pointerEvents: openValue.value > 0 ? 'auto' : 'none',
    }));

    const panelStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: interpolate(openValue.value, [0, 1], [380, 0]) }],
    }));

    return (
        <View pointerEvents={isOpen ? 'auto' : 'none'} style={StyleSheet.absoluteFill}>
            {/* Dim overlay */}
            <Animated.View style={[StyleSheet.absoluteFillObject, styles.overlay, overlayStyle]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={close} />
            </Animated.View>

            {/* Panel */}
            <Animated.View style={[styles.panel, panelStyle, { paddingTop: insets.top + hpPx(24), paddingBottom: insets.bottom + hpPx(24) }]}>
                {/* Profile */}
                <View style={styles.headerRow}>
                    <Image source={{ uri: user?.avatar || 'https://res.cloudinary.com/dbkk5lc8h/image/upload/v1760620180/user.webp' }} style={styles.avatar} />
                    <View style={{ marginLeft: wpPx(12) }}>
                        <Text style={styles.name}>{user?.name || 'Guest User'}</Text>
                        <Text style={styles.email}>{user?.email || 'guest@example.com'}</Text>
                    </View>
                </View>

                {/* Menu */}
                <View style={{ marginTop: hpPx(16) }}>
                    <Row icon="bag-personal" label="My Orders" onPress={() => { close(); router.push('/main/orders'); }} />
                    <Row icon="account" label="My Profile" onPress={() => { close(); router.push('/main/profile'); }} />
                    <Row icon="map-marker" label="Delivery Address" onPress={() => { close(); }} />
                    <Row icon="credit-card" label="Payment Methods" onPress={() => { close(); }} />
                    <Row icon="phone" label="Contact Us" onPress={() => { close(); }} />
                    <Row icon="help-circle" label="Help & FAQs" onPress={() => { close(); }} />
                    <Row icon="cog" label="Settings" onPress={() => { close(); router.push('/main/settings'); }} />
                    <Row icon="logout" label="Log Out" showDivider={false} onPress={() => { close(); logout?.(); }} />
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        backgroundColor: '#000',
    },
    panel: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: wpPx(320),
        backgroundColor: colors.secondary,
        borderTopLeftRadius: hpPx(20),
        borderBottomLeftRadius: hpPx(20),
        paddingHorizontal: wpPx(20),
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: wpPx(48),
        height: hpPx(48),
        borderRadius: hpPx(24),
        borderWidth: hpPx(2),
        borderColor: 'rgba(255,255,255,0.35)',
    },
    name: {
        color: TEXT,
        fontSize: hpPx(18),
        fontWeight: '700',
    },
    email: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: hpPx(12),
        marginTop: hpPx(2),
    },
    row: {
        paddingVertical: hpPx(14),
    },
    rowIconWrap: {
        position: 'absolute',
        left: 0,
        top: hpPx(10),
    },
    rowIconBadge: {
        backgroundColor: '#fff',
        width: wpPx(36),
        height: hpPx(36),
        borderRadius: hpPx(8),
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowText: {
        color: TEXT,
        fontSize: hpPx(16),
        marginLeft: wpPx(48),
        fontWeight: '600',
    },
    rowDivider: {
        height: hpPx(1),
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginTop: hpPx(14),
        marginLeft: wpPx(48),
    },
});

export default Sidebar;
