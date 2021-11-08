import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useContext, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, TextInput, ActivityIndicator, ScrollView } from "react-native";
import UserContext from "./../contexts/UserContext";
import get from "lodash/get";
import { RootStackParamList } from "../types";
import Http from "../modules/Http";
import AuthContext from "./../contexts/AuthContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

/* Types */
import { UserType } from "./../types";

/* Components */
import ErrorLabel from "./../components/ErrorLabel";

export default function ProfileScreen({ navigation }: StackScreenProps<RootStackParamList, "Login">) {
    const user: UserType = useContext(UserContext);
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [phone, setPhone] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { updateUser } = React.useContext(AuthContext);

    useEffect(() => {
        setName(user.name);
        setLastName(user.last_name);
        setEmail(user.email);
        setPhone(user.phone);
        if (user.address) {
            setAddress(user.address);
        }
        if (user.company_name) {
            setCompanyName(user.company_name);
        }
        if (user.company_description) {
            setDescription(user.company_description);
        }
    }, [user]);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Configuración de Mi Perfil",
        });
    }, []);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await Http.post("/profile", {
                name,
                last_name: lastName,
                email,
                phone,
                address,
                company_name: companyName,
                company_description: description,
            });
            setErrors({});

            await updateUser();

            return navigation.reset({
                routes: [{ name: "Inicio" }],
            });
        } catch (error) {
            const errors = get(error, "response.data.errors", {});
            setErrors(errors);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAwareScrollView style={{ backgroundColor: "white" }}>
            <ScrollView style={styles.container}>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Nombres</Text>
                    <View style={{ marginBottom: 24, flex: 1 }}>
                        <TextInput placeholder="Nombres" value={name} onChangeText={setName} placeholderTextColor="#909eaf" style={styles.input} />
                        <ErrorLabel errors={errors} name="name" />
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Apellidos</Text>
                    <View style={{ marginBottom: 24, flex: 1 }}>
                        <TextInput
                            placeholder="Nombres"
                            value={lastName}
                            onChangeText={setLastName}
                            placeholderTextColor="#909eaf"
                            style={styles.input}
                        />
                        <ErrorLabel errors={errors} name="last_name" />
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Correo</Text>
                    <View style={{ marginBottom: 24, flex: 1 }}>
                        <TextInput placeholder="Email" value={email} onChangeText={setEmail} placeholderTextColor="#909eaf" style={styles.input} />
                    </View>
                </View>

                {user.type === "supplier" && (
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Nombre Empresa</Text>
                        <View style={{ marginBottom: 24, flex: 1 }}>
                            <TextInput
                                placeholder="Compañía"
                                value={companyName}
                                onChangeText={setCompanyName}
                                placeholderTextColor="#909eaf"
                                style={styles.input}
                            />
                        </View>
                    </View>
                )}

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Teléfono</Text>
                    <View style={{ marginBottom: 24, flex: 1 }}>
                        <TextInput placeholder="Teléfono" value={phone} onChangeText={setPhone} placeholderTextColor="#909eaf" style={styles.input} />
                        <ErrorLabel errors={errors} name="phone" />
                    </View>
                </View>

                <View style={{ ...styles.formGroup, alignItems: "flex-start" }}>
                    <Text style={styles.label}>Dirección</Text>
                    <View style={{ marginBottom: 24, flex: 1, height: 150 }}>
                        <TextInput
                            placeholder="Dirección"
                            value={address}
                            onChangeText={setAddress}
                            multiline={true}
                            placeholderTextColor="#909eaf"
                            style={{ ...styles.input, height: 150, paddingTop: 12 }}
                        />
                        <ErrorLabel errors={errors} name="address" />
                    </View>
                </View>

                {user.type === "supplier" && (
                    <View style={{ ...styles.formGroup, alignItems: "flex-start" }}>
                        <Text style={styles.label}>Descripción</Text>
                        <View style={{ marginBottom: 24, flex: 1, height: 150 }}>
                            <TextInput
                                placeholder="Descripción"
                                value={description}
                                onChangeText={setDescription}
                                multiline={true}
                                placeholderTextColor="#909eaf"
                                style={{ ...styles.input, height: 150, paddingTop: 12 }}
                            />
                            <ErrorLabel errors={errors} name="address" />
                        </View>
                    </View>
                )}

                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%",
                        marginTop: 24,
                        marginBottom: 100,
                    }}>
                    <TouchableOpacity style={{ ...styles.button, backgroundColor: "#f95f62" }} onPress={() => navigation.navigate("TabOneScreen")}>
                        <Text style={{ color: "white", fontSize: 20 }}>Cancelar</Text>
                    </TouchableOpacity>
                    {loading ? (
                        <TouchableOpacity style={styles.button}>
                            <ActivityIndicator size="small" color="white" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={{ color: "white", fontSize: 20 }}>Guardar</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 22,
        paddingVertical: 44,
    },
    formGroup: { display: "flex", flexDirection: "row", width: "100%", alignItems: "flex-start" },
    label: {
        color: "#68707a",
        fontSize: 18,
        fontWeight: "600",
        marginRight: 16,
        width: 90,
        height: 54,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        borderColor: "#dce0e6",
        borderWidth: 1,
        backgroundColor: "#dfe2e5",
        height: 54,
        color: "black",
        paddingHorizontal: 12,
        fontSize: 18,
        borderRadius: 10,
    },
    button: {
        height: 54,
        width: "48%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#023047",
        borderRadius: 10,
    },
});
