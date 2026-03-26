import { Tabs } from 'expo-router';
import AnimatedIcon from '../../src/components/AnimatedIcon';
import CustomTabBar from '../../src/components/CustomTabBar';
import { hpPx } from '../../src/constants/constants';
import { useSidebar } from '../../src/context/SidebarContext';

function useColorScheme() {
    return 'light'; // Simple implementation
}

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const { toggle } = useSidebar();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#FF6B35',
                tabBarInactiveTintColor: '#666',
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#e0e0e0',
                    paddingBottom: hpPx(8),
                    paddingTop: hpPx(8),
                    height: hpPx(70),
                },
                tabBarLabelStyle: {
                    fontSize: hpPx(12),
                    fontWeight: '500',
                },
            }}
            tabBar={(props) => <CustomTabBar {...props} />}
        >
            {/** Explicitly hide any legacy routes that still exist as files under (tabs) */}
            <Tabs.Screen name="orders" options={{ href: null }} />
            <Tabs.Screen name="all-categories" options={{ href: null }} />
            <Tabs.Screen name="all-restaurants" options={{ href: null }} />

            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <AnimatedIcon
                            name="home"
                            size={24}
                            color={color}
                            animationType={focused ? "bounce" : "none"}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color, focused }) => (
                        <AnimatedIcon
                            name="search"
                            size={24}
                            color={color}
                            animationType={focused ? "pulse" : "none"}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    title: 'Cart',
                    tabBarIcon: ({ color, focused }) => (
                        <AnimatedIcon
                            name="cart"
                            size={24}
                            color={color}
                            animationType={focused ? "shake" : "none"}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="favorites"
                options={{
                    title: 'Favorites',
                    tabBarIcon: ({ color, focused }) => (
                        <AnimatedIcon
                            name="heart"
                            size={24}
                            color={color}
                            animationType={focused ? "pulse" : "none"}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    headerShown: true,
                    headerRight: () => (
                        <AnimatedIcon name="menu" size={22} color={'#333'} onPress={toggle} />
                    ),
                    tabBarIcon: ({ color, focused }) => (
                        <AnimatedIcon
                            name="user"
                            size={24}
                            color={color}
                            animationType={focused ? "bounce" : "none"}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}