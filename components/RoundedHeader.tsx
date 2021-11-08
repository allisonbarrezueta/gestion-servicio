import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";

const window = Dimensions.get("window");

interface Props {
    text: string;
}

export default function RoundedHeader({ text }: Props) {
    return (
        <View style={styles.containerStyle}>
            <View style={styles.sliderContainerStyle}></View>
            <Text style={{ color: "white", fontSize: 26, fontWeight: "600", marginTop: 24 }}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    containerStyle: {
        alignSelf: "center",
        width: window.width,
        overflow: "hidden",
        height: 150,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    sliderContainerStyle: {
        borderRadius: window.width,
        width: window.width * 2,
        height: window.width * 2,
        marginLeft: -(window.width / 2),
        position: "absolute",
        bottom: 0,
        overflow: "hidden",
        backgroundColor: "#1f93b5",
    },
});
