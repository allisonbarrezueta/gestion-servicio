import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View, FlatList, SafeAreaView, ActivityIndicator } from "react-native";
import get from "lodash/get";
import { StackScreenProps } from "@react-navigation/stack";
import UserContext from "../contexts/UserContext";
import Icon from "react-native-vector-icons/Feather";

/* Models */
import Bid from "./../models/Bid";
import Request from "./../models/Request";

/* Types */
import { MyBidsParamsList, UserType } from "./../types";

const OrderItem = ({ navigation, bid, user, index, request }: { navigation: any; bid: Bid; user: UserType; index: number; request: Request }) => {
    return (
        <View
            style={{
                borderWidth: 1,
                borderColor: "#99d1e0",
                borderRadius: 10,
                flexDirection: "column",
                paddingHorizontal: 12,
                marginBottom: 24,
                position: "relative",
            }}>
            <View style={{ paddingVertical: 12 }}>
                <View style={{ marginBottom: 16 }}>
                    {bid.$attributes.user_id !== user.id ? (
                        <Text style={{ fontSize: 20, color: "#0d394e", fontWeight: "600" }}>Proveedor {index + 1}</Text>
                    ) : (
                        <Text style={{ fontSize: 20, color: "#0d394e", fontWeight: "600" }}>
                            {bid.$relations.user.$attributes.company_name || "Sin Compañía"}
                        </Text>
                    )}
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontSize: 22, color: "#0d394e", fontWeight: "600" }}>Precio $ {bid.$attributes.offer}</Text>
                </View>
            </View>

            {bid.$attributes.user_id === user.id && (
                <TouchableOpacity
                    onPress={() => navigation.navigate("EditOffer", { bid, request })}
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute",
                        height: "100%",
                        width: 100,
                        right: 0,
                        top: 0,
                    }}>
                    <Icon name="edit" size={24} color="#909daf" />
                </TouchableOpacity>
            )}
        </View>
    );
};

type Props = StackScreenProps<MyBidsParamsList, "ActiveOffer">;

export default function ActiveOfferScreen({ navigation, route }: Props) {
    const [bids, setBids] = useState<Bid[]>([]);
    const user: UserType = useContext(UserContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getBids = async () => {
            setLoading(true);
            try {
                const results = await Bid.$query().filter("request_id", "=", route.params.request.$attributes.id).with(["user"]).search();
                setBids(results);
            } catch (error) {
                console.log("error", error.response);
            } finally {
                setLoading(false);
            }
        };

        getBids();
    }, [route.params.request]);

    const serviceName = get(route, "params.request.$relations.service.$attributes.name", null);

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ width: "100%", flex: 1, paddingVertical: 22 }}>
                <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 18, color: "#4c5763" }}>{serviceName}</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#99d1e0" />
                ) : (
                    <FlatList
                        style={{ width: "100%" }}
                        data={bids}
                        renderItem={({ item, index }: { item: Bid; index: number }) => (
                            <OrderItem bid={item} index={index} user={user} request={route.params.request} navigation={navigation} />
                        )}
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
