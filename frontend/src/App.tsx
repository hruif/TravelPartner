import React, {useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import AuthScreen from './screens/auth-screen';
import MainScreen from './screens/main-screen';
import useAuthStore from "./stores/auth.store";

const Stack = createNativeStackNavigator();

function MainApp() {
    const { authState, loading, initializeAuth } = useAuthStore();

    useEffect(() => {
        initializeAuth();
    }, []);


    return (
        <NavigationContainer>
            <Stack.Navigator
                key={authState ? "MainNav" : "AuthNav"}
                screenOptions={{ headerShown: false }}
            r>
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
        <MainApp />
    );
}
