/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import * as React from "react";
import { ColorSchemeName, View, Text, TouchableOpacity, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, CommonActions, DrawerActions } from "@react-navigation/native";
import AuthContext from "./../contexts/AuthContext";
import UserContext from "./../contexts/UserContext";
import axios from "axios";
import { Orion } from "@tailflow/laravel-orion/lib/orion";
import * as Device from "expo-device";
import Icon from "react-native-vector-icons/Feather";

import NotFoundScreen from "../screens/NotFoundScreen";
import { RootStackParamList, UserType } from "../types";
import BottomTabNavigator from "./BottomTabNavigator";
import RegisterStepTwoScreen from "../screens/RegisterStepTwoScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import RegisterFormScreen from "../screens/RegisterFormScreen";
import LinkingConfiguration from "./LinkingConfiguration";
import ProfileScreen from "../screens/ProfileScreen";
import Http from "../modules/Http";
import RegisterStepThreeScreen from "../screens/RegisterStepThreeScreen";

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
    return (
        <NavigationContainer linking={LinkingConfiguration} theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <RootNavigator />
        </NavigationContainer>
    );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
    const [state, dispatch] = React.useReducer(
        (prevState: any, action: any) => {
            switch (action.type) {
                case "RESTORE_TOKEN":
                    return {
                        ...prevState,
                        userToken: action.token,
                        user: action.user,
                        isLoading: false,
                    };
                case "SIGN_IN":
                    return {
                        ...prevState,
                        isSignout: false,
                        user: action.user,
                        userToken: action.token,
                    };
                case "SIGN_OUT":
                    return {
                        ...prevState,
                        isSignout: true,
                        user: {},
                        userToken: null,
                        isLoading: false,
                    };
                case "UPDATE_USER":
                    return {
                        ...prevState,
                        user: action.user,
                    };
            }
        },
        {
            isLoading: true,
            isSignout: false,
            userToken: null,
            user: {},
        }
    );

    React.useEffect(() => {
        const bootstrapAsync = async () => {
            try {
                let userToken;

                try {
                    userToken = await AsyncStorage.getItem("@bearerToken");
                } catch (e) {
                    // Restoring token failed
                }

                if (userToken) {
                    Orion.setToken(userToken);
                }

                // After restoring token, we may need to validate it in production apps
                const { data: user } = await Http.get("/me", {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        Accept: "application/json",
                    },
                });

                // This will switch to the App screen or Auth screen and this loading
                // screen will be unmounted and thrown away.
                dispatch({ type: "RESTORE_TOKEN", token: userToken, user });
            } catch (error) {
                dispatch({ type: "SIGN_OUT" });
            }
        };

        bootstrapAsync();
    }, []);

    const authContext = React.useMemo(
        () => ({
            signIn: async ({ email, password }: { email: string; password: string }) => {
                try {
                    const { data } = await axios.post("https://gestion.ajmariduena.com/api/v1/sanctum/token", {
                        email,
                        password,
                        device_name: Device.modelName,
                    });

                    const { token } = data;
                    await AsyncStorage.setItem("@bearerToken", token);

                    if (token) {
                        Orion.setToken(token);
                    }

                    const { data: user } = await Http.get("/me");

                    dispatch({ type: "SIGN_IN", token, user });
                } catch (error) {
                    // const errors = get(error, "response.data.errors", {});
                    // setErrors(errors);
                    // setLoading(false);
                    return Promise.reject(error);
                }
            },
            signOut: async () => {
                await AsyncStorage.removeItem("@bearerToken");
                dispatch({ type: "SIGN_OUT" });
            },
            signUp: async ({ token }: any) => {
                try {
                    const { data: user } = await Http.get("/me");
                    dispatch({ type: "SIGN_IN", token, user });
                    return Promise.resolve(true);
                } catch (error) {
                    return Promise.reject(false);
                }
            },
            updateUser: async () => {
                try {
                    const { data: user } = await Http.get("/me");
                    dispatch({ type: "UPDATE_USER", user });
                    return Promise.resolve(user);
                } catch (error) {
                    return Promise.reject(false);
                }
            },
        }),
        []
    );

    if (state.isLoading) {
        return null;
    }

    return (
        <AuthContext.Provider value={authContext}>
            <UserContext.Provider value={state.user}>
                <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={state.userToken === null ? "Login" : "Root"}>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen
                        name="Register"
                        component={RegisterScreen}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="RegisterForm"
                        component={RegisterFormScreen}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="RegisterStepTwo"
                        component={RegisterStepTwoScreen}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="RegisterStepThree"
                        component={RegisterStepThreeScreen}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen name="Root" component={DrawerNavigation} />
                    <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: "Oops!" }} />
                </Stack.Navigator>
            </UserContext.Provider>
        </AuthContext.Provider>
    );
}

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
    const navigation = useNavigation();
    const { state, ...rest } = props;
    const newState = { ...state };
    const user: UserType = React.useContext(UserContext);
    // newState.routes = newState.routes.filter((item: any) => item.name !== "Home");

    const handleLogout = async () => {
        try {
            const asyncStorageKeys = await AsyncStorage.getAllKeys();
            if (asyncStorageKeys.length > 0) {
                if (Platform.OS === "android") {
                    await AsyncStorage.clear();
                }
                if (Platform.OS === "ios") {
                    await AsyncStorage.multiRemove(asyncStorageKeys);
                }
            }

            return navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [{ name: "Login" }],
                })
            );
        } catch (error) {}
    };

    return (
        <DrawerContentScrollView
            {...props}
            bounces={false}
            style={{ backgroundColor: "white", display: "flex", flexDirection: "column", flex: 1 }}
            contentContainerStyle={{ backgroundColor: "#219ebc", display: "flex", flexDirection: "column", flex: 1 }}>
            <View
                style={{
                    backgroundColor: "#219ebc",
                    paddingVertical: 22,
                    paddingHorizontal: 22,
                }}>
                {user && (
                    <Text style={{ color: "white", fontSize: 20, textAlign: "left" }}>
                        {user.name} {user.last_name}
                    </Text>
                )}
            </View>
            <View style={{ flex: 1, backgroundColor: "white", paddingTop: 16 }}>
                <DrawerItemList
                    state={newState}
                    {...rest}
                    activeTintColor="#406172"
                    inactiveTintColor="#406172"
                    itemStyle={{ backgroundColor: "white" }}
                    labelStyle={{ fontSize: 22, textAlign: "right" }}
                />
            </View>
            <View style={{ display: "flex", alignItems: "center", backgroundColor: "white", paddingBottom: 42 }}>
                <TouchableOpacity style={{ marginTop: 12 }} onPress={handleLogout}>
                    <Text style={{ fontSize: 22, color: "#3f6172", fontWeight: "600" }}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </DrawerContentScrollView>
    );
}

