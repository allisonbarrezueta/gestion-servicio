import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, FlatList, SafeAreaView, RefreshControl, ActivityIndicator } from "react-native";
import get from "lodash/get";
import { StackScreenProps } from "@react-navigation/stack";

/* Models */
import Bid from "./../models/Bid";

/* Types */
import { TabThreeParamList } from "./../types";

const OrderItem = ({ navigation, bid }: { navigation: any; bid: Bid }) => {
    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("Offer", { bid })}
            style={{
                borderWidth: 1,
                borderColor: "#99d1e0",
                borderRadius: 10,
                flexDirection: "column",
                paddingHorizontal: 12,
                marginBottom: 24,
                paddingVertical: 12,
            }}>
            <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 20, color: "#0d394e", fontWeight: "600" }}>
                    {bid.$relations.user.$attributes.company_name || "Sin Compañía"}
                </Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 22, color: "#0d394e", fontWeight: "600" }}>Precio $ {bid.$attributes.offer}</Text>
            </View>
        </TouchableOpacity>
    );
};

type Props = StackScreenProps<TabThreeParamList, "Offers">;

export default function OffersScreen({ navigation, route }: Props) {
    const [bids, setBids] = useState<Bid[]>([]);
    const [loading, setLoading] = useState(false);

    const getBids = async () => {
        setLoading(true);
        try {
            const results = await Bid.$query().filter("request_id", "=", route.params.request.$attributes.id).with(["user", "request"]).search();
            console.log("results", results);
            setBids(results);
        } catch (error) {
            console.log("error", error.response);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getBids();
    }, [route.params.request]);

    const serviceName = get(route, "params.request.$relations.service.$attributes.name", null);

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ width: "100%", flex: 1, paddingVertical: 22 }}>
                <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 18, color: "#4c5763" }}>Ofertas {serviceName}</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#99d1e0" />
                ) : (
                    <FlatList
                        style={{ width: "100%" }}
                        data={bids}
                        refreshControl={<RefreshControl refreshing={loading} onRefresh={getBids} />}
                        renderItem={({ item }: { item: Bid }) => <OrderItem bid={item} navigation={navigation} />}
                        keyExtractor={(item: Bid) => `${item.$attributes.id}`}
                    />
                )}
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
});
