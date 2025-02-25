import { useState, useEffect, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({
    authState: false,
    login: async () => {},
    logout: async () => {},
    loading: true,
});

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAuthState = async () => {
            const token = await AsyncStorage.getItem('access_token');
            setAuthState(!!token); // ✅ Ensures it's true/false
            setLoading(false);
        };

        loadAuthState();
    }, []);

    const login = async (token) => {
        await AsyncStorage.setItem('access_token', token);
        setAuthState(true);
    };

    const logout = async () => {
        await AsyncStorage.removeItem('access_token');
        setAuthState(false);
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
