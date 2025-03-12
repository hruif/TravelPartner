import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Modal, 
  Pressable, 
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PlaceDetailsPopupProps {
  details: any;
  onClose: () => void;
  onAddLocation?: (title: string, photoURI: string, formattedAddress: string) => void; 
}

export const PlaceDetailsPopup: React.FC<PlaceDetailsPopupProps> = ({
  details,
  onClose,
  onAddLocation,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Construct image URLs from each photo's photo_reference.
  const imageUrls: string[] =
    details.photos?.map((photo: any) => {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=AIzaSyBwDfYSVR0oQWqoFR7hOPgqK_JChCNlSoI`;
    }) || [];

  // Grab the first image (if any)
  const firstImageUrl = imageUrls.length > 0 ? imageUrls[0] : '';

  const handleAddPress = () => {
    if (onAddLocation) {
      onAddLocation(details.name || 'Untitled', firstImageUrl, details.formatted_address || '');
    }
  };

  return (
    <>
      <View style={styles.popupContainer}>
        <View style={styles.popup}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.plusButton} onPress={handleAddPress}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.placeName}>
              {details.name || 'Unknown Place'}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          {/* Vertical Images Scroll */}
          <ScrollView
            style={styles.imagesContainer}
            contentContainerStyle={styles.imagesContentContainer}
          >
            {imageUrls.length > 0 ? (
              imageUrls.map((url, index) => (
                <TouchableOpacity key={index} onPress={() => setSelectedImage(url)}>
                  <Image source={{ uri: url }} style={styles.image} />
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noImagesText}>No images available.</Text>
            )}
          </ScrollView>
        </View>
      </View>
      {/* Expanded Image Modal */}
      <Modal
        visible={!!selectedImage}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <Pressable style={styles.fullScreenOverlay} onPress={() => setSelectedImage(null)}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: selectedImage! }}
              style={styles.expandedImage}
              resizeMode="contain"
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  popupContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  popup: {
    height: screenHeight * 0.5,  // Popup takes up half the screen
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  plusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeName: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  imagesContainer: {
    flex: 1,
  },
  imagesContentContainer: {
    paddingVertical: 10,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
  },
  noImagesText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '90%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedImage: {
    width: '100%',
    height: '100%',
  },
});

export default PlaceDetailsPopup;
