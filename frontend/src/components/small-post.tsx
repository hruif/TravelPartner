import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  ImageBackground,
  StyleSheet,
  View,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { deleteItineraryAndAllLocations } from '../services/itinerary-service';

interface SmallPostProps {
  text: string;
  onPress: () => void;
  imageSource: ImageSourcePropType;
  itineraryId: string;
  fetchItineraries: () => Promise<void>;
  onDelete?: () => void; // optional delete callback, if needed
}

export default function SmallPost({
  text,
  onPress,
  imageSource,
  itineraryId,
  fetchItineraries,
  onDelete,
}: SmallPostProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <ImageBackground
        source={imageSource}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        {/* Menu button in top left */}
        <View style={styles.menuContainer}>
          <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
            <Ionicons name="ellipsis-horizontal" size={18} color="#fff" />
          </TouchableOpacity>
          {menuOpen && (
            <View style={styles.dropdown}>
              <TouchableOpacity
                onPress={async () => {
                  try {
                    await deleteItineraryAndAllLocations(itineraryId);
                    await fetchItineraries();
                    if (onDelete) onDelete();
                  } catch (err) {
                    console.error('Failed to delete itinerary:', err);
                  }
                }}
              >
                <Text style={styles.dropdownText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Text style={styles.text}>{text}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#ccc',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 5,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  menuContainer: {
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 2,
  },
  dropdown: {
    marginTop: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  dropdownText: {
    color: 'red',
    fontSize: 12,
  },
});
