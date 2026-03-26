import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { Loading } from '../src/components/Loading';
import Sidebar from '../src/components/Sidebar';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { SidebarProvider } from '../src/context/SidebarContext';

function useColorScheme() {
    // Simple implementation for color scheme detection
    return 'light'; // You can implement proper color scheme detection here
}

function RootLayoutNav() {
    const colorScheme = useColorScheme();
    const { isLoading } = useAuth();

    if (isLoading) {
        return (
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Loading message="Setting up your app..." />
            </GestureHandlerRootView>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="onboarding" />
                    <Stack.Screen name="auth/login" />
                    <Stack.Screen name="auth/signup" />
                    <Stack.Screen name="auth/forgot-password" />
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="main/food-detail" />
                    <Stack.Screen name="main/food-list" />
                    <Stack.Screen name="main/profile" />
                    <Stack.Screen name="main/search" />
                    <Stack.Screen name="main/orders" />
                    <Stack.Screen name="main/favorites" />
                    <Stack.Screen name="main/settings" />
                </Stack>
                <StatusBar style="auto" />
                {/* Global sidebar overlay */}
                <Sidebar />
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}

export default function RootLayout() {
    return (
            <AuthProvider>
                <SidebarProvider>
                    <RootLayoutNav />
                </SidebarProvider>
            </AuthProvider>
    );
}