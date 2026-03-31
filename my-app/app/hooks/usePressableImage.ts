import { useMemo, useState } from "react";
import { ImageSourcePropType, PressableProps } from "react-native";

type UsePressableImageResult = {
    imageSource: ImageSourcePropType;
    pressableProps: Pick<PressableProps, "onPressIn" | "onPressOut">;
};

export function usePressableImage(
    idleSource: ImageSourcePropType,
    pressedSource: ImageSourcePropType
): UsePressableImageResult {
    const [isPressed, setIsPressed] = useState(false);

    const pressableProps = useMemo(
        () => ({
            onPressIn: () => setIsPressed(true),
            onPressOut: () => setIsPressed(false),
        }),
        []
    );

    return {
        imageSource: isPressed ? pressedSource : idleSource,
        pressableProps,
    };
}