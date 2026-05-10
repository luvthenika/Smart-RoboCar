import { useMemo, useState } from "react";
import { ImageSourcePropType, PressableProps } from "react-native";

type UsePressableImageResult = {
    imageSource: ImageSourcePropType;
    pressableProps: Pick<PressableProps, "onPressIn" | "onPressOut">;
    disablePressOut?: boolean
};

export function usePressableImage(
    idleSource: ImageSourcePropType,
    pressedSource: ImageSourcePropType,
    disablePressOut: boolean = false
): UsePressableImageResult {
    const [isPressed, setIsPressed] = useState(false);

    const pressableProps = useMemo(
        () => disablePressOut
            ? {
                onPressIn: () => setIsPressed((prev) => !prev),
            }
            : {
                onPressIn: () => setIsPressed(true),
                onPressOut: () => setIsPressed(false),
            },
        [disablePressOut]
    );

    return {
        imageSource: isPressed ? pressedSource : idleSource,
        pressableProps,
        disablePressOut,
    };
}