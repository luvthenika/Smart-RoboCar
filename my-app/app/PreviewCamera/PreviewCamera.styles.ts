import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FCEFF9",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        padding: 20,
    },
    imageFrame: {
        width: 320,
        height: 400,
        borderRadius: 40,
        borderWidth: 10,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#fff',

    },
    mainImage: {
        width: 550,
        height: '100%'
    },
    button: {
        width: 200,
        height: 60,
    },
    buttonImage: {
        width: '100%',
        height: '100%',
    },
    loadingContainer: {
        position: 'absolute',
        top: '50%'
    },
});