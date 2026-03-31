import { useContext, useEffect, useRef, useState } from 'react';
import { StreamContext } from '../context/StartStreaming';
import { View, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import HealthBar from '../components/HealthBar/Heathbar';
import { usePressableImage } from '../hooks/usePressableImage';

export default function Play() {
    const { frameUrl } = useContext(StreamContext);

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

    const leftButton = usePressableImage(arrowLeftIdle, arrowLeftPressed);
    const rightButton = usePressableImage(arrowRightIdle, arrowRightPressed);
    const forwardButton = usePressableImage(arrowForwardIdle, arrowForwardPressed);
    const backwardButton = usePressableImage(arrowBackwardIdle, arrowBackwardPressed);
    const stopButton = usePressableImage(stopButtonImageIdle, stopButtonImagePressed);
    const ws = useRef<WebSocket | null>(null);
    useEffect(() => {
        // Connect
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

                <Pressable {...stopButton.pressableProps} style={styles.stopButton} onPress={() => sendCommand("STOP")}>
                    <Image source={stopButton.imageSource} style={styles.buttonImage} contentFit="contain" />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FCEFF9",
        gap: 20,
        padding: 20,
    },
    imageFrame: {
        width: 350,
        height: 500,
        borderRadius: 40,
        borderWidth: 10,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        backgroundColor: '#000',
        marginTop: 50,
        position: 'relative',
    },
    mainImage: {
        width: 700,
        height: 500,
    },
    buttonContainer: {
        position: 'relative',
        height: 250,
        width: 250,
        transform: [{ rotate: '90deg' }],
    },
    buttonLeft: {
        width: 100,
        height: 80,
        position: 'absolute',
        left: 50,
        top: 85,
    },
    stopButton: {
        width: 120,
        height: 100,
        transform: [{ rotate: '90deg' }],
    },
    buttonRight: {
        width: 100,
        height: 80,
        position: 'absolute',
        left: 150,
        top: 85,
    },
    buttonForward: {
        width: 100,
        height: 80,
        position: 'absolute',
        left: 100,
        top: 5,
    },
    buttonBackward: {
        width: 100,
        height: 80,
        position: 'absolute',
        left: 100,
        top: 160,
    },
    buttonImage: {
        width: '100%',
        height: '100%',
    }
});