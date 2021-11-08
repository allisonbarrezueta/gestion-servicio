import React, { useRef, useState } from "react";
import { StyleSheet, ActivityIndicator, View, ScrollView, SafeAreaView } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { TabThreeParamList } from "./../types";
import { WebView } from "react-native-webview";
import UserContext from "../contexts/UserContext";
import { UserType } from "./../types";
import Http from "../modules/Http";

type Props = StackScreenProps<TabThreeParamList, "PayOffer">;

export default function PayScreen({ route, navigation }: Props) {
    const webViewRef = useRef();
    const user: UserType = React.useContext(UserContext);
    const bid = route.params.bid;
    const [loading, setLoading] = useState(false);
    const subtotal = bid.$attributes.offer;
    const tax = subtotal * 0.12;
    const total = subtotal + tax;

    const handleOrderSuccess = async (payload: any) => {
        setLoading(true);
        try {
            await Http.post("/orders", {
                user_id: user.id,
                supplier_id: bid.$attributes.user_id,
                request_id: bid.$attributes.request_id,
                bid_id: bid.$attributes.id,
                subtotal,
                tax,
                total,
                metadata: JSON.stringify(payload),
            });

            await Http.patch(`/bids/${bid.$attributes.id}`, {
                offer: bid.$attributes.offer,
                description: bid.$attributes.description,
                status: "accepted",
            });

            await Http.patch(`/requests/${bid.$attributes.request_id}`, {
                supplier_id: bid.$attributes.user_id,
                status: "in_progress",
            });

            return navigation.reset({
                routes: [{ name: "Scheduled" }],
            });
        } catch (error) {
            console.log(error.response);
        } finally {
            setLoading(false);
        }
    };

    const handleEvent = ({ nativeEvent }: any) => {
        const event = JSON.parse(nativeEvent.data);
        const { type, payload } = event;

        // {
        //     "card": Object {
        //       "bin": "411111",
        //       "expiry_month": "9",
        //       "expiry_year": "2026",
        //       "number": "1111",
        //       "origin": "Paymentez",
        //       "status": "",
        //       "token": "",
        //       "transaction_reference": "RB-69058",
        //       "type": "vi",
        //     },
        //     "transaction": Object {
        //       "amount": 29.232000000000003,
        //       "authorization_code": "TEST00",
        //       "carrier": "Redeban",
        //       "carrier_code": "00",
        //       "current_status": "APPROVED",
        //       "dev_reference": "8371cf8f-77b2-47c7-9798-454161752b18",
        //       "id": "RB-69058",
        //       "installments": 1,
        //       "message": "Response by mock",
        //       "payment_date": "2021-08-22T17:37:25.102",
        //       "status": "success",
        //       "status_detail": 3,
        //     },
        //   }

        switch (type) {
            case "MODAL_RESPONSE":
                handleOrderSuccess(payload);
                break;
            case "MODAL_CLOSE":
                navigation.navigate("PayOffer", { bid });
            default:
                break;
        }
    };

    const data = `
      window.subtotal = '${subtotal}';
      window.tax = '${tax}';
      window.total = '${total}';
      window.user = '${JSON.stringify({ id: user.id, email: user.email })}'
      true;
    `;

    const uri = "https://gestion.ajmariduena.com/paymentez";

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ width: "100%", flex: 1, paddingVertical: 22 }}>
                {loading && (
                    <View style={{ paddingTop: 44 }}>
                        <ActivityIndicator color="#4c5763" size="large" />
                    </View>
                )}
                <WebView
                    ref={(ref: any) => (webViewRef.current = ref)}
                    originWhitelist={["*"]}
                    source={{ uri }}
                    onMessage={handleEvent}
                    onLoadStart={() => {
                        setLoading(true);
                    }}
                    onLoadEnd={() => {
                        setLoading(false);
                    }}
                    injectedJavaScriptBeforeContentLoaded={data}
                    style={{ height: 800 }}></WebView>
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
        borderColor: "#dce0e6",
        borderWidth: 1,
        height: 54,
        width: "100%",
        color: "black",
        paddingHorizontal: 12,
        marginBottom: 12,
        fontSize: 18,
        borderRadius: 10,
        fontWeight: "600",
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
