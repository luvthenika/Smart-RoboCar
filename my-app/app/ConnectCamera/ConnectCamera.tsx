// import { Text, StyleSheet, View, Pressable, TouchableOpacity } from "react-native";
// import { Image } from "expo-image";
// import React, { useState, useEffect, useRef, useContext } from "react";
// import { useFonts } from "expo-font";
// import * as SplashScreen from "expo-splash-screen";
// import Video from 'react-native-video';
// import { useRouter } from "expo-router";
// import { WebView } from 'react-native-webview';
// import { StreamContext } from "../context/StartStreaming";


// export default function ConnectCamera() {
//     // const frameUrl = 'http://192.168.3.125'
//     // const frameUrlRef = useRef('');
//     // const ip = "192.168.3.5";
//     // const port = 8888;
//     // const socketRef = useRef<WebSocket | null>(null);
//     const { frameUrl, connect, disconnect } = useContext(StreamContext);
//     const startButtonImageIdle = require("../../assets/images/start_idle.svg");
//     const stopButtonImageIdle = require("../../assets/images/stop_idle.svg");
//     const router = useRouter();
//     const [loaded, error] = useFonts({
//         PixelifySans: require("../../assets/fonts/Pixelify_Sans/static/PixelifySans-Regular.ttf"),
//     });
//     console.log("frameurl", frameUrl);
//     // useEffect(() => {
//     //     frameUrlRef.current = frameUrl;
//     // }, [frameUrl]);

//     // useEffect(() => {
//     //     const ws = new WebSocket(`ws://${ip}:${port}/video`);
//     //     console.log(ws);
//     //     socketRef.current = ws;

//     //     ws.binaryType = 'blob';


//     // ws.onopen = () => {
//     //     console.log("WebSocket connected");
//     //     ws.send("Hello from client".toString());
//     // };

//     // ws.onerror = (event) => {
//     //     console.log("WebSocket error", event);
//     // };

//     // ws.onclose = () => {  
//     //     console.log("WebSocket closed");
//     // };

//     //     ws.onmessage = (event) => {
//     //         console.log("Received a frame of size:", event);
//     //         //const blob = new Blob([event.data], { type: 'image/jpeg' });
//     //         // const newUrl = URL.createObjectURL(blob);
//     //         // console.log("new url", newUrl);
//     //         // console.log(blob);
//     //         // console.log("Received a frame of size:");
//     //         // setFrameUrl((prevUrl) => {
//     //         //     if (prevUrl) URL.revokeObjectURL(prevUrl);
//     //         //     return newUrl;
//     //         // });
//     //         // const reader = new FileReader();
//     //         // reader.onload = () => {
//     //         //     const base64Data = reader.result;
//     //         //     console.log("Base64 data length:", base64Data?.toString().length);
//     //         //     setFrameUrl(base64Data?.toString() || '');
//     //         // };
//     //         // reader.readAsDataURL(event.data);
//     //         // if (typeof event.data === 'string') {
//     //         //     console.log("Received string:", event.data);
//     //         //     return;
//     //         // }
//     //     };

//     //     return () => {
//     //         ws.close();
//     //         if (frameUrlRef.current) URL.revokeObjectURL(frameUrlRef.current);
//     //     };
//     // }, []);


//     useEffect(() => {
//         if (loaded || error) {
//             SplashScreen.hideAsync();
//         }
//     }, [loaded, error]);

//     if (!loaded && !error) {
//         return null;
//     }
//     console.log(frameUrl);
//     return (
//         // frameUrl ? (
//         // <View style={{ flex: 1 }}>
//         //     <Image source={{ uri: frameUrl }} style={{ width: '100%', height: '100%' }} contentFit="contain" />
//         // </View>
//         // <View style={{ width: '100%', height: '100%' }}>
//         {/* <WebView
//                     source={{ uri: 'http://192.168.3.125/' }}
//                     // style={{ width: 600, height: 700, borderRadius: 0, borderWidth: 10, borderColor: '#FCEFF9', alignSelf: 'center', marginTop: 50 }}
//                     // style={{
//                     //     width: 300,        // Порада: для мобільного краще використовувати відносні значення
//                     //     height: 800,
//                     //     // borderRadius: 20,  // Заокруглення кутів
//                     //     // borderWidth: 5,    // Товщина рамки
//                     //     // borderColor: '#3498db', // Колір рамки
//                     //     // overflow: 'hidden'
//                     // }}
//                     javaScriptEnabled={true}
//                     injectedJavaScript={`
//         window.addEventListener('load', function() {
//             const img = document.querySelector('*');
//             if (img) {
//                 img.style.position = 'absolute';
//                 img.style.width = '700px';
//                 img.style.height = '1000px';
//                 img.style.transformOrigin = 'center';
//                 img.style.transform = 'rotate(180deg)';
//                 img.style.objectFit = 'cover';
//                 img.style.top = '0';
//                 img.style.left = '0';
//                 document.body.style.backgroundColor = 'red'; true;
//             }
//             document.body.style.backgroundColor = 'red'; true;"
//             document.body.style.margin = '0';
//             document.body.style.overflow = 'hidden';
//             document.body.style.backgroundColor = 'black';
//         });
//         true; // Це обов'язково для повернення результату в WebView
//     `}
//                     // Додаємо цей параметр, щоб скрипт виконувався відразу після завантаження
//                     injectedJavaScriptBeforeContentLoaded={`
//         document.body.style.backgroundColor = 'red';
//     `} */}