function DrawerNavigation({ navigation }: any) {
    return (
        <Drawer.Navigator
            initialRouteName="Root"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            drawerPosition="right"
            screenOptions={{
                headerShown: true,
                headerTitle: "",
                headerLeft: () => null,
                headerRight: () => (
                    <TouchableOpacity style={{ width: 44 }} onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                        <Icon name="menu" size={28} color="#232323" />
                    </TouchableOpacity>
                ),
                headerStyle: {
                    backgroundColor: "white",
                    elevation: 0,
                    shadowOffset: {
                        height: 0,
                        width: 0,
                    },
                },
            }}>
            <Drawer.Screen name="Inicio" component={BottomTabNavigator} />
            <Drawer.Screen
                name="Mi Perfil"
                component={ProfileScreen}
                options={{
                    headerTitleStyle: { color: "white", fontSize: 20, fontWeight: "500" },
                    headerStyle: {
                        backgroundColor: "#219ebc",
                        height: 110,
                        shadowOffset: {
                            height: 0,
                            width: 0,
                        },
                    },
                    headerRight: () => null,
                }}
            />
            <Drawer.Screen name="Mis Ubicaciones" component={BottomTabNavigator} />
            <Drawer.Screen name="Sobre Nosotros" component={BottomTabNavigator} />
        </Drawer.Navigator>
    );
}
