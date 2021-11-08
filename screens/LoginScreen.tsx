import { StackScreenProps } from "@react-navigation/stack";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, TextInput, ActivityIndicator } from "react-native";
import get from "lodash/get";
import { CommonActions } from "@react-navigation/native";
import AuthContext from "./../contexts/AuthContext";

import { RootStackParamList } from "../types";

/* Components */
import ErrorLabel from "./../components/ErrorLabel";

export default function NotFoundScreen({ navigation }: StackScreenProps<RootStackParamList, "Login">) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { signIn } = React.useContext(AuthContext);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await signIn({ email, password });

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
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>

            <View style={styles.formGroup}>
                <TextInput placeholder="Email" onChangeText={setEmail} placeholderTextColor="#909eaf" style={styles.input} />
                <ErrorLabel errors={errors} name="email" />
            </View>

            <View style={styles.formGroup}>
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
                    <Text style={{ color: "white", fontSize: 20 }}>Iniciar Sesión</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Register")}>
                <Text style={{ color: "white", fontSize: 20 }}>Regístrate</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity style={{ marginTop: 12 }}>
                <Text style={{ color: "black", fontSize: 14 }}>Olvidó su contraseña?</Text>
            </TouchableOpacity> */}
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
    title: {
        fontSize: 28,
        fontWeight: "300",
        marginBottom: 32,
        color: "#828991",
    },
    formGroup: { marginBottom: 24, width: "100%" },
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
