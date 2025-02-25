import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './hooks/useAuth'; // ✅ Ensure AuthProvider is imported

// Import screens
import AuthScreen from './screens/auth-screen';
import MainScreen from './screens/main-screen';

const Stack = createNativeStackNavigator();

function MainApp() {
    const { authState, loading } = useAuth(); // ✅ Correct use of context

    if (loading) return null;

    return (
        <NavigationContainer>
            <Stack.Navigator
                key={authState ? "MainNav" : "AuthNav"}
                screenOptions={{ headerShown: false }}
            >
                {!authState ? (
                    <Stack.Screen name="Auth" component={AuthScreen} />
                ) : (
                    <Stack.Screen name="Main" component={MainScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <MainApp />
        </AuthProvider>
    );
}
