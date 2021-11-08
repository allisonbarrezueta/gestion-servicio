import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Http = axios.create({
    baseURL: "https://lapintaec.com/admin/api/v1",
});

Http.interceptors.request.use(async (config) => {
    const bearerToken = await AsyncStorage.getItem("@bearerToken");

    return {
        ...config,
        headers: {
            Authorization: `Bearer ${bearerToken}`,
        },
    };
});

export default Http;
