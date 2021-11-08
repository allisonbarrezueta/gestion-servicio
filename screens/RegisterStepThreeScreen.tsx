import { StackScreenProps } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import get from "lodash/get";
import compact from "lodash/compact";
import axios from "axios";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { CommonActions } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import Modal from "react-native-modal";

// import { v4 as uuidv4 } from "uuid";
import Icon from "react-native-vector-icons/Feather";
import AuthContext from "./../contexts/AuthContext";

import { RootStackParamList } from "../types";

/* Models */
import Category from "./../models/Category";
import includes from "lodash/includes";
import RoundedHeader from "../components/RoundedHeader";

type SelectedService = {
    id: number;
    category: Category | null;
};

export default function RegisterStepThreeScreen({ navigation, route }: StackScreenProps<RootStackParamList, "RegisterStepThree">) {
    const [errors, setErrors] = useState({});
    const { signUp } = React.useContext(AuthContext);
    const [loadingServices, setLoadingServices] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<SelectedService[]>([
        {
            id: 1,
            category: null,
        },
    ]);

    useEffect(() => {
        const getServices = async () => {
            setLoadingServices(true);
            try {
                const results = await Category.$query().filter("status", "=", 1).search();
                setCategories(results);
            } catch (error) {
                console.log(error.response.data);
            } finally {
                setLoadingServices(false);
            }
        };

        getServices();
    }, [route.params]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post("https://gestion.ajmariduena.com/api/v1/register", {
                email: route.params.email,
                password: route.params.password,
                name: route.params.name,
                last_name: route.params.last_name,
                dni: route.params.dni,
                type: "supplier",
                ruc: route.params.ruc,
                dni_image: route.params.dniImage,
                ruc_image: route.params.rucImage,
                device_name: Device.modelName,
                categories: compact(selectedCategories.map((item) => item.category?.$attributes.id)),
            });

            const { token } = data;
            await AsyncStorage.setItem("@bearerToken", token);

            await signUp({ token });

            setLoading(false);
            setShowModal(true);
        } catch (error) {
            const errors = get(error, "response.data.errors", {});
            setErrors(errors);
            setLoading(false);
        }
    };

    const handleAccept = () => {
        setShowModal(false);
        return navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [{ name: "Root" }],
            })
        );
    };

    const setServiceId = (id: number, categoryId: number) => {
        setSelectedCategories(
            selectedCategories.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        category: categories.find((category) => category.$attributes.id === categoryId) || null,
                    };
                }

                return item;
            })
        );
    };

    const addMore = (index: number) => {
        setSelectedCategories([...selectedCategories, { id: index + 1, category: null }]);
    };

    const selectedIds = selectedCategories.map((service) => {
        return service.id;
    });
    const serviceOptions = categories
        ?.map((category) => ({
            label: category.$attributes.name,
            value: category.$attributes.id,
        }))
        .filter((category) => {
            return !includes(category.value, selectedIds);
        });

    return (
        <View style={styles.container}>
            <RoundedHeader text="Registro" />

            <Modal isVisible={showModal} backdropOpacity={0.1} backdropColor="black">
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={{ fontSize: 24, textAlign: "center", fontWeight: "600", marginBottom: 12 }}>Registro Exitoso</Text>
                        <Text style={{ fontWeight: "500", fontSize: 18, marginBottom: 26 }}>
                            Estamos validando tu información, pronto serás parte de nuestra plataforma
                        </Text>
                        <TouchableOpacity onPress={handleAccept} style={{ ...styles.button, marginBottom: 0 }}>
                            <Text style={{ color: "white", fontSize: 20 }}>Aceptar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <KeyboardAvoidingView
                style={{ flex: 1, width: "100%", paddingTop: 44 }}
                keyboardVerticalOffset={100}
                behavior={Platform.OS == "ios" ? "padding" : "height"}>
                <ScrollView bounces={true}>
                    {loadingServices ? (
                        <View style={{ marginBottom: 44 }}>
                            <ActivityIndicator size="small" color="#909daf" />
                        </View>
                    ) : (
                        selectedCategories.map(({ id, service }: { id: number; service: Category | null }, index: number) => (
                            <View style={{ marginBottom: 22, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }} key={id}>
                                <View style={{ flex: 1, marginRight: 12 }}>
                                    <RNPickerSelect
                                        style={pickerSelectStyles}
                                        placeholder={{
                                            label: "Servicios Disponibles",
                                            value: null,
                                        }}
                                        value={service?.$attributes.id}
                                        Icon={() => {
                                            return (
                                                <View style={styles.icon}>
                                                    <Icon name="chevron-down" size={24} color="#909daf" />
                                                </View>
                                            );
                                        }}
                                        onValueChange={(value: number) => {
                                            setServiceId(id, value);
                                        }}
                                        items={serviceOptions}
                                    />
                                </View>
                                <TouchableOpacity style={styles.iconRounded} onPress={() => addMore(index + 1)}>
                                    <Icon name="plus" size={24} color="#2b5069" />
                                </TouchableOpacity>
                            </View>
                        ))
                    )}

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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        paddingHorizontal: 12,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        borderColor: "black",
        borderWidth: 1,
        padding: 35,
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        elevation: 5,
        width: "100%",
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
    icon: { height: 54, width: 54, alignItems: "center", justifyContent: "center" },
    iconRounded: { height: 44, width: 44, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#2b5069", borderRadius: 999 },
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
        flex: 1,
        paddingRight: 54,
    },
    inputAndroid: {
        fontSize: 18,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 10,
        color: "black",
        borderColor: "#dce0e6",
        borderWidth: 1,
        height: 54,
        width: "100%",
        flex: 1,
        paddingRight: 54,
    },
});
