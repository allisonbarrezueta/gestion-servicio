import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from "react-native";
import Icon from "react-native-vector-icons/Feather";

export default function MyBidsScreen({ navigation }: any) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ width: "100%", flex: 1, paddingVertical: 22 }}>
                <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 18, color: "#4c5763" }}>Mis Subastas:</Text>
                <TouchableOpacity onPress={() => navigation.navigate("ActiveOffers")} style={styles.button}>
                    <Text style={styles.label}>Ofertas Activas</Text>
                    <Icon name="chevron-right" size={28} color="#40667f" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("InactiveOffers")} style={styles.button}>
                    <Text style={styles.label}>Ofertas Inactivas</Text>
                    <Icon name="chevron-right" size={28} color="#40667f" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        paddingHorizontal: 22,
    },
    title: {
        fontSize: 20,
        fontWeight: "500",
        color: "#838a92",
        marginTop: 12,
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: "80%",
    },
    button: {
        borderWidth: 1,
        borderColor: "#ced2d8",
        borderRadius: 10,
        height: 54,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 12,
        marginBottom: 12,
    },
    label: { fontSize: 20, color: "#0d394e", fontWeight: "600" },
});
