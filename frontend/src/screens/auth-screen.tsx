import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import {authenticateUser} from "../services/auth-service";
import useAuthStore from "../stores/auth.store";

export default function AuthScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuthStore();

    const handleLoginOrSignup = async (isLogin) => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }

        setIsLoading(true);

        try {
            console.log(`Attempting ${isLogin ? 'login' : 'signup'} with email:`, email);

            const response = await authenticateUser(email, password, isLogin);

            if (response.success) {
                console.log('Login successful! Token:', response.access_token);
                await login(response.access_token);
            } else {
                console.error('Authentication failed:', response.error);
                Alert.alert('Error', response.error);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false); // Always stop loading
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to GlobeGram</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            {isLoading ? (
                <ActivityIndicator size="large" color="#3498db" />
            ) : (
                <>
                    <TouchableOpacity style={styles.button} onPress={() => handleLoginOrSignup(true)}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.signupButton]} onPress={() => handleLoginOrSignup(false)}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: { width: '90%', height: 50, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, paddingHorizontal: 10, marginBottom: 10 },
    button: { backgroundColor: '#3498db', padding: 15, borderRadius: 10, width: '90%', alignItems: 'center', marginTop: 10 },
    signupButton: { backgroundColor: '#2ecc71' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
