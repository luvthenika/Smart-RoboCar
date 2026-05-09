import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import Svg, { ClipPath, Defs, G, Rect, Use } from 'react-native-svg';

// 1. Create an animated version of the SVG Rect
const AnimatedRect = Animated.createAnimatedComponent(Rect);

export default function LoadingBar() {
    // 2. Initialize our animation value (starting width is 0)
    const maskWidth = useRef(new Animated.Value(0)).current;

    // 3. Set up the animation loop
    useEffect(() => {
        Animated.loop(
            Animated.timing(maskWidth, {
                toValue: 555, // The full width of the SVG
                duration: 2500, // 2.5 seconds
                useNativeDriver: false, // Must be false because we are animating an SVG attribute, not a UI View
            })
        ).start();
    }, [maskWidth]);

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Svg width="300" height="50" viewBox="0 0 555 135" fill="none">
                <Defs>
                    {/* Animated mask that reveals the bright layer */}
                    <ClipPath id="loading-mask">
                        <AnimatedRect x="0" y="0" width={maskWidth} height="135" />
                    </ClipPath>

                    {/* Group containing your pixel art */}
                    <G id="loader-art">
                        {/* The background fill that completes the right side */}
                        <Rect x="195" y="45" width="345" height="60" fill="#F99ECF" />

                        {/* Your original pixels */}
                        <Rect x="195" y="45" width="15" height="15" fill="#F99ECF" />
                        <Rect x="210" y="45" width="15" height="15" fill="#F99ECF" />
                        <Rect x="210" y="60" width="15" height="15" fill="#F99ECF" />
                        <Rect x="195" y="60" width="15" height="15" fill="#F99ECF" />
                        <Rect x="210" y="75" width="15" height="15" fill="#F99ECF" />
                        <Rect x="195" y="75" width="15" height="15" fill="#F99ECF" />
                        <Rect x="180" y="75" width="15" height="15" fill="#F99ECF" />
                        <Rect x="225" y="45" width="15" height="15" fill="#F99ECF" />
                        <Rect x="225" y="60" width="15" height="15" fill="#F99ECF" />
                        <Rect x="225" y="75" width="15" height="15" fill="#F99ECF" />
                        <Rect x="240" y="45" width="15" height="15" fill="#F99ECF" />
                        <Rect x="240" y="60" width="15" height="15" fill="#F99ECF" />
                        <Rect x="240" y="75" width="15" height="15" fill="#F99ECF" />
                        <Rect x="255" y="45" width="15" height="15" fill="#F99ECF" />
                        <Rect x="255" y="60" width="15" height="15" fill="#F99ECF" />
                        <Rect x="255" y="75" width="15" height="15" fill="#F99ECF" />
                        <Rect x="270" y="45" width="15" height="15" fill="#F99ECF" />
                        <Rect x="270" y="60" width="15" height="15" fill="#F99ECF" />
                        <Rect x="270" y="75" width="15" height="15" fill="#F99ECF" />
                        <Rect x="285" y="45" width="15" height="15" fill="#F99ECF" />
                        <Rect x="285" y="60" width="15" height="15" fill="#F99ECF" />
                        <Rect x="285" y="75" width="15" height="15" fill="#F99ECF" />
                        <Rect x="300" y="45" width="15" height="15" fill="#F99ECF" />
                        <Rect x="300" y="60" width="15" height="15" fill="#F99ECF" />
                        <Rect x="300" y="75" width="15" height="15" fill="#F99ECF" />
                        <Rect x="315" y="45" width="15" height="15" fill="#F99ECF" />
                        <Rect x="315" y="60" width="15" height="15" fill="#F99ECF" />
                        <Rect x="315" y="75" width="15" height="15" fill="#F99ECF" />
                        <Rect x="330" y="45" width="15" height="15" fill="#F99ECF" />
                        <Rect x="345" y="45" width="15" height="15" fill="#F99ECF" />
                        <Rect x="345" y="60" width="15" height="15" fill="#F99ECF" />
                        <Rect x="360" y="60" width="15" height="15" fill="#F99ECF" />
                        <Rect x="375" y="60" width="15" height="15" fill="#F99ECF" />
                        <Rect x="390" y="60" width="15" height="15" fill="#F99ECF" />
                        <Rect x="375" y="75" width="15" height="15" fill="#F99ECF" />
                        <Rect x="360" y="75" width="15" height="15" fill="#F99ECF" />
                        <Rect x="345" y="75" width="15" height="15" fill="#F99ECF" />
                        <Rect x="360" y="45" width="15" height="15" fill="#F99ECF" />
                        <Rect x="375" y="45" width="15" height="15" fill="#F99ECF" />
                        <Rect x="390" y="45" width="15" height="15" fill="#F99ECF" />
                        <Rect x="405" y="45" width="15" height="15" fill="#F99ECF" />
                        <Rect x="330" y="60" width="15" height="15" fill="#F99ECF" />
                        <Rect x="330" y="75" width="15" height="15" fill="#F99ECF" />
                        <Rect x="420" y="45" width="15" height="15" fill="#F99ECF" />
                        <Rect x="60" y="75" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="75" y="75" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="90" y="75" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="90" y="60" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="90" y="45" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="75" y="16" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="60" y="1" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="45" y="1" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="30" y="15" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="15" y="31" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="15" y="45" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="30" y="60" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="45" y="75" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="60" y="90" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="75" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="90" y="120" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="105" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="120" y="90" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="120" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="135" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="330" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="495" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="540" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="540" y="90" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="540" y="75" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="540" y="60" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="540" y="46" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="315" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="480" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="315" y="31" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="480" y="31" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="300" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="465" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="300" y="31" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="465" y="31" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="285" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="450" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="285" y="31" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="450" y="31" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="270" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="435" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="270" y="31" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="435" y="31" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="255" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="420" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="255" y="31" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="420" y="31" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="240" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="405" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="240" y="31" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="405" y="31" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="225" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="390" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="225" y="31" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="390" y="31" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="210" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="375" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="540" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="210" y="31" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="375" y="31" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="540" y="31" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="195" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="360" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="525" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="180" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="345" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="510" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="165" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="150" y="105" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="330" y="31" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="495" y="31" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="540" y="31" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="135" y="75" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="150" y="60" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="165" y="45" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="165" y="31" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="180" y="31" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="345" y="31" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="510" y="31" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="195" y="31" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="360" y="31" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="525" y="31" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="150" y="15" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="135" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="120" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="105" y="15" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="90" y="31" width="15" height="15" fill="#F9B8EB" fillOpacity="0.68" />
                        <Rect x="60" y="16" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="45" y="16" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="30" y="30" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="60" y="30" width="15" height="15" fill="#FFDBF7" />
                        <Rect x="45" y="45" width="15" height="15" fill="#FFDBF7" />
                        <Rect x="45" y="30" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="75" y="31" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="75" y="45" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="75" y="60" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="60" y="60" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="60" y="45" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="45" y="60" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="30" y="45" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="90" y="105" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="105" y="90" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="90" y="90" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="75" y="90" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="120" y="75" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="120" y="60" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="120" y="45" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="105" y="30" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="105" y="45" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="105" y="60" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="105" y="75" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="120" y="30" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="120" y="15" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="135" y="15" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="135" y="30" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="135" y="45" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="135" y="60" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="150" y="30" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="150" y="45" width="15" height="15" fill="#FEDCF6" />
                        <Rect x="75" y="120" width="15" height="15" fill="#F99ECF" />
                        <Rect x="60" y="105" width="15" height="15" fill="#F99ECF" />
                        <Rect x="90" y="16" width="15" height="15" fill="#F99ECF" />
                        <Rect x="45" y="90" width="15" height="15" fill="#F99ECF" />
                        <Rect x="30" y="75" width="15" height="15" fill="#F99ECF" />
                        <Rect x="15" y="60" width="15" height="15" fill="#F99ECF" />
                        <Rect y="45" width="15" height="15" fill="#F99ECF" />
                        <Rect y="31" width="15" height="15" fill="#F99ECF" />
                        <Rect x="15" y="16" width="15" height="15" fill="#F99ECF" />
                        <Rect x="30" y="1" width="15" height="15" fill="#F99ECF" />
                        <Rect x="105" width="15" height="15" fill="#F99ECF" />
                        <Rect x="180" y="46" width="15" height="15" fill="#F99ECF" />
                        <Rect x="180" y="60" width="15" height="15" fill="#F99ECF" />
                        <Rect x="165" y="60" width="15" height="15" fill="#F99ECF" />
                        <Rect x="165" y="75" width="15" height="15" fill="#F99ECF" />
                        <Rect x="165" y="90" width="15" height="15" fill="#F99ECF" />
                        <Rect x="405" y="60" width="15" height="15" fill="#F99ECF" />
                        <Rect x="390" y="75" width="15" height="15" fill="#F99ECF" />
                        <Rect x="375" y="90" width="15" height="15" fill="#F99ECF" />
                        <Rect x="360" y="90" width="15" height="15" fill="#F99ECF" />
                        <Rect x="345" y="90" width="15" height="15" fill="#F99ECF" />
                        <Rect x="330" y="90" width="15" height="15" fill="#F99ECF" />
                        <Rect x="315" y="90" width="15" height="15" fill="#F99ECF" />
                        <Rect x="300" y="90" width="15" height="15" fill="#F99ECF" />
                        <Rect x="285" y="90" width="15" height="15" fill="#F99ECF" />
                        <Rect x="270" y="90" width="15" height="15" fill="#F99ECF" />
                        <Rect x="255" y="90" width="15" height="15" fill="#F99ECF" />
                        <Rect x="240" y="90" width="15" height="15" fill="#F99ECF" />
                        <Rect x="225" y="90" width="15" height="15" fill="#F99ECF" />
                        <Rect x="210" y="90" width="15" height="15" fill="#F99ECF" />
                        <Rect x="195" y="90" width="15" height="15" fill="#F99ECF" />
                        <Rect x="180" y="90" width="15" height="15" fill="#F99ECF" />
                        <Rect x="150" y="75" width="15" height="15" fill="#F99ECF" />
                        <Rect x="150" y="90" width="15" height="15" fill="#F99ECF" />
                        <Rect x="135" y="90" width="15" height="15" fill="#F99ECF" />
                    </G>
                </Defs>

                {/* The faded background (opacity applied here) */}
                <Use href="#loader-art" opacity="0.25" />

                {/* The bright layer restricted by the animated mask */}
                <Use href="#loader-art" clipPath="url(#loading-mask)" />
            </Svg>
        </View>
    );
}