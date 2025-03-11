import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PlaceDetailsPopupProps {
  details: any;
  onClose: () => void;
  onAddLocation?: (title: string, photoURI: string) => void; 
}

export const PlaceDetailsPopup: React.FC<PlaceDetailsPopupProps> = ({
  details,
  onClose,
  onAddLocation
}) => {
  // Construct image URLs from each photo's photo_reference
  const imageUrls: string[] =
    details.photos?.map((photo: any) => {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=YOUR_API_KEY`;
    }) || [];

  // Grab the first image (if any)
  const firstImageUrl = imageUrls.length > 0 ? imageUrls[0] : '';

  const handleAddPress = () => {
    if (onAddLocation) {
      onAddLocation(details.name || 'Untitled', firstImageUrl);
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.popup}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>

        {/* Circular Plus Button */}
        <TouchableOpacity style={styles.plusButton} onPress={handleAddPress}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Place Name */}
        <Text style={styles.placeName}>
          {details.name || 'Unknown Place'}
        </Text>

        {/* Images Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imagesContainer}
        >
          {imageUrls.length > 0 ? (
            imageUrls.map((url, index) => (
              <Image key={index} source={{ uri: url }} style={styles.image} />
            ))
          ) : (
            <Text style={styles.noImagesText}>No images available.</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  popup: {
    maxHeight: '50%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    paddingTop: 30, // Extra top padding so the plus button + place name have room
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
    padding: 5,
  },
  plusButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 2,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  imagesContainer: {
    flexDirection: 'row',
  },
  image: {
    width: 120,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  noImagesText: {
    fontSize: 14,
    color: 'gray',
  },
});
