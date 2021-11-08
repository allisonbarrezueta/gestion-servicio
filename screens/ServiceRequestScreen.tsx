import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, SafeAreaView, Image, TextInput } from "react-native";
import dayjs from "dayjs";
import { StackScreenProps } from "@react-navigation/stack";
import AutoHeightImage from "react-native-auto-height-image";

/* Types */
import { TabOneParamList } from "./../types";

type Props = StackScreenProps<TabOneParamList, "Solicitud de Servicio">;

export default function ServiceRequestScreen({ route, navigation }: Props) {
    const request = route.params.request;
    const date = dayjs(request.$attributes.date).format("YYYY-MM-DD");
    const hour = dayjs(request.$attributes.date).format("HH:mm");

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ width: "100%", flex: 1, paddingVertical: 22 }}>
                <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 18, color: "#4c5763" }}>Solicitudes de Servicio</Text>

                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    <TouchableOpacity onPress={() => navigation.navigate("Detalle de Cliente", { user: request.$relations?.user })}>
                        <Image style={{ width: 100, height: 100, marginBottom: 4 }} source={require("./../assets/images/user_icon.png")} />
                        <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 18, color: "#4c5763", textAlign: "center" }}>
                            {request.$relations?.user?.$attributes?.name} {request.$relations?.user?.$attributes?.last_name}
                        </Text>
                    </TouchableOpacity>

                    <View style={{ marginBottom: 24, width: "100%" }}>
                        <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 8, color: "#47525d" }}>Descripción del Servicio</Text>

                        <TextInput
                            placeholder="Descripción"
                            multiline={true}
                            editable={false}
                            placeholderTextColor="#909eaf"
                            value={request.$attributes.description}
                            style={{ ...styles.input, paddingTop: 12, height: 100 }}
                        />

                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <View style={{ width: "48%" }}>
                                <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 8, color: "#47525d" }}>Fecha</Text>
                                <TextInput placeholder="Precio" editable={false} value={date} placeholderTextColor="#909eaf" style={styles.input} />
                            </View>
                            <View style={{ width: "48%" }}>
                                <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 8, color: "#47525d" }}>Hora</Text>
                                <TextInput placeholder="Precio" editable={false} value={hour} placeholderTextColor="#909eaf" style={styles.input} />
                            </View>
                        </View>

                        <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 8, color: "#47525d" }}>Detalle del lugar del trabajo</Text>

                        <View style={{ width: "100%", alignItems: "center", marginBottom: 24 }}>
                            <AutoHeightImage
                                width={200}
                                style={{ borderRadius: 12 }}
                                source={{
                                    uri: request.$relations?.media[0]?.$attributes?.url,
                                }}
                            />
                        </View>

                        <View style={{ alignItems: "center", justifyContent: "center", width: "100%", marginBottom: 64 }}>
                            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Realizar Oferta", { request })}>
                                <Text style={{ color: "white", fontSize: 20 }}>Realizar Oferta</Text>
                            </TouchableOpacity>
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
        marginBottom: 24,
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
