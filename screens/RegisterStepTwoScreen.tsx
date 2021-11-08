import { StackScreenProps } from "@react-navigation/stack";
import React, { useState } from "react";
import get from "lodash/get";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput,
    Image,
    ActivityIndicator,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/Feather";
import mime from "mime";

import { RootStackParamList } from "../types";

/* Components */
import ErrorLabel from "../components/ErrorLabel";
import Http from "../modules/Http";
import RoundedHeader from "../components/RoundedHeader";
import axios from "axios";

export default function RegisterStepTwoScreen({ navigation, route }: StackScreenProps<RootStackParamList, "RegisterStepTwo">) {
    const [ruc, setRuc] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [dniImage, setDniImage] = useState("");
    const [rucImage, setRucImage] = useState("");
    const [loadingRucImage, setLoadingRucImage] = useState(false);
    const [loadingDniImage, setLoadingDniImage] = useState(false);

    const handleSubmit = async () => {
        try {
            await axios.post("https://gestion.ajmariduena.com/api/v1/register/validate", {
                step: "2",
                ruc_image: rucImage,
                dni_image: dniImage,
                ruc,
            });

            return navigation.navigate("RegisterStepThree", {
                email: route.params.email,
                password: route.params.password,
                name: route.params.name,
                last_name: route.params.last_name,
                dni: route.params.dni,
                type: "supplier",
                ruc,
                dniImage,
                rucImage,
            });
        } catch (error) {
            const errors = get(error, "response.data.errors", {});
            setErrors(errors);
            setLoading(false);
        }
    };

    const pickImage = async (type: string) => {
        try {
            if (type === "ruc_image") {
                setLoadingRucImage(true);
            } else {
                setLoadingDniImage(true);
            }

            const result: any = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                quality: 0.5,
            });

            if (!result.cancelled) {
                // Upload image
                let localUri = result.uri;
                let filename = localUri.split("/").pop();

                // Infer the type of the image
                let match = /\.(\w+)$/.exec(filename);
                let imageType = match ? `image/${match[1]}` : `image`;

                const formData = new FormData();

                if (Platform.OS === "android") {
                    const newImageUri = "file:///" + result.uri.split("file:/").join("");

                    formData.append("image", {
                        // @ts-ignore
                        uri: newImageUri,
                        type: mime.getType(newImageUri),
                        name: newImageUri.split("/").pop(),
                    });
                } else {
                    formData.append("image", { uri: localUri, name: filename, imageType });
                }

                const { data }: any = await Http.post("/upload", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (type === "dni_image") {
                    setDniImage(data.path);
                }

                if (type === "ruc_image") {
                    setRucImage(data.path);
                }
            }
        } catch (error) {
            console.log(error.response.data);
        } finally {
            if (type === "ruc_image") {
                setLoadingRucImage(false);
            } else {
                setLoadingDniImage(false);
            }
        }
    };

    return (
        <View style={styles.container}>
            <RoundedHeader text="Registro" />
            <KeyboardAvoidingView style={{ flex: 1, width: "100%", paddingTop: 44 }} behavior={Platform.OS == "ios" ? "padding" : "height"}>
                <ScrollView bounces={true}>
                    <Text style={{ fontSize: 18, color: "#96a1b3", marginBottom: 12 }}>Foto de Cédula</Text>
                    <View style={{ marginBottom: 32 }}>
                        <TouchableOpacity
                            onPress={() => pickImage("dni_image")}
                            style={{
                                height: 150,
                                borderWidth: 1,
                                borderColor: "#e6e8eb",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden",
                            }}>
                            {dniImage ? (
                                <Image
                                    style={{ width: "100%", height: 149 }}
                                    source={{
                                        uri: `https://gestion.ajmariduena.com/storage/${dniImage}`,
                                    }}
                                />
                            ) : loadingDniImage ? (
                                <ActivityIndicator size="small" color="#40667f" />
                            ) : (
                                <Icon name="image" size={44} color="#40667f" />
                            )}
                        </TouchableOpacity>
                        <ErrorLabel errors={errors} name="dni_image" />
                    </View>

                    <Text style={{ fontSize: 18, color: "#96a1b3", marginBottom: 12 }}>Documento del proveedor</Text>
                    <View style={{ marginBottom: 32 }}>
                        <TextInput placeholder="RUC" placeholderTextColor="#909eaf" onChangeText={setRuc} style={styles.input} />
                        <ErrorLabel errors={errors} name="ruc" />
                    </View>

                    <View style={{ marginBottom: 32 }}>
                        <TouchableOpacity
                            onPress={() => pickImage("ruc_image")}
                            style={{
                                height: 150,
                                borderWidth: 1,
                                borderColor: "#e6e8eb",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden",
                            }}>
                            {rucImage ? (
                                <Image
                                    style={{ width: "100%", height: 149 }}
                                    source={{
                                        uri: `https://gestion.ajmariduena.com/storage/${rucImage}`,
                                    }}
                                />
                            ) : loadingRucImage ? (
                                <ActivityIndicator size="small" color="#40667f" />
                            ) : (
                                <Icon name="image" size={44} color="#40667f" />
                            )}
                        </TouchableOpacity>
                        <ErrorLabel errors={errors} name="ruc_image" />
                    </View>

                    {loading ? (
                        <TouchableOpacity style={styles.button}>
                            <ActivityIndicator size="small" color="white" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={{ color: "white", fontSize: 20 }}>Siguiente</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 42,
    },
    formGroup: { marginBottom: 16, width: "100%" },
    title: {
        fontSize: 28,
        fontWeight: "300",
        marginBottom: 32,
        color: "#828991",
    },
    input: {
        borderColor: "#dce0e6",
        borderWidth: 1,
        height: 54,
        width: "100%",
        color: "black",
        paddingHorizontal: 12,
        fontSize: 18,
    },
    button: {
        height: 54,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#023047",
        borderRadius: 10,
        marginBottom: 20,
    },
});
