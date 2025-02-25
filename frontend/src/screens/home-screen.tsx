import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';

export default function HomeScreen({ navigation }) {
    const { logout } = useAuth(); // ✅ Logout function

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#3498db', '#8e44ad']} style={styles.header}>
                <Text style={styles.headerText}>GlobeGram</Text>
            </LinearGradient>

            <View style={styles.content}>
                <Image
                    source={{ uri: 'https://source.unsplash.com/200x200/?globe,travel' }}
                    style={styles.logo}
                />
                <Text style={styles.welcomeText}>Connect with the World, One Post at a Time!</Text>
                <Text style={styles.subtitle}>
                    Share your travels, explore new cultures, and stay connected globally.
                </Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Map')}>
                <Ionicons name="globe-outline" size={24} color="white" />
                <Text style={styles.buttonText}>Explore the Map</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Ionicons name="log-out-outline" size={24} color="white" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f4f4', alignItems: 'center' },
    header: { width: '100%', height: 180, justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
    headerText: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
    content: { alignItems: 'center', marginTop: -40, paddingHorizontal: 20 },
    logo: { width: 120, height: 120, borderRadius: 60, marginBottom: 15 },
    welcomeText: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#333' },
    subtitle: { fontSize: 14, textAlign: 'center', color: '#666', marginTop: 5 },
    button: { flexDirection: 'row', backgroundColor: '#8e44ad', padding: 15, borderRadius: 30, alignItems: 'center', marginTop: 20, paddingHorizontal: 20 },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
    logoutButton: { flexDirection: 'row', backgroundColor: '#e74c3c', padding: 15, borderRadius: 30, alignItems: 'center', marginTop: 20, paddingHorizontal: 20, position: 'absolute', bottom: 30 },
    logoutText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
});
