import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions } from "react-native";
import RoundedHeader from "../components/RoundedHeader";

import { RootStackParamList } from "../types";

const window = Dimensions.get("window");

export default function RegisterScreen({ navigation }: StackScreenProps<RootStackParamList, "Register">) {
    return (
        <View style={styles.container}>
            <RoundedHeader text="Regístrate como" />
            <View style={{ flex: 1, justifyContent: "center" }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("RegisterForm", { type: "client" })}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
                    <Image style={{ width: 150, height: 150, marginBottom: 24 }} source={require("./../assets/images/customer.png")} />
                    <Text style={styles.title}>Cliente</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate("RegisterForm", { type: "supplier" })}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Image style={{ width: 150, height: 150, marginBottom: 24 }} source={require("./../assets/images/worker.png")} />
                    <Text style={styles.title}>Proveedor</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 42,
    },
    title: {
        fontSize: 28,
        fontWeight: "600",
        marginBottom: 32,
        color: "#184155",
    },
    input: {
        borderColor: "#dce0e6",
        borderWidth: 1,
        height: 54,
        width: "100%",
        color: "black",
        paddingHorizontal: 12,
        marginBottom: 24,
        fontSize: 18,
    },
    button: {
        height: 54,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#023047",
        borderRadius: 10,
        marginBottom: 20,
    },
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
    slider: {
        height: window.width / 1.7,
        width: window.width,
        position: "absolute",
        bottom: 0,
        marginLeft: window.width / 2,
        backgroundColor: "#9DD6EB",
    },
});
