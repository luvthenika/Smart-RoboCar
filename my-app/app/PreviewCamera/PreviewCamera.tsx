import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { Href, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useContext, useEffect, useRef } from "react";
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
    const stopButtonImagePressed = require("../../assets/images/back_pressed.svg");

    const startButton = usePressableImage(startButtonImageIdle, startButtonImagePressed);
    const stopButton = usePressableImage(stopButtonImageIdle, stopButtonImagePressed);

    const router = useRouter();
    const commandSocketRef = useRef<WebSocket | null>(null);

    const sendRestartCommand = () => {
        if (commandSocketRef.current && commandSocketRef.current.readyState === WebSocket.OPEN) {
            commandSocketRef.current.send("RESTART");
            return;
        }

        const cmdWs = new WebSocket('ws://192.168.3.5:8880/commands');
        cmdWs.onopen = () => {
            console.log("Command WebSocket connected");
            cmdWs.send("RESTART");
        };
        cmdWs.onmessage = (event) => {
            console.log("Command WS message:", event.data);
        };
        cmdWs.onclose = () => {
            console.log("Command WebSocket closed");
            if (commandSocketRef.current === cmdWs) {
                commandSocketRef.current = null;
            }
        };
        cmdWs.onerror = (error) => {
            console.error("Command WebSocket Error:", error);
            if (commandSocketRef.current === cmdWs) {
                commandSocketRef.current = null;
            }
        };
        commandSocketRef.current = cmdWs;
    };

    useEffect(() => {
        return () => {
            if (commandSocketRef.current) {
                commandSocketRef.current.close();
                commandSocketRef.current = null;
            }
        };
    }, []);

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
    console.log("frame", frameUrl)
    console.log('error', error)
    return (
        <View style={styles.container}>
            <View style={styles.imageFrame}>
                {error ? (
                    <ErrorModal onReload={sendRestartCommand} />
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

            <Pressable {...startButton.pressableProps} onPress={handleGameStart} style={styles.button}
            // disabled={loading || error}
            >
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
