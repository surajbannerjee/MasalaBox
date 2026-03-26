  import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    Extrapolate,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { deviceHeight, deviceWidth, hp, wp } from '../constants/constants';

const { width, height } = Dimensions.get('window');

const wpPx = (px) => wp((px / deviceWidth) * 100);
const hpPx = (px) => hp((px / deviceHeight) * 100);

const LoadingDot = ({ index, animationDelay = 0 }) => {
    const scale = useSharedValue(0.5);
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        const animate = () => {
            scale.value = withDelay(
                animationDelay + index * 200,
                withTiming(1.2, { duration: 600 }, () => {
                    scale.value = withTiming(0.5, { duration: 600 });
                })
            );
            opacity.value = withDelay(
                animationDelay + index * 200,
                withTiming(1, { duration: 600 }, () => {
                    opacity.value = withTiming(0.3, { duration: 600 });
                })
            );
        };

        animate();
        const interval = setInterval(animate, 2000);
        return () => clearInterval(interval);
    }, []);

    const dotStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[styles.loadingDot, dotStyle]} />
    );
};

const FloatingIcon = ({ icon, index }) => {
    const translateY = useSharedValue(0);
    const rotateZ = useSharedValue(0);
    const opacity = useSharedValue(0.6);

    useEffect(() => {
        const animate = () => {
            translateY.value = withRepeat(
                withTiming(-20, {
                    duration: 2000 + index * 300,
                    easing: Easing.inOut(Easing.ease)
                }),
                -1,
                true
            );
            rotateZ.value = withRepeat(
                withTiming(360, {
                    duration: 8000 + index * 1000,
                    easing: Easing.linear
                }),
                -1,
                false
            );
        };

        setTimeout(animate, index * 500);
    }, []);

    const iconStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { rotateZ: `${rotateZ.value}deg` }
        ],
        opacity: opacity.value,
    }));

    // Use vector icons instead of emojis
    const icons = ['hamburger', 'pizza', 'noodles', 'leaf', 'cake-variant', 'coffee'];

    return (
        <Animated.View
            style={[
                styles.floatingIcon,
                iconStyle,
                {
                    left: 50 + (index * (width - 100)) / icons.length,
                    top: 150 + Math.sin(index) * 100,
                }
            ]}
        >
            <MaterialCommunityIcons name={icons[index]} size={30} color="#fff" />
        </Animated.View>
    );
};

const ProgressBar = ({ progress = 0 }) => {
    const progressWidth = useSharedValue(0);
    const shimmerX = useSharedValue(-width);

    useEffect(() => {
        progressWidth.value = withSpring(progress, { damping: 15, stiffness: 100 });

        const animateShimmer = () => {
            shimmerX.value = withTiming(width, { duration: 1500 }, () => {
                shimmerX.value = -width;
                runOnJS(animateShimmer)();
            });
        };

        animateShimmer();
    }, [progress]);

    const progressStyle = useAnimatedStyle(() => ({
        width: `${progressWidth.value}%`,
    }));

    const shimmerStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shimmerX.value }],
    }));

    return (
        <View style={styles.progressContainer}>
            <Animated.View style={[styles.progressBar, progressStyle]}>
                <Animated.View style={[styles.progressShimmer, shimmerStyle]} />
            </Animated.View>
        </View>
    );
};

