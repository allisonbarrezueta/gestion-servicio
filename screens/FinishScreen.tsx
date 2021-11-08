import React, { useState, useContext } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput,
    Image,
    SafeAreaView,
    ActivityIndicator,
    ScrollView,
    Dimensions,
    Platform,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import dayjs from "dayjs";
import get from "lodash/get";
import omit from "lodash/omit";
import Http from "../modules/Http";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/Feather";
import mime from "mime";
import { AirbnbRating } from "react-native-ratings";
import UserContext from "../contexts/UserContext";

/* Models */
import Request from "./../models/Request";

/* Types */
import { TabTwoParamList, UserType } from "./../types";

/* Components */
import ErrorLabel from "./../components/ErrorLabel";

const OrderItem = ({ request }: { request: Request }) => {
    const date = dayjs(request.$attributes.date);

    return (
        <View
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
        </View>
    );
};

function determineNewHeight(originalHeight: number, originalWidth: number, newWidth: number) {
    return (originalHeight / originalWidth) * newWidth;
}

type Props = StackScreenProps<TabTwoParamList, "Service">;

export default function FinishScreen({ route, navigation }: Props) {
    const [comment, setComment] = useState("");
    const request = route.params.request;
    const [image, setImage] = useState<ImagePicker.ImagePickerResult>();
    const [imageHeight, setImageHeight] = useState(100);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingImage, setLoadingImage] = useState(false);
    const [rating, setRating] = useState(1);
    const user: UserType = useContext(UserContext);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("comment", comment);
            formData.append("status", "completed");
            formData.append("_method", "PATCH");

            // Upload image
            if (image && !image?.cancelled && image.uri) {
                let localUri = image.uri;
                let filename = localUri.split("/").pop();

                if (Platform.OS === "android") {
                    if (filename) {
                        const newImageUri = "file:///" + image.uri.split("file:/").join("");

                        formData.append("evidence", {
                            // @ts-ignore
                            uri: newImageUri,
                            type: mime.getType(newImageUri),
                            name: newImageUri.split("/").pop(),
                        });
                    }
                } else {
                    if (filename) {
                        // Infer the type of the image
                        let match = /\.(\w+)$/.exec(filename);
                        let imageType = match ? `image/${match[1]}` : `image`;

                        // @ts-ignore
                        formData.append("evidence", { uri: localUri, name: filename, imageType });
                    }
                }
            }

            await Http.post(`/requests/${request.$attributes.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // Create opinion for client
            await Http.post("/opinions", {
                user_id: user.id,
                supplier_id: request.$attributes.user_id,
                request_id: request.$attributes.id,
                comment,
                rating,
                status: true,
            });

            setLoading(false);

            return navigation.reset({
                routes: [{ name: "Por Realizar" }],
            });
        } catch (error) {
            console.log("error", error.response);

            const errors = get(error, "response.data.errors", {});
            setErrors(errors);
            setLoading(false);
        }
    };

    const pickImage = async () => {
        setLoadingImage(true);
        const result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 0.5,
        });

        if (!result.cancelled) {
            setImage(result);
            const windowWidth = Dimensions.get("window").width - 44;
            const height = determineNewHeight(result.height, result.width, windowWidth);
            setImageHeight(height);
            setErrors(omit(errors, "image"));
            setLoadingImage(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ width: "100%", flex: 1, paddingTop: 22, paddingBottom: 44 }}>
                <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 18, color: "#4c5763" }}>Finalizar Servicio</Text>
                <OrderItem request={route.params.request} />

                <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 18, color: "#4c5763" }}>Califica al cliente</Text>

                <AirbnbRating showRating={false} onFinishRating={setRating} starContainerStyle={{ marginBottom: 32 }} defaultRating={rating} />

                <View style={{ marginBottom: 20 }}>
                    <TextInput
                        value={comment}
                        multiline={true}
                        numberOfLines={4}
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

                <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 18, color: "#4c5763" }}>Evidencia del trabajo realizado</Text>

                <View style={{ marginBottom: 32 }}>
                    <TouchableOpacity
                        onPress={pickImage}
                        style={{
                            height: imageHeight,
                            borderWidth: 1,
                            borderColor: "#cdd1d6",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 10,
                        }}>
                        {image ? (
                            <Image
                                style={{ width: "100%", height: imageHeight, borderRadius: 10 }}
                                source={{
                                    uri: image.uri,
                                }}
                            />
                        ) : loadingImage ? (
                            <ActivityIndicator size="small" color="#40667f" />
                        ) : (
                            <Icon name="image" size={44} color="#40667f" />
                        )}
                        <ErrorLabel errors={errors} name="image" />
                    </TouchableOpacity>
                </View>

                <View style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 100 }}>
                    {loading && (
                        <TouchableOpacity style={styles.button}>
                            <ActivityIndicator size="small" color="white" />
                        </TouchableOpacity>
                    )}

                    {!loading && (
                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={{ color: "white", fontSize: 20 }}>Finalizar</Text>
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
