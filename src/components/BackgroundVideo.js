import { ImageBackground, StyleSheet } from 'react-native'
import { deviceHeight } from '../constants/constants'

let hasExpoVideo = false
let ExpoVideo = null

let hasExpoAv = false
let ExpoAv = null

// Try expo-video
try {
    ExpoVideo = require('expo-video')
    hasExpoVideo = !!ExpoVideo
} catch (e) {
    hasExpoVideo = false
}

// Fallback expo-av
if (!hasExpoVideo) {
    try {
        ExpoAv = require('expo-av')
        hasExpoAv = !!ExpoAv
    } catch (e) {
        hasExpoAv = false
    }
}

const BackgroundVideo = ({ source, style, poster }) => {
    const src =
        typeof source === 'string' ? { uri: source } : source

    // ✅ 1. expo-video (modern)
    if (hasExpoVideo) {
        const { VideoView, useVideoPlayer } = ExpoVideo

        const player = useVideoPlayer(src, (playerInstance) => {
            try {
                playerInstance.loop = true
                playerInstance.muted = true
            } catch (e) { }
        })

        return (
            <VideoView
                player={player}
                style={[styles.video, style]}
                pointerEvents="none"
            />
        )
    }

    // ✅ 2. expo-av (fallback)
    if (hasExpoAv) {
        const { Video } = ExpoAv

        return (
            <Video
                source={src}
                shouldPlay
                isLooping
                isMuted
                resizeMode="cover"
                useNativeControls={false}
                style={[styles.video, style]}
                pointerEvents="none"
            />
        )
    }

    // ✅ 3. fallback image
    if (poster) {
        return (
            <ImageBackground
                source={
                    typeof poster === 'string'
                        ? { uri: poster }
                        : poster
                }
                style={[styles.video, style]}
            />
        )
    }

    console.warn(
        'No Video component found (expo-video or expo-av)'
    )
    return null
}

const styles = StyleSheet.create({
    video: {
        height: deviceHeight * 1.8, // increase height to cover taller screens
        width: deviceHeight * 0.7, // adjust width to maintain aspect ratio
        flex: 1,
        position: 'absolute',
        top: deviceHeight * -0.4, // adjust top to center video
        left:deviceHeight * -0.10, // adjust left to center video
        zIndex: 0,
    },
})

export default BackgroundVideo