import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image, SafeAreaView, ActivityIndicator, ScrollView } from "react-native";
import { Rating } from "react-native-ratings";
import { StackScreenProps } from "@react-navigation/stack";
import dayjs from "dayjs";
import get from "lodash/get";
import first from "lodash/first";
import UserContext from "../contexts/UserContext";
import Http from "../modules/Http";

/* Models */
import Request from "./../models/Request";
import Opinion from "./../models/Opinion";
import Bid from "./../models/Bid";

/* Types */
import { TabTwoParamList, UserType } from "./../types";

/* Components */
import ErrorLabel from "./../components/ErrorLabel";
import isEmpty from "lodash/isEmpty";

const OrderItem = ({ request }: { request: Request }) => {
    const date = dayjs(request.$attributes.date);

    return (
        <TouchableOpacity
            style={{
                borderWidth: 1,
                borderColor: "#99d1e0",
                borderRadius: 10,
                flexDirection: "row",
                paddingHorizontal: 12,
                marginBottom: 12,
                paddingVertical: 12,
            }}>
            <View style={{ flex: 1, marginRight: 10 }}>
                <View style={{ marginBottom: 8 }}>
                    <Text style={{ fontSize: 16, color: "#0d394e", fontWeight: "600" }}>{request.$relations.category.$attributes.name}</Text>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <Text style={{ fontSize: 16, color: "#0d394e", fontWeight: "600" }}>{request.$relations.service.$attributes.name}</Text>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <Text style={{ fontSize: 16, color: "#0d394e", fontWeight: "600" }}>{date.format("YYYY-MM-DD HH[h]mm")}</Text>
                </View>
            </View>

            <Image
                style={{ width: 90, height: 125 }}
                source={{
                    uri: "https://conceptodefinicion.de/wp-content/uploads/2015/05/jardineria-.jpg",
                }}
            />
        </TouchableOpacity>
    );
};

type Props = StackScreenProps<TabTwoParamList, "Service">;

export default function ServiceScreen({ route, navigation }: Props) {
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [errors, setErrors] = useState({});
    const [opinion, setOpinion] = useState<Opinion>();
    const user: UserType = useContext(UserContext);
    const request = route.params.request;

    useEffect(() => {
        const getOpinion = async () => {
            try {
                const opinions = await Opinion.$query().filter("user_id", "=", user.id).filter("request_id", "=", request.$attributes.id).search();
                const opinion = first(opinions);

                if (opinion) {
                    setOpinion(opinion);
                    setRating(opinion.$attributes.rating);
                    setComment(opinion.$attributes.comment);
                }
            } catch (error) {
                console.log(error.response);
            }
        };

        if (!isEmpty(user)) {
            getOpinion();
        }
    }, [user, request]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const bids = await Bid.$query()
                .filter("status", "=", "accepted")
                .with(["user"])
                .filter("request_id", "=", request.$attributes.id)
                .search();
            const bid = first(bids);

            await Http.post("/opinions", {
                user_id: user.id,
                supplier_id: bid?.$relations.user.$attributes.id,
                request_id: request.$attributes.id,
                comment,
                rating,
                status: true,
            });

            setLoading(false);

            return navigation.navigate("History");
        } catch (error) {
            console.log("error", error.response);

            const errors = get(error, "response.data.errors", {});
            setErrors(errors);
            setLoading(false);
        }
    };

    const alreadyHasAnOpinion = !!opinion;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ width: "100%", flex: 1, paddingTop: 22, paddingBottom: 44 }}>
                <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 18, color: "#4c5763" }}>Añadir Califación</Text>
                <OrderItem request={route.params.request} />

                <View style={{ marginBottom: 20 }}>
                    <TextInput
                        value={comment}
                        multiline={true}
                        numberOfLines={4}
                        editable={!alreadyHasAnOpinion}
                        placeholder="Descripción"
                        onChangeText={setComment}
                        placeholderTextColor="#bfc5cc"
                        style={{
                            borderWidth: 1,
                            borderColor: "#cdd1d6",
                            borderRadius: 10,
                            height: 150,
                            paddingHorizontal: 12,
                            fontSize: 18,
                            paddingTop: 12,
                        }}
                    />
                    <ErrorLabel errors={errors} name="comment" />
                </View>

                <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 24, color: "#4c5763" }}>Califica el Servicio</Text>

                <View style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <View style={{ marginBottom: 32 }}>
                        <Rating showRating={false} readonly={alreadyHasAnOpinion} onFinishRating={setRating} startingValue={rating} />
                        <ErrorLabel errors={errors} name="rating" />
                    </View>

                    {loading && (
                        <TouchableOpacity style={styles.button}>
                            <ActivityIndicator size="small" color="white" />
                        </TouchableOpacity>
                    )}

                    {!loading && !alreadyHasAnOpinion && (
                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={{ color: "white", fontSize: 20 }}>Enviar Opinión</Text>
                        </TouchableOpacity>
                    )}
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
