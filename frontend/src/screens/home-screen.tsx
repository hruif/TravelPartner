import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';

export default function HomeScreen({ navigation }) {
    const { logout } = useAuth(); // Logout function

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.content}>
                <Text style={styles.welcomeText}>Connect with the World, One Post at a Time!</Text>
                <Text style={styles.subtitle}>
                    Share your travels, explore new cultures, and stay connected globally.
                </Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Map')}>
                <Ionicons name="globe-outline" size={24} color="white" />
                <Text style={styles.buttonText}>Explore the Map</Text>
            </TouchableOpacity>

            <View style={styles.postsContainer}>
                <View style={styles.post}>
                    <Image 
                        source={require('../../assets/paris1.jpg')}
                        style={styles.postImage} 
                    />
                    <Text style={styles.postTitle}>Paris</Text>
                </View>
                <View style={styles.post}>
                    <Image 
                        source={require('../../assets/switzerland1.jpg')}
                        style={styles.postImage} 
                    />
                    <Text style={styles.postTitle}>Switzerland</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Ionicons name="log-out-outline" size={24} color="white" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 30,
        paddingBottom: 30,
        backgroundColor: '#f4f4f4',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logo: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15,
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        color: '#666',
        marginTop: 5,
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#8e44ad',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    postsContainer: {
        marginTop: 20,
        width: '100%',
        paddingHorizontal: 10,
    },
    post: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
        width: '100%',
    },
    postImage: {
        width: '100%',
        height: 300,
    },
    postTitle: {
        padding: 10,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    logoutButton: {
        flexDirection: 'row',
        backgroundColor: '#e74c3c',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: 20,
    },
    logoutText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});
