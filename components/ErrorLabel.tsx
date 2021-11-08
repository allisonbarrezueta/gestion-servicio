import React from "react";
import first from "lodash/first";
import { StyleSheet, Text } from "react-native";

interface Props {
    errors: any;
    name: string;
}

export default function ErrorLabel({ errors, name }: Props) {
    const error = errors[name];
    const errorText: string = first(error) || "";

    if (!errorText) {
        return null;
    }

    return <Text style={styles.label}>{errorText}</Text>;
}

const styles = StyleSheet.create({
    label: {
        color: "#e74c3c",
        fontSize: 14,
        marginTop: 12,
    },
});
