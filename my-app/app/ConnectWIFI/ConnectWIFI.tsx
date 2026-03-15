import { Text, StyleSheet, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { useState, useEffect, useContext } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useRouter } from "expo-router";
import { StreamContext } from "../context/StartStreaming";

export default function ConnectWIFI() {
    const connectButtonImageIdle = require("../../assets/images/connect_idle.svg");
    const quitButtonImageIdle = require("../../assets/images/quit_idle.svg");
    const connectBuutonImagePressed = require("../../assets/images/connect_pressed.svg");
    const quitButtonImagePressed = require("../../assets/images/quit_pressed.svg");
    const robotHeadImage = require("../../assets/images/robot_head.png");

    const [connectButtonPressed, setConnectButtonPressed] = useState(false);
    const [quitButtonPressed, setQuitButtonPressed] = useState(false);
    const [wifiConnecting, setWifiConnecting] = useState(false);

    const [connectingText, setConnectingText] = useState("Connect to Wi-Fi");
    const router = useRouter();
    const { connect, disconnect } = useContext(StreamContext);

    const handleStart = () => {
        setConnectButtonPressed(true);
        setWifiConnecting(true);
        setQuitButtonPressed(false);
        router.push('/ConnectCamera/ConnectCamera')
        connect();
    };
    const handleQuit = () => {
        setQuitButtonPressed((quitButtonPressed) => !quitButtonPressed);
        setConnectButtonPressed(false);
        setWifiConnecting(false);
        disconnect();
    };

    const [loaded, error] = useFonts({
        PixelifySans: require("../../assets/fonts/Pixelify_Sans/static/PixelifySans-Regular.ttf"),
    });
    const connectionStringText = ["Connecting.", "Connecting..", "Connecting...", "Connecting....", "Connecting....."];

    useEffect(() => {
        if (wifiConnecting) {
            let i = 0;
            setConnectingText(connectionStringText[0]);
            const interval = setInterval(() => {
                i = (i + 1) % connectionStringText.length;
                setConnectingText(connectionStringText[i]);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setConnectingText("Connect to Wi-Fi");
        }
    }, [wifiConnecting]);

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
                <View>
                    <Image style={{ width: 200, height: 200 }} source={robotHeadImage} contentFit="contain" />
                </View>
                <View style={{ height: 100, width: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 0 }} >
                    <Text style={styles.appTitle}>Terrain Smart Drone ESP32 CAM</Text>
                    <Text style={{ ...styles.appTitle }}>{connectingText}</Text>
                </View>
                <Pressable
                    onPress={() => {
                        handleStart();
                    }}
                >
                    <Image source={connectButtonPressed ? connectBuutonImagePressed : connectButtonImageIdle} style={styles.connectImage} contentFit="contain" />
                </Pressable>
                <Pressable
                    onPress={() => {
                        handleQuit();
                    }}
                >
                    <Image source={quitButtonPressed ? quitButtonImagePressed : quitButtonImageIdle} style={styles.quitImage} contentFit="contain" />
                </Pressable>
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 5,
        paddingBottom: 5,
        width: "100%",
        height: "100%",
        backgroundColor: "#FCEFF9",
    },
    appTitle: {
        fontSize: 20,
        lineHeight: 84,
        fontWeight: "700",
        color: "#F99ECF",
        fontFamily: "PixelifySans",
    },
    connectionString: {
        fontSize: 20,
        lineHeight: 84,
        fontWeight: "700",
        color: "#f99eeb",
        fontFamily: "PixelifySans",
    },
    image: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: "white",
        fontSize: 42,
        lineHeight: 84,
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: "#000000c0",
    },
    buttonContainer: {
        gap: 5,
        alignItems: "center",
    },
    connectImage: {
        width: 200,
        height: 80,
    },
    quitImage: {
        width: 200,
        height: 60,
    },
});