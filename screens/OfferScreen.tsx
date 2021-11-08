import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, TextInput, ScrollView, Image, SafeAreaView } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { AirbnbRating } from "react-native-ratings";
import { StackScreenProps } from "@react-navigation/stack";
import { TabThreeParamList } from "./../types";
import get from "lodash/get";

/* Models */
import User from "./../models/User";

type Props = StackScreenProps<TabThreeParamList, "Offer">;

export default function OfferScreen({ route, navigation }: Props) {
    const bid = route.params.bid;
    const user: User = bid.$relations.user;

    let rating = get(user, "$attributes.average_rating", 1);
    if (!rating) {
        rating = 1;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ width: "100%", flex: 1, paddingVertical: 22 }}>
                <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 18, color: "#4c5763" }}>Oferta</Text>

                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    <Image style={{ width: 100, height: 100, marginBottom: 4 }} source={require("./../assets/images/user_icon.png")} />
                    <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 18, color: "#4c5763", textAlign: "center" }}>
                        {bid.$relations.user.$attributes.company_name}
                    </Text>
                </View>

                <View style={{ marginBottom: 24 }}>
                    <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 8, color: "#47525d" }}>Descripción de Servicio</Text>
                    <TextInput
                        placeholder="Descripción"
                        multiline={true}
                        editable={false}
                        placeholderTextColor="#909eaf"
                        value={bid.$attributes.description}
                        style={{ ...styles.input, paddingTop: 12, height: 100 }}
                    />
                    <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 8, color: "#47525d" }}>Precio de Proveedor</Text>
                    <TextInput
                        placeholder="Precio"
                        editable={false}
                        value={`$ ${bid.$attributes.offer}`}
                        placeholderTextColor="#909eaf"
                        style={styles.input}
                    />
                </View>

                <TouchableOpacity
                    onPress={() => navigation.navigate("Comments", { user: bid.$relations.user })}
                    style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                    <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 18, color: "#4c5763" }}>Calificaciones y opiniones</Text>
                    <Icon name="arrow-right" size={24} color="#40667f" />
                </TouchableOpacity>

                <AirbnbRating showRating={false} isDisabled={true} starContainerStyle={{ marginBottom: 32 }} defaultRating={rating} />

                <View style={{ alignItems: "center", justifyContent: "center", width: "100%", marginBottom: 64 }}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("PayOffer", { bid })}>
                        <Text style={{ color: "white", fontSize: 20 }}>Elegir y Pagar</Text>
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
