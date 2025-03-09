import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useAuthStore = create((set, get) => ({
    authState: false,
    loading: true,

    initializeAuth: async () => {
        const token = await AsyncStorage.getItem("access_token");
        set({ authState: !!token, loading: false });
    },

    login: async (token) => {
        await AsyncStorage.setItem("access_token", token);
        set({ authState: true });
    },

    logout: async () => {
        await AsyncStorage.removeItem("access_token");
        set({ authState: false });
    },
}));

export default useAuthStore;