const PulsingLogo = () => {
    const scale = useSharedValue(0.8);
    const opacity = useSharedValue(0);
    const rotate = useSharedValue(0);

    useEffect(() => {
        // Initial entrance
        scale.value = withSpring(1, { damping: 12, stiffness: 100 });
        opacity.value = withTiming(1, { duration: 800 });

        // Continuous pulsing
        const pulse = () => {
            scale.value = withRepeat(
                withTiming(1.1, { duration: 1000 }),
                -1,
                true
            );
        };

        setTimeout(pulse, 1000);

        // Gentle rotation
        rotate.value = withRepeat(
            withTiming(360, { duration: 10000, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    const logoStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { rotateZ: `${rotate.value}deg` }
        ],
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[styles.logoContainer, logoStyle]}>
            <View style={styles.logo}>
                <MaterialCommunityIcons name="hamburger" size={50} color="#ff6b6b" />
            </View>
        </Animated.View>
    );
};

export const Loading = ({
    message = "Loading...",
    showProgress = false,
    progress = 0,
    type = "default" // "default", "splash", "minimal"
}) => {
    const containerOpacity = useSharedValue(0);
    const messageOpacity = useSharedValue(0);
    const messageTranslateY = useSharedValue(20);

    useEffect(() => {
        containerOpacity.value = withTiming(1, { duration: 500 });

        setTimeout(() => {
            messageOpacity.value = withTiming(1, { duration: 800 });
            messageTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
        }, 500);
    }, []);

    const containerStyle = useAnimatedStyle(() => ({
        opacity: containerOpacity.value,
    }));

    const messageStyle = useAnimatedStyle(() => ({
        opacity: messageOpacity.value,
        transform: [{ translateY: messageTranslateY.value }],
    }));

    if (type === "minimal") {
        return (
            <Animated.View style={[styles.container, styles.minimalContainer, containerStyle]}>
                <View style={styles.dotsContainer}>
                    {[...Array(3)].map((_, index) => (
                        <LoadingDot key={index} index={index} />
                    ))}
                </View>
            </Animated.View>
        );
    }

    if (type === "splash") {
        return (
            <Animated.View style={[styles.container, styles.splashContainer, containerStyle]}>
                {/* Floating food icons */}
                {[...Array(6)].map((_, index) => (
                    <FloatingIcon key={index} icon="food" index={index} />
                ))}

                {/* Prefer Lottie animation if available */}
                {typeof require === 'function' && (() => {
                    try {
                        const LottieView = require('lottie-react-native').default;
                        return (
                            <LottieView
                                source={require('../../assets/lottie/Food-Loading-Animation.json')}
                                autoPlay
                                loop
                                style={{ width: wpPx(180), height: hpPx(180) }}
                            />
                        );
                    } catch (e) {
                        return <PulsingLogo />;
                    }
                })()}

                <Animated.View style={[styles.messageContainer, messageStyle]}>
                    <Animated.Text style={styles.appName}>FoodHub</Animated.Text>
                    <Animated.Text style={styles.tagline}>Delicious food, delivered</Animated.Text>
                </Animated.View>

                {showProgress && (
                    <View style={styles.progressSection}>
                        <ProgressBar progress={progress} />
                        <Animated.Text style={[styles.progressText, messageStyle]}>
                            {Math.round(progress)}%
                        </Animated.Text>
                    </View>
                )}
            </Animated.View>
        );
    }

    // Default loading
    return (
        <Animated.View style={[styles.container, containerStyle]}>
            <View style={styles.loadingContent}>
                {/* Lottie fallback for default loader */}
                {typeof require === 'function' && (() => {
                    try {
                        const LottieView = require('lottie-react-native').default;
                        return (
                            <LottieView
                                source={require('../../assets/lottie/Food-Loading-Animation.json')}
                                autoPlay
                                loop
                                style={{ width: wpPx(120), height: hpPx(120) }}
                            />
                        );
                    } catch (e) {
                        return <PulsingLogo />;
                    }
                })()}

                <View style={styles.dotsContainer}>
                    {[...Array(3)].map((_, index) => (
                        <LoadingDot key={index} index={index} />
                    ))}
                </View>

                <Animated.View style={messageStyle}>
                    <Animated.Text style={styles.message}>{message}</Animated.Text>
                </Animated.View>

                {showProgress && (
                    <View style={styles.progressSection}>
                        <ProgressBar progress={progress} />
                        <Animated.Text style={styles.progressText}>
                            {Math.round(progress)}%
                        </Animated.Text>
                    </View>
                )}
            </View>
        </Animated.View>
    );
};

// Skeleton loading components
export const SkeletonBox = ({ width, height, style = {} }) => {
    const shimmer = useSharedValue(0);

    useEffect(() => {
        shimmer.value = withRepeat(
            withTiming(1, { duration: 1500 }),
            -1,
            false
        );
    }, []);

    const shimmerStyle = useAnimatedStyle(() => {
        const translateX = interpolate(
            shimmer.value,
            [0, 1],
            [-width, width],
            Extrapolate.CLAMP
        );

        return {
            transform: [{ translateX }],
        };
    });

    return (
        <View style={[styles.skeletonBox, { width, height }, style]}>
            <Animated.View style={[styles.skeletonShimmer, shimmerStyle]} />
        </View>
    );
};

export const LoadingSpinner = ({ size = 40, color = '#ff6b6b' }) => {
    const rotation = useSharedValue(0);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, { duration: 1000, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    const spinnerStyle = useAnimatedStyle(() => ({
        transform: [{ rotateZ: `${rotation.value}deg` }],
    }));

    return (
        <Animated.View style={[styles.spinner, { width: size, height: size }, spinnerStyle]}>
            <View style={[styles.spinnerCircle, { borderColor: color }]} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    minimalContainer: {
        backgroundColor: 'transparent',
    },
    splashContainer: {
        backgroundColor: '#ff6b6b',
    },
    loadingContent: {
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: hpPx(40),
    },
    logo: {
        width: wpPx(100),
        height: hpPx(100),
        borderRadius: hpPx(50),
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: hpPx(8) },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 10,
    },
    logoEmoji: {
        fontSize: hpPx(50),
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hpPx(30),
    },
    loadingDot: {
        width: wpPx(10),
        height: hpPx(10),
        borderRadius: hpPx(5),
        backgroundColor: '#ff6b6b',
        marginHorizontal: wpPx(4),
    },
    floatingIcon: {
        position: 'absolute',
    },
    iconEmoji: {
        fontSize: hpPx(30),
    },
    messageContainer: {
        alignItems: 'center',
        marginBottom: hpPx(40),
    },
    appName: {
        fontSize: hpPx(32),
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: hpPx(8),
    },
    tagline: {
        fontSize: hpPx(16),
        color: 'rgba(255, 255, 255, 0.9)',
    },
    message: {
        fontSize: hpPx(16),
        color: '#666',
        textAlign: 'center',
        fontWeight: '500',
    },
    progressSection: {
        width: wp(70),
        alignItems: 'center',
        marginTop: hpPx(20),
    },
    progressContainer: {
        width: '100%',
        height: hpPx(6),
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: hpPx(3),
        overflow: 'hidden',
        marginBottom: hpPx(12),
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressShimmer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        width: wpPx(50),
    },
    progressText: {
        fontSize: hpPx(14),
        color: '#fff',
        fontWeight: '600',
    },
    skeletonBox: {
        backgroundColor: '#E1E9EE',
        borderRadius: hpPx(4),
        overflow: 'hidden',
    },
    skeletonShimmer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        width: wpPx(100),
    },
    spinner: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    spinnerCircle: {
        width: '100%',
        height: '100%',
        borderRadius: hpPx(100),
        borderWidth: hpPx(3),
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
    },
});

export default Loading;