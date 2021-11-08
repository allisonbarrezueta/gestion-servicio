import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { BottomTabParamList, TabOneParamList, TabThreeParamList, TabTwoParamList, MyBidsParamsList, UserType } from "../types";
import UserContext from "../contexts/UserContext";

import TabOneScreen from "../screens/TabOneScreen";
import ServiceRequestsScreen from "../screens/ServiceRequestsScreen";
import ServiceRequestScreen from "../screens/ServiceRequestScreen";
import MakeOfferScreen from "../screens/MakeOfferScreen";
import MyBidsScreen from "../screens/MyBidsScreen";
import TabTwoScreen from "../screens/TabTwoScreen";
import HistoryScreen from "../screens/HistoryScreen";
import ScheduledScreen from "../screens/ScheduledScreen";
import InProcessScreen from "../screens/InProcessScreen";
import ServiceScreen from "../screens/ServiceScreen";
import BidsScreen from "../screens/BidsScreen";
import OffersScreen from "../screens/OffersScreen";
import RequestServiceScreen from "../screens/RequestServiceScreen";
import OfferScreen from "../screens/OfferScreen";
import PayOfferScreen from "../screens/PayOfferScreen";
import CommentsScreen from "../screens/CommentsScreen";
import PayScreen from "../screens/PayScreen";
import ActiveOffersScreen from "../screens/ActiveOffersScreen";
import ActiveOfferScreen from "../screens/ActiveOfferScreen";
import EditOfferScreen from "../screens/EditOfferScreen";
import InactiveOffersScreen from "../screens/InactiveOffersScreen";
import FinishScreen from "../screens/FinishScreen";
import ClientDetailScreen from "../screens/ClientDetailScreen";
import SelectBidsScreen from "../screens/SelectBidsScreen";
import InactiveBidsScreen from "../screens/InactiveBidsScreen";

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
    const user: UserType = React.useContext(UserContext);

    if (user.type === "supplier") {
        return (
            <BottomTab.Navigator
                initialRouteName="Servicios"
                tabBarOptions={{
                    labelStyle: {
                        color: "white",
                        fontSize: 16,
                    },
                    iconStyle: {
                        display: "none",
                    },
                    style: {
                        backgroundColor: "#219ebc",
                    },
                }}>
                <BottomTab.Screen name="Por Realizar" component={TabTwoNavigator} />
                <BottomTab.Screen name="Servicios" component={TabOneNavigator} />
                <BottomTab.Screen name="Subasta" component={MyBidsNavigator} />
            </BottomTab.Navigator>
        );
    }

    return (
        <BottomTab.Navigator
            initialRouteName="Servicios"
            tabBarOptions={{
                labelStyle: {
                    color: "white",
                    fontSize: 16,
                },
                iconStyle: {
                    display: "none",
                },
                style: {
                    backgroundColor: "#219ebc",
                },
            }}>
            <BottomTab.Screen name="Mis Ordenes" component={TabTwoNavigator} />
            <BottomTab.Screen name="Servicios" component={TabOneNavigator} />
            <BottomTab.Screen name="Puja" component={TabThreeNavigator} />
        </BottomTab.Navigator>
    );
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<TabOneParamList>();

function TabOneNavigator() {
    return (
        <TabOneStack.Navigator screenOptions={{ headerShown: false }}>
            <TabOneStack.Screen name="TabOneScreen" component={TabOneScreen} />
            <TabOneStack.Screen name="Solicitar Servicio" component={RequestServiceScreen} />
            <TabOneStack.Screen name="Solicitudes de Servicio" component={ServiceRequestsScreen} />
            <TabOneStack.Screen name="Solicitud de Servicio" component={ServiceRequestScreen} />
            <TabOneStack.Screen name="Realizar Oferta" component={MakeOfferScreen} />
            <TabOneStack.Screen name="Detalle de Cliente" component={ClientDetailScreen} />
        </TabOneStack.Navigator>
    );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator() {
    return (
        <TabTwoStack.Navigator>
            <TabTwoStack.Screen name="TabOne" component={TabTwoScreen} options={{ headerShown: false }} />
            <TabTwoStack.Screen name="History" component={HistoryScreen} options={{ headerShown: false }} />
            <TabTwoStack.Screen name="Scheduled" component={ScheduledScreen} options={{ headerShown: false }} />
            <TabTwoStack.Screen name="Service" component={ServiceScreen} options={{ headerShown: false }} />
            <TabTwoStack.Screen name="InProcess" component={InProcessScreen} options={{ headerShown: false }} />
            <TabTwoStack.Screen name="FinishService" component={FinishScreen} options={{ headerShown: false }} />
        </TabTwoStack.Navigator>
    );
}

const MyBidsStack = createStackNavigator<MyBidsParamsList>();

function MyBidsNavigator() {
    return (
        <MyBidsStack.Navigator initialRouteName="Subasta">
            <MyBidsStack.Screen name="Subasta" component={MyBidsScreen} options={{ headerShown: false }} />
            <MyBidsStack.Screen name="ActiveOffers" component={ActiveOffersScreen} options={{ headerShown: false }} />
            <MyBidsStack.Screen name="InactiveOffers" component={InactiveOffersScreen} options={{ headerShown: false }} />
            <MyBidsStack.Screen name="ActiveOffer" component={ActiveOfferScreen} options={{ headerShown: false }} />
            <MyBidsStack.Screen name="EditOffer" component={EditOfferScreen} options={{ headerShown: false }} />
        </MyBidsStack.Navigator>
    );
}

const TabThreeStack = createStackNavigator<TabThreeParamList>();

function TabThreeNavigator() {
    return (
        <TabThreeStack.Navigator initialRouteName="SelectBids">
            <TabThreeStack.Screen name="SelectBids" component={SelectBidsScreen} options={{ headerShown: false }} />
            <TabThreeStack.Screen name="Bids" component={BidsScreen} options={{ headerShown: false }} />
            <TabThreeStack.Screen name="InactiveBidsScreen" component={InactiveBidsScreen} options={{ headerShown: false }} />
            <TabThreeStack.Screen name="Offers" component={OffersScreen} options={{ headerShown: false }} />
            <TabThreeStack.Screen name="Offer" component={OfferScreen} options={{ headerShown: false }} />
            <TabThreeStack.Screen name="PayOffer" component={PayOfferScreen} options={{ headerShown: false }} />
            <TabThreeStack.Screen name="Pay" component={PayScreen} options={{ headerShown: false }} />
            <TabThreeStack.Screen name="Scheduled" component={ScheduledScreen} options={{ headerShown: false }} />
            <TabThreeStack.Screen name="Comments" component={CommentsScreen} options={{ headerShown: false }} />
        </TabThreeStack.Navigator>
    );
}
