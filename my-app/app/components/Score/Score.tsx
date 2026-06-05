import { useFonts } from 'expo-font';
import React from 'react';
import { Text, View } from 'react-native';

interface ScoreProps {
    score: number;
}

const Score: React.FC<ScoreProps> = ({ score }) => {
    const [loaded] = useFonts({
        PixelifySans: require('../../../assets/fonts/Pixelify_Sans/static/PixelifySans-Regular.ttf'),
    });

    if (!loaded) return null;

    return (
        <View style={{ position: 'absolute', top: 40, right: 0, zIndex: 10, transform: [{ rotate: '90deg' }], height: 40, }}>
            <Text
                style={{
                    color: '#ff69b4',
                    fontFamily: 'PixelifySans',
                    fontSize: 20,
                    letterSpacing: 2,
                }}
            >
                Score: {score}
            </Text>
        </View>
    );
};

export default Score;
