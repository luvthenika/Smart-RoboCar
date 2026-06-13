import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import HealthBar from '../components/HealthBar/Heathbar';
import Score from '../components/Score/Score';
import { StreamContext } from '../context/StartStreaming';
import { usePressableImage } from '../hooks/usePressableImage';
import styles from './Play.styles';

export default function Play() {
    const router = useRouter();
    const { frameUrl } = useContext(StreamContext);
    const [mode, setMode] = useState<"MANUAL_MODE" | "SMART_MODE">("MANUAL_MODE");

    const backButtonImageIdle = require("../../assets/images/back_idle.svg");
    const backButtonImagePressed = require("../../assets/images/back_pressed.svg");
    const arrowLeftIdle = require("../../assets/images/arrow_left_idle.svg");
    const arrowLeftPressed = require("../../assets/images/arrow_left_pressed.svg");
    const arrowRightIdle = require("../../assets/images/arrow_right_idle.svg");
    const arrowRightPressed = require("../../assets/images/arrow_right_pressed.svg");
    const arrowForwardIdle = require("../../assets/images/arrow_forward_idle.svg");
    const arrowForwardPressed = require("../../assets/images/arrow_forward_pressed.svg");
    const arrowBackwardIdle = require("../../assets/images/arrow_backward_idle.svg");
    const arrowBackwardPressed = require("../../assets/images/arrow_backward_pressed.svg");
    const stopButtonImageIdle = require("../../assets/images/stop_idle.svg");
    const stopButtonImagePressed = require("../../assets/images/stop_pressed.svg");
    const smartButtonImageIdle = require("../../assets/images/smart_idle.svg");
    const smartButtonImagePressed = require("../../assets/images/smart_pressed.svg");

    const backButton = usePressableImage(backButtonImageIdle, backButtonImagePressed);
    const leftButton = usePressableImage(arrowLeftIdle, arrowLeftPressed);
    const rightButton = usePressableImage(arrowRightIdle, arrowRightPressed);
    const forwardButton = usePressableImage(arrowForwardIdle, arrowForwardPressed);
    const backwardButton = usePressableImage(arrowBackwardIdle, arrowBackwardPressed);
    const stopButton = usePressableImage(stopButtonImageIdle, stopButtonImagePressed);
    const smartButton = usePressableImage(smartButtonImageIdle, smartButtonImagePressed, true);
    const ws = useRef<WebSocket | null>(null);
    const [pythonMessage, setPythonMessage] = useState<string | null>(null);
    const [score, setScore] = useState<Set<string>>(new Set());

    useEffect(() => {
        ws.current = new WebSocket('ws://0.0.0.0:8880/esp-32?role=client');

        ws.current.onopen = () => console.log('WebSocket connected');
        ws.current.onmessage = (event) => {
            const payload = event.data?.toString?.() ?? String(event.data);
            console.log('Received message:', payload);
            setPythonMessage(payload);
            setScore((prev) => {
                const next = new Set(prev);
                next.add(payload);
                return next;
            });
            setTimeout(() => setPythonMessage(null), 3000); // Clear message after 3 seconds
        };
        ws.current.onclose = () => console.log('WebSocket closed');
        ws.current.onerror = (error) => console.error('WebSocket Error:', error);

        const wsCurrent = ws.current;
        return () => {
            wsCurrent.close();
        };
    }, []);
    const sendCommand = (command: string) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(command);
            console.log(command)
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.imageFrame}>
                <Image
                    source={{ uri: frameUrl }}
                    style={styles.mainImage}
                    contentFit="contain"

                />
                <Score score={score.size} />
                <HealthBar />

                {pythonMessage ? (
                    <Text style={styles.pythonMessage}>Python: {pythonMessage}</Text>
                ) : null}
            </View>

            <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                <View style={styles.buttonContainer}>
                    <Pressable {...leftButton.pressableProps} style={styles.buttonLeft} onPress={() => sendCommand("GO_LEFT")} >
                        <Image source={leftButton.imageSource} style={styles.buttonImage} contentFit="contain" />
                    </Pressable>
                    <Pressable {...stopButton.pressableProps} style={styles.stopButton} onPress={() => sendCommand("STOP")}>
                        <Image source={stopButton.imageSource} style={styles.buttonImage} contentFit="contain" />
                    </Pressable>
                    <Pressable {...rightButton.pressableProps} style={styles.buttonRight} onPress={() => sendCommand("GO_RIGHT")}>
                        <Image source={rightButton.imageSource} style={styles.buttonImage} contentFit="contain" />
                    </Pressable>

                    <Pressable {...forwardButton.pressableProps} style={styles.buttonForward} onPress={() => sendCommand("GO_FORWARD")}>
                        <Image source={forwardButton.imageSource} style={styles.buttonImage} contentFit="contain" />
                    </Pressable>

                    <Pressable {...backwardButton.pressableProps} style={styles.buttonBackward} onPress={() => sendCommand("GO_BACKWARDS")}>
                        <Image source={backwardButton.imageSource} style={styles.buttonImage} contentFit="contain" />
                    </Pressable>
                </View>
                <View style={styles.smallButtonWrapper}>
                    <Pressable {...backButton.pressableProps} style={styles.backButton} onPress={() => router.push('/PreviewCamera/PreviewCamera')}>
                        <Image source={backButton.imageSource} style={styles.buttonImage} contentFit="contain" />
                    </Pressable>
                    <Pressable
                        {...smartButton.pressableProps}
                        style={styles.smartButton}
                        onPress={() => {
                            const newMode = mode === "MANUAL_MODE" ? "SMART_MODE" : "MANUAL_MODE";
                            setMode(newMode);
                            sendCommand(newMode);
                        }}
                    >
                        <Image source={smartButton.imageSource} style={styles.buttonImage} contentFit="contain" />
                    </Pressable>
                </View>
            </View>
        </View>
    );
}