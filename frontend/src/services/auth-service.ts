import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './api-client';

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await apiClient.post('/auth/login', { email, password });
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data?.message || error.message);
        return { error: error.response?.data?.message || "Authentication failed" };
    }
};

export const signupUser = async (email: string, password: string) => {
    try {
        const response = await apiClient.post('/auth/signup', { email, password });
        return response.data;
    } catch (error) {
        console.error("Signup error:", error.response?.data?.message || error.message);
        return { error: error.response?.data?.message || "Signup failed" };
    }
};

export const authenticateUser = async (email, password, isLogin) => {
    if (!email || !password) {
        return { error: 'Please enter both email and password.' };
    }

    try {
        const response = isLogin ? await loginUser(email, password) : await signupUser(email, password);

        if (response && response.access_token) {
            await AsyncStorage.setItem('access_token', response.access_token);
            return { success: true, access_token: response.access_token };
        } else {
            return { error: response?.error || 'Authentication failed. No token received.' };
        }
    } catch (error) {
        console.error('🔥 Auth API error:', error);
        return { error: 'Network error, please try again.' };
    }
};


export const logoutUser = async () => {
    await AsyncStorage.removeItem('access_token');
};
