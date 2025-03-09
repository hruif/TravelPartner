import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuthStore from "../stores/auth.store";

const API_BASE_URL = "http://146.190.151.248:3000";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

// Request Interceptor (Keeps existing token logic)
apiClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor (Handles 404 errors)
apiClient.interceptors.response.use(
    (response) => response, // Pass successful responses through
    (error) => {
        if (error.response && error.response.status === 404) {
            const { logout} = useAuthStore();
            logout().then(r => console.log("Logged out due to 404"));
        }
        return Promise.reject(error); // Propagate error so the caller can handle it
    }
);

export default apiClient;