//                 {/* /> */ }
//     //     <View style={styles.overlay}>
//     //         <TouchableOpacity style={styles.button} onPress={() => console.log('Клік')}>
//     //             <Text style={styles.text}>Зробити фото</Text>
//     //         </TouchableOpacity>
//     //     </View>
//     // </View>
//     // ) : (
//     <View style={{ backgroundColor: '#FCEFF9', height: '100%', width: '100%', alignItems: 'center', flexDirection: 'column', flex: 1, justifyContent: 'space-between', gap: 50 }}>
//         <View style={styles.container}>
//             <View style={styles.innerContainer}>
//                 <img src={{ frameUrl }} style={{ width: '100%', height: '100%' }} contentFit="contain" />
//                 {/* <Text style={styles.title}>Camera is not connected</Text>
//                         <Text style={styles.title}>Please go back</Text> */}
//                 {/* <WebView
//                             source={{ uri: 'http://192.168.3.125/' }}
//                             style={{
//                                 width: 300,        // Порада: для мобільного краще використовувати відносні значення
//                                 height: 800,
//                                 // borderRadius: 20,  // Заокруглення кутів
//                                 // borderWidth: 5,    // Товщина рамки
//                                 // borderColor: '#3498db', // Колір рамки
//                                 // overflow: 'hidden'
//                             }}
//                             javaScriptEnabled={true}
//                             injectedJavaScript={`
//         window.addEventListener('load', function() {
//             const img = document.querySelector('*');
//             if (img) {
//                 img.style.position = 'absolute';
//                 img.style.width = '700px'; 
//                 img.style.height = '1000px';
//                 img.style.transformOrigin = 'center';
//                 img.style.transform = 'rotate(180deg)';
//                 img.style.objectFit = 'cover';
//                 img.style.top = '0';
//                 img.style.left = '0';
//                 "document.body.style.backgroundColor = 'red'; true;"
//             }
//             document.body.style.margin = '0';
//             document.body.style.overflow = 'hidden';
//             document.body.style.backgroundColor = 'black';
//         });
//         true; // Це обов'язково для повернення результату в WebView
//     `}
//                             // Додаємо цей параметр, щоб скрипт виконувався відразу після завантаження
//                             injectedJavaScriptBeforeContentLoaded={`
//         document.body.style.backgroundColor = 'black';
//     `}



//                         /> */}
//             </View>
//         </View>
//         <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 50 }}>
//             <Pressable>
//                 <Image source={startButtonImageIdle} style={styles.connectImage} contentFit="contain" />
//             </Pressable>
//             <Pressable style={{ marginTop: -50 }}>
//                 <Image source={stopButtonImageIdle} style={styles.connectImage} contentFit="contain" />
//             </Pressable>
//         </View>
//     </View>
//     );

// };

// const styles = StyleSheet.create({
//     container: {
//         backgroundColor: "FCEFF9",
//         borderStyle: "solid",
//         borderWidth: 40,
//         borderRadius: 80,
//         borderColor: "#FCEFF9",
//         alignItems: "center",
//         width: "100%",
//         flex: 1,
//         flexDirection: "column",
//         gap: 50,
//         justifyContent: "flex-start",
//         marginBottom: 100

//     },
//     innerContainer: {
//         backgroundColor: "white",
//         justifyContent: "center",
//         borderStyle: "solid",
//         borderWidth: 10,
//         borderRadius: 40,
//         borderColor: "#FCEFF9",
//         alignItems: "center",
//         width: "100%",
//         height: 400,
//         zIndex: 1

//     },
//     buttonContainer: {
//         height: 100,
//         width: "100%",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         gap: 10,
//     },
//     connectImage: {
//         width: 100,
//         height: 100,
//     },
//     title: {
//         fontSize: 18,
//         fontFamily: "PixelifySans",
//     },
//     overlay: {
//         position: 'absolute',
//         bottom: 50,
//         left: 20,
//         right: 20
//     },
//     button: { backgroundColor: 'blue', padding: 15, borderRadius: 10 },
//     text: { color: 'white', textAlign: 'center' }
// });

import { StyleSheet, View, Pressable } from "react-native";
import { Image } from "expo-image";
import React, { useEffect, useContext } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useRouter } from "expo-router";
import { StreamContext } from "../context/StartStreaming";

export default function ConnectCamera() {
    const { frameUrl, connect, disconnect } = useContext(StreamContext);
    const startButtonImageIdle = require("../../assets/images/start_idle.svg");
    const stopButtonImageIdle = require("../../assets/images/stop_idle.svg");

    const [loaded, error] = useFonts({
        PixelifySans: require("../../assets/fonts/Pixelify_Sans/static/PixelifySans-Regular.ttf"),
    });

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
            {/* Container for the main image */}
            <View style={styles.imageFrame}>
                <Image
                    source={{ uri: frameUrl }}
                    style={styles.mainImage}
                    contentFit="contain"
                />
            </View>

            {/* Start Button */}
            <Pressable onPress={connect} style={styles.button}>
                <Image
                    source={startButtonImageIdle}
                    style={styles.buttonImage}
                    contentFit="contain"
                />
            </Pressable>

            {/* Stop Button */}
            <Pressable onPress={disconnect} style={styles.button}>
                <Image
                    source={stopButtonImageIdle}
                    style={styles.buttonImage}
                    contentFit="contain"
                />
            </Pressable>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FCEFF9",
        alignItems: "center",
        justifyContent: "center", // Centering helps ensure buttons stay on screen
        gap: 20, // Reduced from 50 to prevent overflow
        padding: 20,
    },
    imageFrame: {
        width: 320,
        height: 400,
        borderRadius: 40,
        borderWidth: 10,
        borderColor: '#FFFFFF', // White border looks better on the pink background
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#000', // Helpful to see if image is loading
    },
    mainImage: {
        width: 550,
        height: '100%',
    },
    button: {
        width: 200,
        height: 60,
    },
    buttonImage: {
        width: '100%',
        height: '100%',
    }
});