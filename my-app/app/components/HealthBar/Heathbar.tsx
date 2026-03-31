import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

type HealthBarProps = {
    hearts?: number;
};

export default function HealthBar({ hearts = 5 }: HealthBarProps) {
    const heartFull = require('../../../assets/images/heart_full.svg');

    return (
        <View style={styles.wrapper}>
            <View style={styles.row}>
                {Array.from({ length: hearts }).map((_, index) => (
                    <Image
                        key={index}
                        source={heartFull}
                        style={styles.heart}
                        contentFit="contain"
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        zIndex: 10,
        transform: [{ rotate: '90deg' }],
        position: 'absolute',
        bottom: 120,
        left: 180,

    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    heart: {
        width: 40,
        height: 40,
    },
});
