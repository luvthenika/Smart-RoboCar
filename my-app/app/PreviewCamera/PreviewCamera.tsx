import { StyleSheet, View, Pressable } from "react-native";
import { Image } from "expo-image";
import React, { useEffect, useContext } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useRouter } from "expo-router";
import { StreamContext } from "../context/StartStreaming";
import { usePressableImage } from "../hooks/usePressableImage";

export default function PreviewCamera() {
    const { frameUrl, disconnect, connect } = useContext(StreamContext);

    const startButtonImageIdle = require("../../assets/images/start_idle.svg");
    const stopButtonImageIdle = require("../../assets/images/stop_idle.svg");

    // Use fallback pressed images if dedicated assets are not available
    const startButtonImagePressed = startButtonImageIdle;
    const stopButtonImagePressed = stopButtonImageIdle;

    const startButton = usePressableImage(startButtonImageIdle, startButtonImagePressed);
    const stopButton = usePressableImage(stopButtonImageIdle, stopButtonImagePressed);

    const router = useRouter();
    const [loaded, error] = useFonts({
        PixelifySans: require("../../assets/fonts/Pixelify_Sans/static/PixelifySans-Regular.ttf"),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    const handleGameStart = () => {
        connect();
        router.push('/Play/Play');
    };

    const stopGameStart = () => {
        disconnect();
        router.push('/PreviewCamera/PreviewCamera');
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageFrame}>
                <Image
                    source={{ uri: frameUrl }}
                    style={styles.mainImage}
                    contentFit="contain"
                />
            </View>

            <Pressable {...startButton.pressableProps} onPress={handleGameStart} style={styles.button}>
                <Image
                    source={startButton.imageSource}
                    style={styles.buttonImage}
                    contentFit="contain"
                />
            </Pressable>

            <Pressable {...stopButton.pressableProps} onPress={stopGameStart} style={styles.button}>
                <Image
                    source={stopButton.imageSource}
                    style={styles.buttonImage}
                    contentFit="contain"
                />
            </Pressable>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FCEFF9",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        padding: 20,
    },
    imageFrame: {
        width: 320,
        height: 400,
        borderRadius: 40,
        borderWidth: 10,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#000',
    },
    mainImage: {
        width: 550,
        height: '100%',
    },
    button: {
        width: 200,
        height: 60,
    },
    buttonImage: {
        width: '100%',
        height: '100%',
    }
});