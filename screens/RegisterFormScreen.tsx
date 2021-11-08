import { StackScreenProps } from "@react-navigation/stack";
import React, { useState } from "react";
import get from "lodash/get";
import axios from "axios";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, Text, TouchableOpacity, View, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { CommonActions } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AuthContext from "./../contexts/AuthContext";

import { RootStackParamList } from "../types";

/* Components */
import ErrorLabel from "../components/ErrorLabel";
import RoundedHeader from "../components/RoundedHeader";

export default function NotFoundScreen({ navigation, route }: StackScreenProps<RootStackParamList, "Login">) {
    const type = get(route, "params.type", "client");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [dni, setDni] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { signUp } = React.useContext(AuthContext);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (type === "supplier") {
                await axios.post("https://gestion.ajmariduena.com/api/v1/register/validate", {
                    step: "1",
                    email,
                    password,
                    name,
                    last_name: lastname,
                    dni,
                });

                setErrors({});
                setLoading(false);

                return navigation.navigate("RegisterStepTwo", {
                    email,
                    password,
                    name,
                    last_name: lastname,
                    dni,
                    type,
                });
            }

            const { data } = await axios.post("https://gestion.ajmariduena.com/api/v1/register", {
                email,
                password,
                name,
                last_name: lastname,
                dni,
                type,
                device_name: Device.modelName,
            });

            const { token } = data;
            await AsyncStorage.setItem("@bearerToken", token);
            setLoading(false);
            await signUp({ token });

            return navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [{ name: "Root" }],
                })
            );
        } catch (error) {
            const errors = get(error, "response.data.errors", {});
            setErrors(errors);
            setLoading(false);
        }
    };

    return (
        <KeyboardAwareScrollView contentContainerStyle={{ flex: 1, backgroundColor: "white" }} bounces={false}>
            <RoundedHeader text="Regístrate!" />
            <ScrollView style={styles.container} contentContainerStyle={{ flex: 1, justifyContent: "center" }} bounces={false}>
                <View style={styles.formGroup}>
                    <TextInput placeholder="Nombres" onChangeText={setName} placeholderTextColor="#909eaf" style={styles.input} />
                    <ErrorLabel errors={errors} name="name" />
                </View>

                <View style={styles.formGroup}>
                    <TextInput placeholder="Apellidos" onChangeText={setLastname} placeholderTextColor="#909eaf" style={styles.input} />
                    <ErrorLabel errors={errors} name="last_name" />
                </View>

                <View style={styles.formGroup}>
                    <TextInput placeholder="Cédula" onChangeText={setDni} placeholderTextColor="#909eaf" style={styles.input} />
                    <ErrorLabel errors={errors} name="dni" />
                </View>

                <View style={styles.formGroup}>
                    <TextInput placeholder="Correo" onChangeText={setEmail} placeholderTextColor="#909eaf" style={styles.input} />
                    <ErrorLabel errors={errors} name="email" />
                </View>

                <View style={{ ...styles.formGroup, marginBottom: 22 }}>
                    <TextInput
                        placeholder="Contraseña"
                        onChangeText={setPassword}
                        placeholderTextColor="#909eaf"
                        style={styles.input}
                        secureTextEntry={true}
                    />
                    <ErrorLabel errors={errors} name="password" />
                </View>

                {loading ? (
                    <TouchableOpacity style={styles.button}>
                        <ActivityIndicator size="small" color="white" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={{ color: "white", fontSize: 20 }}>Crear cuenta</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
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
