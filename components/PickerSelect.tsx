import React from "react";
import { StyleSheet, View, StyleProp, ViewStyle } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import Icon from "react-native-vector-icons/Feather";

interface Item {
    label: string;
    value: any;
}

interface Props {
    onChange: (value: any) => void;
    items: Item[] | undefined;
    value?: any;
    placeholder: string;
    containerStyles?: StyleProp<ViewStyle>;
}

export default function PickerSelect({ items, onChange, placeholder, containerStyles, value }: Props) {
    if (!items) {
        return null;
    }

    return (
        <View style={containerStyles}>
            <RNPickerSelect
                style={pickerSelectStyles}
                placeholder={{
                    label: placeholder,
                    value: null,
                }}
                value={value}
                Icon={() => {
                    return (
                        <View style={styles.icon}>
                            <Icon name="chevron-down" size={24} color="#909daf" />
                        </View>
                    );
                }}
                onValueChange={(value: any) => {
                    if (value) {
                        onChange(value);
                    }
                }}
                items={items}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    icon: { height: 54, width: 54, alignItems: "center", justifyContent: "center" },
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
        paddingRight: 54,
    },
});
