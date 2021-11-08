import React, { useState, useEffect, useContext } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput,
    ScrollView,
    Platform,
    Image,
    Dimensions,
    ActivityIndicator,
    KeyboardAvoidingView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { StackScreenProps } from "@react-navigation/stack";
import RNPickerSelect from "react-native-picker-select";
import get from "lodash/get";
import omit from "lodash/omit";
import UserContext from "../contexts/UserContext";
import Http from "../modules/Http";
import dayjs from "dayjs";
// @ts-ignore
import mime from "mime";
// @ts-ignore
import DatePicker from "react-native-datepicker";
import DateTimePicker, { Event } from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";

/* Models */
import Category from "./../models/Category";
import Service from "./../models/Service";

/* Types */
import { TabOneParamList, UserType } from "./../types";

/* Components */
import ErrorLabel from "./../components/ErrorLabel";

type AndroidMode = "date" | "time";

type Props = StackScreenProps<TabOneParamList, "Solicitar Servicio">;

function determineNewHeight(originalHeight: number, originalWidth: number, newWidth: number) {
    return (originalHeight / originalWidth) * newWidth;
}

export default function RequestServiceScreen({ route, navigation }: Props) {
    const [categoryId, setCategoryId] = useState<number>();
    const [serviceId, setServiceId] = useState<number | null>();
    const [categories, setCategories] = useState<Category[]>();
    const [services, setServices] = useState<Service[]>();
    const [date, setDate] = useState(dayjs());
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<ImagePicker.ImagePickerResult>();
    const [imageHeight, setImageHeight] = useState(150);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const [pickerMode, setPickerMode] = useState<AndroidMode | undefined>("date");
    const [loadingImage, setLoadingImage] = useState(false);
    const [loadingCategory, setLoadingCategory] = useState(false);
    const user: UserType = useContext(UserContext);

    useEffect(() => {
        if (user) {
            setAddress(user.address || "");
        }
    }, [user]);

    useEffect(() => {
        setCategoryId(route.params.category?.$attributes.id);
    }, [route.params.category]);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== "web") {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== "granted") {
                    console.log("NO PERMISSIONS.");
                }
            }
        })();
    }, []);

    useEffect(() => {
        const getCategories = async () => {
            setLoadingCategory(true);
            try {
                const results = await Category.$query().filter("status", "=", 1).search();
                setCategories(results);
            } catch (error) {
                console.log(error.response);
            } finally {
                setLoadingCategory(false);
            }
        };

        getCategories();
    }, [route.params.category]);

    useEffect(() => {
        const getServices = async () => {
            if (!categoryId) {
                return;
            }

            try {
                const results = await Service.$query().filter("category_id", "=", categoryId).search();
                setServiceId(results[0].$attributes.id);
                setServices(results);
            } catch (error) {}
        };

        getServices();
    }, [categoryId]);

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

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("user_id", String(user.id));
            formData.append("service_id", String(serviceId));
            formData.append("category_id", String(categoryId));
            formData.append("address", address);
            formData.append("description", description);
            formData.append("date", dayjs(date).format("YYYY-MM-DD HH:mm:ss"));

            // Upload image
            if (image && !image?.cancelled && image.uri) {
                let localUri = image.uri;
                let filename = localUri.split("/").pop();

                if (Platform.OS === "android") {
                    if (filename) {
                        const newImageUri = "file:///" + image.uri.split("file:/").join("");

                        formData.append("image", {
                            // @ts-ignore
                            uri: newImageUri,
                            type: mime.getType(newImageUri),
                            name: newImageUri.split("/").pop(),
                        });

                        // @ts-ignore
                        // formData.append("image", { uri: localUri, name: filename, imageType });
                    }
                } else {
                    if (filename) {
                        // Infer the type of the image
                        let match = /\.(\w+)$/.exec(filename);
                        let imageType = match ? `image/${match[1]}` : `image`;

                        // @ts-ignore
                        formData.append("image", { uri: localUri, name: filename, imageType });
                    }
                }
            }

            await Http.post("/requests", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setLoading(false);

            return navigation.reset({
                routes: [{ name: "Puja" }],
            });
        } catch (error) {
            console.log("error", error.message);
            console.log("error", get(error, "response.data", {}));

            const errors = get(error, "response.data.errors", {});
            setErrors(errors);
            setLoading(false);
        }
    };

    const handleDatePicker = (event: Event) => {
        setShowPicker(false);
        if (event.type === "set") {
            // @ts-ignore
            setDate(dayjs(event.nativeEvent.timestamp));
        }
    };

    const categoryOptions = categories?.map((category) => ({
        label: category.$attributes.name,
        value: category.$attributes.id,
    }));

    const serviceOptions = services?.map((service) => ({
        label: service.$attributes.name,
        value: service.$attributes.id,
    }));

    const category = categories?.find((category) => category.$attributes.id === categoryId);

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1, width: "100%" }}
                keyboardVerticalOffset={100}
                behavior={Platform.OS == "ios" ? "padding" : "height"}>
                <ScrollView style={{ width: "100%", flex: 1, paddingBottom: 22 }}>
                    {loadingCategory ? (
                        <ActivityIndicator size="small" style={{ marginBottom: 18 }} color="#909daf" />
                    ) : (
                        <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 18, color: "#4c5763" }}>{category?.$attributes.name}:</Text>
                    )}

                    {categoryOptions && (
                        <View style={{ marginBottom: 12 }}>
                            <RNPickerSelect
                                style={pickerSelectStyles}
                                useNativeAndroidPickerStyle={false}
                                placeholder={{
                                    label: "Categoría",
                                    value: null,
                                }}
                                value={categoryId}
                                Icon={() => {
                                    return (
                                        <View style={styles.icon}>
                                            <Icon name="chevron-down" size={24} color="#909daf" />
                                        </View>
                                    );
                                }}
                                onValueChange={(value: any) => {
                                    setCategoryId(value);
                                }}
                                items={categoryOptions}
                            />
                            <ErrorLabel errors={errors} name="category_id" />
                        </View>
                    )}

                    {serviceOptions && (
                        <View style={{ marginBottom: 12 }}>
                            <RNPickerSelect
                                style={pickerSelectStyles}
                                useNativeAndroidPickerStyle={false}
                                placeholder={{
                                    label: "Servicios Disponibles",
                                    value: null,
                                }}
                                value={serviceId}
                                Icon={() => {
                                    return (
                                        <View style={styles.icon}>
                                            <Icon name="chevron-down" size={24} color="#909daf" />
                                        </View>
                                    );
                                }}
                                onValueChange={(value: any) => {
                                    setServiceId(value);
                                }}
                                items={serviceOptions}
                            />
                            <ErrorLabel errors={errors} name="service_id" />
                        </View>
                    )}

                    <View style={{ marginBottom: 12 }}>
                        {showPicker && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date.toDate()}
                                mode={pickerMode}
                                minimumDate={new Date()}
                                is24Hour={true}
                                display="default"
                                onChange={handleDatePicker}
                            />
                        )}
                        {Platform.OS === "android" ? (
                            <View style={{ flexDirection: "row" }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setPickerMode("date");
                                        setShowPicker(true);
                                    }}
                                    style={{ ...styles.input, width: "60%", marginRight: 6, justifyContent: "center" }}>
                                    <Text style={{ fontSize: 18 }}>{dayjs(date).format("YYYY-MM-DD")}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        setPickerMode("time");
                                        setShowPicker(true);
                                    }}
                                    style={{ ...styles.input, flex: 1, justifyContent: "center" }}>
                                    <Text style={{ fontSize: 18 }}>{dayjs(date).format("HH:mm")}</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <DatePicker
                                style={{ width: "100%", height: 54, marginTop: 12 }}
                                date={date.toDate()}
                                mode="datetime"
                                showIcon={false}
                                placeholder="Fecha y hora que lo solicita"
                                format="YYYY-MM-DD HH:mm"
                                minDate={new Date()}
                                confirmBtnText="Confirmar"
                                cancelBtnText="Cancelar"
                                customStyles={datePickerStyles}
                                onDateChange={setDate}
                            />
                        )}
                        <ErrorLabel errors={errors} name="date" />
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <TextInput
                            placeholder="Dirección"
                            multiline={true}
                            value={address}
                            placeholderTextColor="#909eaf"
                            onChangeText={setAddress}
                            style={{ ...styles.input, paddingTop: 12, height: 100 }}
                        />
                        <ErrorLabel errors={errors} name="address" />
                    </View>

                    <View style={{ marginBottom: 32 }}>
                        <TextInput
                            placeholder="Descripción"
                            multiline={true}
                            placeholderTextColor="#909eaf"
                            onChangeText={setDescription}
                            style={{ ...styles.input, paddingTop: 12, height: 100 }}
                        />
                        <ErrorLabel errors={errors} name="description" />
                    </View>

                    <View style={{ marginBottom: 32 }}>
                        <TouchableOpacity
                            onPress={pickImage}
                            style={{
                                height: imageHeight,
                                backgroundColor: "#e6e8eb",
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

                    <View style={{ alignItems: "center", justifyContent: "center", width: "100%", marginBottom: 64 }}>
                        {loading ? (
                            <TouchableOpacity style={styles.button}>
                                <ActivityIndicator size="small" color="white" />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                <Text style={{ color: "white", fontSize: 20 }}>Solicitar Servicio</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
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
    icon: { height: 54, width: 54, alignItems: "center", justifyContent: "center" },
});

const pickerSelectStyles = StyleSheet.create({
    placeholder: {
        color: "#909daf",
    },
    inputIOS: {
        fontSize: 18,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 10,
        color: "black",
        borderColor: "#dce0e6",
        borderWidth: 1,
        height: 54,
        width: "100%",
        paddingRight: 54,
    },
    inputAndroid: {
        fontSize: 18,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 10,
        color: "black",
        borderColor: "#dce0e6",
        borderStyle: "solid",
        borderWidth: 1,
        height: 54,
        width: "100%",
        paddingRight: 54,
    },
});

const datePickerStyles = StyleSheet.create({
    dateInput: {
        borderColor: "#dce0e6",
        borderWidth: 1,
        height: 54,
        width: "100%",
        paddingHorizontal: 12,
        borderRadius: 10,
        alignItems: "flex-start",
    },
    dateText: {
        color: "black",
        fontSize: 18,
    },
    placeholderText: {
        fontSize: 18,
        color: "#909eaf",
    },
    btnTextConfirm: {
        color: "#909eaf",
    },
});
