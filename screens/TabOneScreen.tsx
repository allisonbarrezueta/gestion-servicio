import React, { useState, useEffect, useContext } from "react";
import isEmpty from "lodash/isEmpty";
import { StyleSheet, Text, TouchableOpacity, View, TextInput, FlatList, Image, SafeAreaView, ActivityIndicator, RefreshControl } from "react-native";
import UserContext from "../contexts/UserContext";
import AuthContext from "./../contexts/AuthContext";

/* Models */
import Category from "./../models/Category";

/* Types */
import { UserType } from "./../types";

const ServiceCard = ({ category, navigation, user }: { category: Category; navigation: any; user: UserType }) => {
    const handleNavigate = () => {
        if (user.type === "supplier") {
            return navigation.navigate("Solicitudes de Servicio", { category });
        }

        return navigation.navigate("Solicitar Servicio", { category });
    };

    return (
        <TouchableOpacity onPress={handleNavigate} style={serviceStyles.container}>
            <Image
                style={serviceStyles.image}
                resizeMode="cover"
                source={{
                    uri: category.$attributes.image,
                }}
            />
            <Text style={styles.title} numberOfLines={2}>
                {category.$attributes.name}
            </Text>
        </TouchableOpacity>
    );
};

export default function TabOneScreen({ navigation }: any) {
    const [services, setServices] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState("");
    const user: UserType = useContext(UserContext);
    const renderItem = ({ item }: { item: Category }) => <ServiceCard category={item} user={user} navigation={navigation} />;

    const { updateUser } = useContext(AuthContext);

    const getServices = async () => {
        setLoading(true);
        try {
            let results = null;

            if (user.type === "supplier") {
                if (user.approved) {
                    results = await Category.$query().filter("status", "=", 1).scope("supplier", [user.id]).with(["category"]).search();
                }
            } else {
                results = await Category.$query().filter("status", "=", 1).search();
            }

            setServices(results);
        } catch (error) {
            console.log("error", error.response.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isEmpty(user)) {
            getServices();
        }
    }, [user]);

    const condition = new RegExp(query);
    let searchResults = services;

    if (!isEmpty(query)) {
        searchResults = services.filter((service) => {
            return condition.test(service.$attributes.name);
        });
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ width: "100%", flexDirection: "column", flex: 1 }}>
                <Text style={styles.searchTitle}>Encuentra un servicio:</Text>
                <TextInput onChangeText={setQuery} placeholder="Buscar un servicio" placeholderTextColor="#909eaf" style={styles.input} />

                <View style={{ flex: 1 }}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#99d1e0" />
                    ) : (
                        <FlatList
                            style={{ width: "100%" }}
                            contentContainerStyle={{ paddingBottom: 100 }}
                            data={searchResults}
                            refreshControl={
                                <RefreshControl
                                    refreshing={loading}
                                    onRefresh={() => {
                                        updateUser();
                                        getServices();
                                    }}
                                />
                            }
                            renderItem={renderItem}
                            columnWrapperStyle={{ justifyContent: "space-between" }}
                            numColumns={2}
                            keyExtractor={(service: Category) => `${service.$attributes.id}`}
                        />
                    )}
                </View>
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
    searchTitle: { fontSize: 24, fontWeight: "600", marginBottom: 18, color: "#4c5763" },
    title: {
        fontSize: 16,
        fontWeight: "500",
        color: "#838a92",
        marginTop: 6,
        height: 52,
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

const serviceStyles = StyleSheet.create({
    container: { width: "47%", display: "flex", justifyContent: "center", alignItems: "center" },
    image: { width: "100%", height: 100, borderRadius: 10, borderWidth: 1, borderColor: "#e1e5e9" },
});
