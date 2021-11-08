import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, FlatList, SafeAreaView, RefreshControl } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import UserContext from "../contexts/UserContext";
import isEmpty from "lodash/isEmpty";
import first from "lodash/first";
import dayjs from "dayjs";

/* Models */
import Bid from "./../models/Bid";
import Request from "./../models/Request";

/* Types */
import { UserType } from "./../types";

const OrderItem = ({
    navigation,
    request,
    user,
    handleDeleteBid,
}: {
    request: Request;
    navigation: any;
    user: UserType;
    handleDeleteBid: (bid: Bid) => void;
}) => {
    const [bid, setBid] = useState<Bid | null>();
    const date = dayjs(request.$attributes.date);

    useEffect(() => {
        const getBid = async () => {
            try {
                const bids = await Bid.$query()
                    .filter("request_id", "=", request.$attributes.id)
                    .filter("user_id", "=", user.id)
                    .with(["user"])
                    .search();
                setBid(first(bids));
            } catch (error) {
                console.log("error", error.response);
            }
        };

        getBid();
    }, [request]);

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("ActiveOffer", { request })}
            style={{
                borderWidth: 1,
                borderColor: "#99d1e0",
                borderRadius: 10,
                flexDirection: "column",
                paddingHorizontal: 12,
                marginBottom: 12,
                paddingVertical: 12,
            }}>
            <View style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 16, color: "#0d394e", fontWeight: "600" }}>{request.$relations.category.$attributes.name}</Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <Text style={{ fontSize: 16, color: "#0d394e", fontWeight: "600" }}>{request.$relations.service.$attributes.name}</Text>
                <View style={{ flexDirection: "row" }}>
                    {bid && (
                        <TouchableOpacity style={{ marginRight: 16 }} onPress={() => handleDeleteBid(bid)}>
                            <Icon name="trash" size={28} color="#40667f" />
                        </TouchableOpacity>
                    )}
                    <Icon name="chevron-right" size={28} color="#40667f" />
                </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 16, color: "#0d394e", fontWeight: "600" }}>{date.format("YYYY-MM-DD HH[h]mm")}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default function ActiveOffersScreen({ navigation }: any) {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(false);
    const user: UserType = useContext(UserContext);

    const getRequests = async () => {
        setLoading(true);
        try {
            const results = await Request.$query()
                .filter("status", "=", "pending")
                .scope("withActiveOffer", [user.id])
                .with(["service", "category"])
                .search();

            setRequests(results);
        } catch (error) {
            console.error(error.message);
            console.error(error.response);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isEmpty(user)) {
            getRequests();
        }
    }, [user]);

    const handleDeleteBid = async (bid: Bid) => {
        try {
            await bid.$destroy(true);

            getRequests();
        } catch (error) {}
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ width: "100%", flex: 1, paddingVertical: 22 }}>
                <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 18, color: "#4c5763" }}>Ofertas Activas</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#99d1e0" />
                ) : (
                    <FlatList
                        style={{ width: "100%" }}
                        data={requests}
                        refreshControl={<RefreshControl refreshing={loading} onRefresh={getRequests} />}
                        renderItem={({ item }: { item: Request }) => (
                            <OrderItem handleDeleteBid={handleDeleteBid} request={item} user={user} navigation={navigation} />
                        )}
                        keyExtractor={(item: Request) => `${item.$attributes.id}`}
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
