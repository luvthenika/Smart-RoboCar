import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { Href, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useContext, useEffect } from "react";
import { Pressable, View } from "react-native";
import ErrorModal from "../components/ErrorModal/ErrorModal";
import LoadingBar from "../components/LoadingBar/LoadingBar";
import { StreamContext } from "../context/StartStreaming";
import { usePressableImage } from "../hooks/usePressableImage";
import { styles } from "./PreviewCamera.styles";

export default function PreviewCamera() {
    const { frameUrl, disconnect, connect, loading, error } = useContext(StreamContext);

    const startButtonImageIdle = require("../../assets/images/start_idle.svg");
    const stopButtonImageIdle = require("../../assets/images/back_idle.svg");

    const startButtonImagePressed = startButtonImageIdle;
    const stopButtonImagePressed = stopButtonImageIdle;

    const startButton = usePressableImage(startButtonImageIdle, startButtonImagePressed);
    const stopButton = usePressableImage(stopButtonImageIdle, stopButtonImagePressed);

    const router = useRouter();
    const [loaded, errorFont] = useFonts({
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
        router.push('/Play/Play' as Href);
    };

    const stopGameStart = () => {
        disconnect();
        router.push('/StartConnect/StartConnect' as Href);
    };
    console.log(loading)
    console.log('error', error)
    return (
        <View style={styles.container}>
            <View style={styles.imageFrame}>
                {error ? (
                    <ErrorModal />
                ) : loading ? (
                    <View style={styles.loadingContainer}>
                        <LoadingBar />
                    </View>
                ) : (
                    <Image
                        source={{ uri: frameUrl }}
                        style={styles.mainImage}
                        contentFit="contain"
                    />
                )}
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
