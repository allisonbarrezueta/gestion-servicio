import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, ScrollView, Image, SafeAreaView, FlatList } from "react-native";
import { AirbnbRating } from "react-native-ratings";
import { StackScreenProps } from "@react-navigation/stack";
import { TabThreeParamList } from "./../types";
import get from "lodash/get";
// @ts-ignore
import UserAvatar from "react-native-user-avatar";
import Opinion from "../models/Opinion";
import dayjs from "dayjs";

const CommentItem = ({ opinion }: { opinion: Opinion }) => {
    return (
        <View
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
        </View>
    );
};

type Props = StackScreenProps<TabThreeParamList, "Detalle de Cliente">;

export default function ClientDetailScreen({ route }: Props) {
    const user = route.params.user;
    const [opinions, setOpinions] = useState<Opinion[]>([]);

    useEffect(() => {
        const getOpinions = async () => {
            try {
                const results = await Opinion.$query().with(["user"]).filter("supplier_id", "=", route.params.user.$attributes.id).search();
                console.log("results", results);

                setOpinions(results);
            } catch (error) {}
        };

        getOpinions();
    }, [route.params.user]);

    let rating = get(user, "$attributes.average_rating", 1);
    if (!rating) {
        rating = 1;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ width: "100%", flex: 1, paddingVertical: 22 }}>
                <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 18, color: "#4c5763" }}>Detalle de Cliente</Text>

                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    <Image style={{ width: 100, height: 100, marginBottom: 4 }} source={require("./../assets/images/user_icon.png")} />
                    <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 18, color: "#4c5763", textAlign: "center" }}>
                        {user.$attributes.name} {user.$attributes.last_name}
                    </Text>
                </View>

                <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8, color: "#47525d" }}>Correo</Text>
                <TextInput
                    placeholder="Descripción"
                    editable={false}
                    placeholderTextColor="#909eaf"
                    value={user.$attributes.email}
                    style={{ ...styles.input, marginBottom: 24 }}
                />

                <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8, color: "#47525d" }}>Calificación</Text>

                <AirbnbRating showRating={false} isDisabled={true} starContainerStyle={{ marginBottom: 32 }} defaultRating={rating} />

                <FlatList
                    style={{ width: "100%", marginBottom: 100 }}
                    data={opinions}
                    renderItem={({ item }: { item: Opinion }) => <CommentItem opinion={item} />}
                    keyExtractor={(item) => `${item.$attributes.id}`}
                />
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
