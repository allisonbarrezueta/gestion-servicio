import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, ActivityIndicator, SafeAreaView, TextInput } from "react-native";
import get from "lodash/get";
import { StackScreenProps } from "@react-navigation/stack";

/* Types */
import { MyBidsParamsList } from "./../types";
import Http from "../modules/Http";
import ErrorLabel from "../components/ErrorLabel";
import { useEffect } from "react";

type Props = StackScreenProps<MyBidsParamsList, "EditOffer">;

export default function EditOfferScreen({ route, navigation }: Props) {
    const [loading, setLoading] = useState(false);
    const [offer, setOffer] = useState("");
    const [description, setDescription] = useState("");
    const bid = route.params.bid;
    const request = route.params.request;
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setOffer(`${bid.$attributes.offer}`);
        setDescription(bid.$attributes.description);
    }, [bid]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await Http.patch(`/bids/${bid.$attributes.id}`, {
                offer,
                description,
            });

            return navigation.reset({
                routes: [{ name: "ActiveOffer", params: { request } }],
            });
        } catch (error) {
            const errors = get(error, "response.data.errors", {});
            setErrors(errors);
        } finally {
            setLoading(false);
        }
    };
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ width: "100%", flex: 1, paddingVertical: 22 }}>
                <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 18, color: "#4c5763" }}>Editar Oferta</Text>

                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    <View style={{ marginBottom: 24, width: "100%" }}>
                        <View style={{ marginBottom: 24 }}>
                            <TextInput
                                placeholder="Precio"
                                placeholderTextColor="#909eaf"
                                value={offer}
                                keyboardType="decimal-pad"
                                onChangeText={setOffer}
                                style={{ ...styles.input, width: "50%" }}
                            />
                            <ErrorLabel errors={errors} name="offer" />
                        </View>

                        <View style={{ marginBottom: 24 }}>
                            <TextInput
                                placeholder="Descripción"
                                multiline={true}
                                placeholderTextColor="#909eaf"
                                value={description}
                                onChangeText={setDescription}
                                style={{ ...styles.input, paddingTop: 12, height: 150 }}
                            />
                            <ErrorLabel errors={errors} name="description" />
                        </View>

                        <View style={{ alignItems: "center", justifyContent: "center", width: "100%", marginBottom: 64 }}>
                            {loading ? (
                                <TouchableOpacity style={styles.button}>
                                    <ActivityIndicator size="small" color="white" />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                    <Text style={{ color: "white", fontSize: 20 }}>Actualizar Oferta</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
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
        borderColor: "#ced2d8",
        borderWidth: 1,
        height: 54,
        width: "100%",
        color: "black",
        paddingHorizontal: 12,
        fontSize: 18,
        borderRadius: 10,
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
