import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, FlatList, SafeAreaView } from "react-native";
import { AirbnbRating } from "react-native-ratings";
import Opinion from "../models/Opinion";
import { StackScreenProps } from "@react-navigation/stack";
import { TabThreeParamList } from "./../types";
import dayjs from "dayjs";
// @ts-ignore
import UserAvatar from "react-native-user-avatar";

type Props = StackScreenProps<TabThreeParamList, "Comments">;

const OrderItem = ({ navigation, opinion }: { navigation: any; opinion: Opinion }) => {
    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("Offers")}
            style={{
                flexDirection: "column",
                paddingVertical: 24,
                borderBottomColor: "#b5b6b7",
                borderBottomWidth: 1,
            }}>
            <View style={{ marginBottom: 8, flexDirection: "row", alignItems: "center" }}>
                <View style={{ marginRight: 12 }}>
                    <UserAvatar size={32} name={opinion.$relations.user.$attributes.name} />
                </View>
                <Text style={{ fontSize: 18, color: "#0d394e", fontWeight: "600" }}>{opinion.$relations?.user?.$attributes?.name}</Text>
            </View>

            <View style={{ alignItems: "center", flexDirection: "row", marginBottom: 6 }}>
                <AirbnbRating showRating={false} size={16} starContainerStyle={{ marginRight: 6 }} defaultRating={opinion.$attributes.rating} />
                <Text style={{ color: "#b5b6b7" }}>{dayjs(opinion.$attributes.created_at).format("DD/MM/YY")}</Text>
            </View>

            <Text style={{ color: "#b5b6b7", fontSize: 16, lineHeight: 22 }}>{opinion.$attributes.comment}</Text>
        </TouchableOpacity>
    );
};

export default function CommentsScreen({ route, navigation }: Props) {
    const [opinions, setOpinions] = useState<Opinion[]>([]);

    useEffect(() => {
        const getOpinions = async () => {
            try {
                const results = await Opinion.$query().with(["user"]).filter("supplier_id", "=", route.params.user.$attributes.id).search();
                setOpinions(results);
            } catch (error) {}
        };

        getOpinions();
    }, [route.params.user]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ width: "100%", flex: 1 }}>
                <FlatList
                    style={{ width: "100%" }}
                    data={opinions}
                    renderItem={({ item }: { item: Opinion }) => <OrderItem opinion={item} navigation={navigation} />}
                    keyExtractor={(item) => `${item.$attributes.id}`}
                />
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
