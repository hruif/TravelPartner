import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation }) {
    const { logout } = useAuth(); // Logout function

    return (
        <ImageBackground
            source={require('../../assets/background3.avif')}
            style={styles.backgroundImage}
        >
            <ScrollView contentContainerStyle={styles.container}>
                {/* Horizontal small posts section */}
                <View style={styles.smallPostsSection}>
                    <ScrollView 
                        horizontal={true} 
                        showsHorizontalScrollIndicator={false} 
                        contentContainerStyle={styles.smallPostsContainer}
                    >
                        <View style={styles.smallPost}>
                            <Text style={styles.smallPostText}>Post 1</Text>
                        </View>
                        <View style={styles.smallPost}>
                            <Text style={styles.smallPostText}>Post 2</Text>
                        </View>
                        <View style={styles.smallPost}>
                            <Text style={styles.smallPostText}>Post 3</Text>
                        </View>
                    </ScrollView>
                </View>

                {/* Big posts section */}
                <View style={styles.postsContainer}>
                    <View style={styles.post}>
                        <Image 
                            source={require('../../assets/vaticancity.jpg')}
                            style={styles.postImage} 
                        />
                        <Text style={styles.postTitle}>Vatican City</Text>
                    </View>
                    <View style={styles.post}>
                        <Image 
                            source={require('../../assets/switzerland1.jpg')}
                            style={styles.postImage} 
                        />
                        <Text style={styles.postTitle}>Switzerland</Text>
                    </View>
                    <View style={styles.post}>
                        <Image 
                            source={require('../../assets/tokyo1.jpg')}
                            style={styles.postImage} 
                        />
                        <Text style={styles.postTitle}>Tokyo</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Ionicons name="log-out-outline" size={24} color="white" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        paddingBottom: 30,
        backgroundColor: 'transparent', 
        alignItems: 'center',
    },
    content: {
        paddingTop: 30,
        alignItems: 'center',
        paddingHorizontal: 20,
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
    smallPostsSection: {
        marginTop: 20,
        width: '100%',
    },
    smallPostsContainer: {
        paddingHorizontal: 10,
    },
    smallPost: {
        width: 100,
        height: 100,
        backgroundColor: '#fff',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    smallPostText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    // Styles for big posts
    postsContainer: {
        marginTop: 38,
        width: '100%',
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
