import React from 'react';
import { View, Image, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native';

interface PlacePhotosProps {
    photos: string[];
    loading: boolean;
}

const PlacePhotos: React.FC<PlacePhotosProps> = ({ photos, loading }) => {
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3498db" />
                <Text style={styles.loadingText}>Loading photos...</Text>
            </View>
        );
    }

    if (photos.length === 0) {
        return (
            <View style={styles.noPhotosContainer}>
                <Text style={styles.noPhotosText}>No photos available</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
                {photos.map((photo, index) => (
                    <View key={index} style={styles.photoContainer}>
                        <Image
                            source={{ uri: photo }}
                            style={styles.photo}
                            resizeMode="cover"
                        />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    scrollContainer: {
        paddingHorizontal: 10,
    },
    photoContainer: {
        marginHorizontal: 5,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    photo: {
        width: 200,
        height: 150,
    },
    loadingContainer: {
        width: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#555',
        fontSize: 14,
    },
    noPhotosContainer: {
        width: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noPhotosText: {
        color: '#555',
        fontSize: 14,
    }
});

export default PlacePhotos;