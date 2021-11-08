import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, SafeAreaView } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { TabThreeParamList } from "./../types";

type Props = StackScreenProps<TabThreeParamList, "PayOffer">;

export default function PayOfferScreen({ route, navigation }: Props) {
    const bid = route.params.bid;

    const subtotal = bid.$attributes.offer;
    const tax = subtotal * 0.12;
    const total = subtotal + tax;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ width: "100%", flex: 1, paddingVertical: 22 }}>
                <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 24, color: "#1e4052" }}>Total del Servicio</Text>

                <View style={{ backgroundColor: "#f2f3f5", paddingHorizontal: 16, paddingVertical: 24, borderRadius: 12, marginBottom: 24 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 20, color: "#4c5763", textAlign: "center" }}>Subtotal</Text>
                        <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 18, color: "#4c5763", textAlign: "center" }}>
                            $ {bid.$attributes.offer}
                        </Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 20, color: "#4c5763", textAlign: "center" }}>IVA</Text>
                        <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 18, color: "#4c5763", textAlign: "center" }}>
                            $ {tax.toFixed(2)}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            borderTopWidth: 2,
                            borderTopColor: "#13374a",
                            paddingTop: 22,
                            marginTop: 44,
                        }}>
                        <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 20, color: "#4c5763", textAlign: "center" }}>Total</Text>
                        <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 18, color: "#4c5763", textAlign: "center" }}>
                            $ {total.toFixed(2)}
                        </Text>
                    </View>
                </View>

                <View style={{ alignItems: "center", justifyContent: "center", width: "100%", marginBottom: 64 }}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Pay", { bid })}>
                        <Text style={{ color: "white", fontSize: 20 }}>Pagar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
    input: {
        borderColor: "#dce0e6",
        borderWidth: 1,
        height: 54,
        width: "100%",
        color: "black",
        paddingHorizontal: 12,
        marginBottom: 12,
        fontSize: 18,
        borderRadius: 10,
        fontWeight: "600",
    },
    button: {
        height: 54,
        width: "90%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#023047",
        borderRadius: 10,
    },
});
