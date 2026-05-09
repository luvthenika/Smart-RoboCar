import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { Href, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useContext, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { StreamContext } from "../context/StartStreaming";
import { usePressableImage } from "../hooks/usePressableImage";
import styles from "./StartConnect.styles";

export default function StartConnect() {
    const connectButtonImageIdle = require("../../assets/images/connect_idle.svg");
    const quitButtonImageIdle = require("../../assets/images/quit_idle.svg");
    const connectBuutonImagePressed = require("../../assets/images/connect_pressed.svg");
    const quitButtonImagePressed = require("../../assets/images/quit_pressed.svg");
    const robotHeadImage = require("../../assets/images/robot_head.png");

    const [wifiConnecting, setWifiConnecting] = useState(false);

    const router = useRouter();
    const { connect, disconnect } = useContext(StreamContext);

    const connectButton = usePressableImage(connectButtonImageIdle, connectBuutonImagePressed);
    const quitButton = usePressableImage(quitButtonImageIdle, quitButtonImagePressed);

    const handleStart = () => {
        setWifiConnecting(true);
        router.push('/PreviewCamera/PreviewCamera' as Href);
        connect();
    };

    const handleQuit = () => {
        setWifiConnecting(false);
        disconnect();
    };

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

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <View style={styles.robotImageWrapper}>
                    <Image style={styles.robotImage} source={robotHeadImage} contentFit="contain" />
                </View>
                <View style={styles.titleWrapper}>
                    <Text style={styles.appTitle}>Terrain Smart Drone ESP32 CAM</Text>
                </View>

                <Pressable {...connectButton.pressableProps} onPress={handleStart}>
                    <Image source={connectButton.imageSource} style={styles.connectImage} contentFit="contain" />
                </Pressable>

                <Pressable {...quitButton.pressableProps} onPress={handleQuit}>
                    <Image source={quitButton.imageSource} style={styles.quitImage} contentFit="contain" />
                </Pressable>
            </View>
        </View >
    );
};

