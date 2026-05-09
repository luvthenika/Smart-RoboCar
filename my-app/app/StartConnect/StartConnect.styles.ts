import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 5,
        paddingBottom: 5,
        width: "100%",
        height: "100%",
        backgroundColor: "#FCEFF9",
    },
    appTitle: {
        fontSize: 20,
        lineHeight: 84,
        fontWeight: "700",
        color: "#F99ECF",
        fontFamily: "PixelifySans",
    },
    connectionString: {
        fontSize: 20,
        lineHeight: 84,
        fontWeight: "700",
        color: "#f99eeb",
        fontFamily: "PixelifySans",
    },
    robotImageWrapper: {
        justifyContent: "center",
        alignItems: "center",
    },
    robotImage: {
        width: 200,
        height: 200,
    },
    titleWrapper: {
        height: 100,
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 0,
    },
    buttonContainer: {
        gap: 5,
        alignItems: "center",
    },
    connectImage: {
        width: 200,
        height: 80,
    },
    quitImage: {
        width: 200,
        height: 60,
    },
});

export default styles;
