import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface RetroButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
}
interface ErrorModalProps {
    onReload?: () => void;
}
const RetroButton = ({ title, onPress, disabled }: RetroButtonProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={[styles.retroButton, disabled && styles.retroButtonDisabled]}
        >
            <Text style={[styles.fontPixel, styles.retroButtonText, disabled && styles.disabledText]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const ErrorModal = ({ onReload }: ErrorModalProps) => {
    const [modalVisible, setModalVisible] = useState(true);

    // Your font loader
    const [loaded, errorFont] = useFonts({
        PixelifySans: require("../../../assets/fonts/Pixelify_Sans/static/PixelifySans-Regular.ttf"),
    });

    const closeModal = () => {
        setModalVisible(false);
    };

    // Wait for font to load before rendering
    if (!loaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.centeredView}>
                    <View style={styles.stickerBorder}>
                        <View style={styles.window}>
                            <View style={styles.titleBar}>
                                <Text style={[styles.fontPixel, styles.titleText]}>System Error</Text>

                                <TouchableOpacity onPress={closeModal} style={styles.closeBtn}>
                                    <Text style={[styles.fontPixel, styles.closeBtnText]}>x</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.windowBody}>
                                <View style={styles.contentRow}>

                                    {/* Pixelated Red Error Icon (built with overlapping blocky views) */}
                                    <View style={styles.pixelIconContainer}>
                                        <View style={styles.pixelIconVertical} />
                                        <View style={styles.pixelIconHorizontal}>
                                            <Text style={[styles.fontPixel, styles.errorIconText]}>x</Text>
                                        </View>
                                        {/* Blocky shadow */}
                                        <View style={styles.pixelIconShadow} />
                                    </View>

                                    <Text style={[styles.fontPixel, styles.messageText]}>
                                        Websocket Error! Try reconnecting
                                    </Text>
                                </View>

                                {/* Bottom Buttons */}
                                <View style={styles.buttonContainer}>
                                    <RetroButton title="Cancel" onPress={closeModal} />
                                    <RetroButton title="Reload" onPress={() => {
                                        onReload?.();
                                        closeModal();
                                    }} />
                                </View>
                            </View>
                        </View>

                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    // --- Global Font Style ---
    fontPixel: {
        fontFamily: 'PixelifySans',
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    openBtn: {
        padding: 15,
        backgroundColor: '#333',
        borderWidth: 2,
        borderColor: '#000',
    },
    openBtnText: {
        color: '#fff',
        fontSize: 16,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    stickerBorder: {
        backgroundColor: '#FFFFFF',
        padding: 4,
        borderRadius: 8, // The outside sticker is smooth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 10,
    },
    window: {
        width: 320,
        borderWidth: 2,
        borderColor: '#f49ac1',
        backgroundColor: '#eae4e4',
        borderRadius: 0,
    },
    titleBar: {
        backgroundColor: '#fca7da',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    titleText: {
        color: '#FFFFFF',
        fontSize: 18,
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 0,
        letterSpacing: 1,
    },
    closeBtn: {
        backgroundColor: '#8a8a8a',
        width: 22,
        height: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 2,
        borderLeftWidth: 2,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderTopColor: '#e0e0e0',
        borderLeftColor: '#e0e0e0',
        borderBottomColor: '#333333',
        borderRightColor: '#333333',
        borderRadius: 0,
    },
    closeBtnText: {
        color: '#e0e0e0',
        fontSize: 14,
        lineHeight: 16,
        marginBottom: 2,
    },
    windowBody: {
        padding: 20,
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },

    pixelIconContainer: {
        width: 28,
        height: 28,
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pixelIconVertical: {
        position: 'absolute',
        backgroundColor: '#e50000',
        width: 16,
        height: 28,
        zIndex: 2,
    },
    pixelIconHorizontal: {
        position: 'absolute',
        backgroundColor: '#e50000',
        width: 28,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3,
    },
    pixelIconShadow: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.3)',
        width: 28,
        height: 28,
        top: 2,
        left: 2,
        zIndex: 1,
    },
    errorIconText: {
        color: '#FFFFFF',
        fontSize: 22,
        lineHeight: 22,
        marginBottom: 2,
        // Drop shadow on the X
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 0,
    },
    // ----------------------------

    messageText: {
        flex: 1,
        color: '#000000',
        fontSize: 14,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingHorizontal: 5,
    },
    retroButton: {
        backgroundColor: '#eaddcd',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderTopWidth: 2,
        borderLeftWidth: 2,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderTopColor: '#ffffff',
        borderLeftColor: '#ffffff',
        borderBottomColor: '#000000',
        borderRightColor: '#000000',
        borderRadius: 0, // Sharp edges
    },
    retroButtonDisabled: {
        borderTopColor: '#d3cfc1',
        borderLeftColor: '#d3cfc1',
        borderBottomColor: '#a09d94',
        borderRightColor: '#a09d94',
    },
    retroButtonText: {
        color: '#000',
        fontSize: 14,
    },
    disabledText: {
        color: '#a09d94',
    },
});

export default ErrorModal;