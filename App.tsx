import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Orion } from "@tailflow/laravel-orion/lib/orion";
import { AuthDriver } from "@tailflow/laravel-orion/lib/drivers/default/enums/authDriver";

Orion.init("https://gestion.ajmariduena.com", "api/v1", AuthDriver.Sanctum);

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

export default function App() {
    const isLoadingComplete = useCachedResources();
    const colorScheme = useColorScheme();

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <SafeAreaProvider style={{ backgroundColor: "white" }}>
                <Navigation colorScheme={colorScheme} />
                <StatusBar />
            </SafeAreaProvider>
        );
    }
}
