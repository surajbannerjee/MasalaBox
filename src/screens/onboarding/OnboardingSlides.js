import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    ImageBackground,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SimpleButton } from "../../components/SimpleButton";
import { colors } from "../../constants/colors";
import { hp, wp } from '../../constants/constants';
import { H3, H6, p } from "../../constants/fontConstants";
import { slide1 } from "../../constants/images";
const { width } = Dimensions.get("window");

const SLIDES = [
    {
        key: "1",
        title: "Discover Indian Recipes",
        subtitle:
            "Explore thousands of authentic Indian dishes from different regions, all in one place",
        image: slide1,
    },
    // {
    //     key: "2",
    //     title: "Cook Like a Pro Chef",
    //     subtitle:
    //         "Follow easy step-by-step instructions and cook delicious meals at home effortlessly",
    //     image: slide2,
    // },
    // {
    //     key: "3",
    //     title: "Find Recipes by Ingredients",
    //     subtitle:
    //         "Got limited ingredients? Search recipes based on what you already have in your kitchen",
    //     image: slide3,
    // },
    // {
    //     key: "4",
    //     title: "Save Your Favorites",
    //     subtitle:
    //         "Bookmark your favorite recipes and access them anytime with just one tap",
    //     image: slide4,
    // },
    // {
    //     key: "5",
    //     title: "Start Cooking Today",
    //     subtitle:
    //         "Let’s bring the magic of मसाला to your kitchen and enjoy every bite",
    //     image: slide5,
    // },

];

export default function OnboardingSlides() {
    const router = useRouter();
    const [index, setIndex] = useState(0);
    const ref = useRef(null);

    const renderItem = ({ item }) => {
        const src = typeof item.image === 'string' ? { uri: item.image } : item.image;
        return (
            <View style={[styles.slide, { width }]}>
                <ImageBackground
                    source={src}
                    style={styles.card}
                    imageStyle={styles.cardRadius}
                >
                    <View style={styles.cardOverlay} />
                </ImageBackground>
            </View>
        );
    };

    return (
        <View style={styles.containerBG}>
            <FlatList
                ref={ref}
                data={SLIDES}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(i) => i.key}
                onMomentumScrollEnd={(e) => {
                    const i = Math.round(e.nativeEvent.contentOffset.x / width);
                    setIndex(i);
                }}
            />


            <View style={styles.container}>
                <View style={styles.slide}>
                    <Text style={styles.title}>{SLIDES[Math.min(SLIDES.length - 1, Math.max(0, index))]?.title}</Text>
                    <Text style={styles.subtitle}>{SLIDES[Math.min(SLIDES.length - 1, Math.max(0, index))]?.subtitle}</Text>
                </View>
                <View style={styles.dots}>
                    {SLIDES.map((_, i) => (
                        <View
                            key={i}
                            style={[styles.dot, i === index && styles.dotActive]}
                        />
                    ))}
                </View>

                <SimpleButton
                    showRightIcon
                    rightIcon="arrow-forward"
                    rightIconAnimation="bounce"
                    title={index < SLIDES.length - 1 ? "Next" : "Get Started"}
                    onPress={async () => {
                        if (index < SLIDES.length - 1) {
                            ref.current?.scrollToIndex({ index: index + 1, animated: true });
                        } else {
                            router.push("auth/login");
                        }
                    }}
                />
                <Text
                    style={styles.skip}
                    onPress={async () => {
                        await SecureStore.setItemAsync("hasOnboarded", "true");
                        router.replace("/(tabs)");
                        // router.replace("/auth/login");
                    }}
                >
                    Skip
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    containerBG: {
        flex: 1,
        backgroundColor: colors.secondary,
        position: "relative"
    },
    container: {
        flex: 1,
        backgroundColor: colors.secondary,
        paddingVertical: hp(3),
        paddingHorizontal: wp(5),
        justifyContent: "center",
        gap: hp(3),
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: "auto",
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    },
    slide: {
        alignItems: "center",
        height: "100%",
        gap: hp(3),
        flex: 1,
        justifyContent: "center",
    },
    card: {
        width: "100%",
        height: "100%",
        borderRadius: hp(3),
        overflow: "hidden",
        justifyContent: "flex-end",
    },
    cardRadius: { borderRadius: hp(3) },
    cardOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.2)",
    },
    title: {
        fontSize: H3,
        fontWeight: "700",
        color: colors.white,
        textAlign: "center",
    },
    subtitle: {
        fontSize: p,
        color: colors.white,
        textAlign: "center",
    },
    dots: {
        flexDirection: "row",
        justifyContent: "center",
        gap: wp(2)
    },
    dot: {
        width: hp(1),
        height: hp(1),
        borderRadius: hp(0.5),
        backgroundColor: "rgba(255,255,255,0.5)"
    },
    dotActive: {
        backgroundColor: colors.primary,
    },
    skip: {
        textAlign: "center",
        color: colors.white,
        fontWeight: "700",
        fontSize: H6,
        marginBottom: hp(4),
    },
});
