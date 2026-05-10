import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useRef } from 'react';
import { Pressable, View } from 'react-native';
import HealthBar from '../components/HealthBar/Heathbar';
import { StreamContext } from '../context/StartStreaming';
import { usePressableImage } from '../hooks/usePressableImage';
import styles from './Play.styles';

export default function Play() {
    const router = useRouter();
    const { frameUrl } = useContext(StreamContext);

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
    const stopButtonImagePressed = stopButtonImageIdle;
    const smartButtonImageIdle = require("../../assets/images/smart_idle.svg");
    const smartButtonImagePressed = require("../../assets/images/smart_pressed.svg");

    const backButton = usePressableImage(backButtonImageIdle, backButtonImagePressed);
    const leftButton = usePressableImage(arrowLeftIdle, arrowLeftPressed);
    const rightButton = usePressableImage(arrowRightIdle, arrowRightPressed);
    const forwardButton = usePressableImage(arrowForwardIdle, arrowForwardPressed);
    const backwardButton = usePressableImage(arrowBackwardIdle, arrowBackwardPressed);
    const stopButton = usePressableImage(stopButtonImageIdle, stopButtonImagePressed);
    const smartButton = usePressableImage(smartButtonImageIdle, smartButtonImagePressed);
    const ws = useRef<WebSocket | null>(null);
    useEffect(() => {
        ws.current = new WebSocket('ws://192.168.3.5:8880/commands');

        ws.current.onopen = () => console.log('WebSocket connected');
        ws.current.onmessage = (event) => {
            console.log('Received message:', event.data);
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
                <HealthBar />
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

                    <Pressable {...backwardButton.pressableProps} style={styles.buttonBackward} onPress={() => sendCommand("GO_BACKWARD")}>
                        <Image source={backwardButton.imageSource} style={styles.buttonImage} contentFit="contain" />
                    </Pressable>
                </View>
                <View style={styles.smallButtonWrapper}>
                    <Pressable {...backButton.pressableProps} style={styles.backButton} onPress={() => router.push('/PreviewCamera/PreviewCamera')}>
                        <Image source={backButton.imageSource} style={styles.buttonImage} contentFit="contain" />
                    </Pressable>
                    <Pressable {...smartButton.pressableProps} style={styles.smartButton} onPress={() => sendCommand("SMART_MODE")}>
                        <Image source={smartButton.imageSource} style={styles.buttonImage} contentFit="contain" />
                    </Pressable>
                </View>
            </View>
        </View>
    );
}