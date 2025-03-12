import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface Location {
  id?: string;
  title?: string;
  photoURI?: string;
}

interface ItineraryLocationsProps {
  locations: Location[];
}

interface LocationItemProps {
  location: Location;
  index: number;
  isLast: boolean;
}

const LocationItem: React.FC<LocationItemProps> = ({ location, index, isLast }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View style={styles.locationItemContainer}>
      {/* Marker Column */}
      <View style={styles.markerContainer}>
        <View style={styles.circle}>
          <Text style={styles.indexText}>{index + 1}</Text>
        </View>
        {!isLast && <View style={styles.verticalLine} />}
      </View>
      {/* Content Column: Two sub-columns – text (title + triple dots + menu) and image */}
      <View style={styles.locationContent}>
        <View style={styles.textContainer}>
          <Text style={styles.locationTitle}>
            {location.title || 'Untitled location'}
          </Text>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setMenuOpen(!menuOpen)}
          >
            <Ionicons name="ellipsis-horizontal" size={16} color="#333" />
          </TouchableOpacity>
          {menuOpen && (
            <View style={styles.menuOptions}>
              <TouchableOpacity
                style={styles.menuOption}
                onPress={() => console.log('Edit pressed')}
              >
                <Text style={styles.menuOptionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuOption}
                onPress={() => console.log('Delete pressed')}
              >
                <Text style={[styles.menuOptionText, { color: 'red' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.imageContainer}>
          {location.photoURI ? (
            <Image source={{ uri: location.photoURI }} style={styles.locationImage} />
          ) : (
            <Text style={styles.noImageText}>No image</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export const ItineraryLocations: React.FC<ItineraryLocationsProps> = ({ locations }) => {
  return (
    <View style={styles.locationsContainer}>
      {locations.length > 0 ? (
        locations.map((loc, index) => (
          <LocationItem
            key={loc.id || index}
            location={loc}
            index={index}
            isLast={index === locations.length - 1}
          />
        ))
      ) : (
        <Text style={styles.noLocationsText}>
          No locations found for this itinerary.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  locationsContainer: {
    marginTop: 10,
  },
  locationItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align content to the top
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
  },
  markerContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 10,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  verticalLine: {
    width: 2,
    backgroundColor: 'blue',
    flex: 1,
    marginTop: 2,
  },
  locationContent: {
    flex: 1,
    flexDirection: 'row', // Two columns: left for text/menu, right for image
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  locationTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4, // Spacing between title and triple dots
  },
  menuButton: {
    marginTop: 2,
  },
  menuOptions: {
    marginTop: 4,
    backgroundColor: '#fff',
    padding: 4,
    // Removed border styles so no outline is shown for the menu
  },
  menuOption: {
    paddingVertical: 2,
  },
  menuOptionText: {
    fontSize: 14,
    color: '#333',
  },
  imageContainer: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  locationImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  noImageText: {
    fontSize: 12,
    color: 'gray',
  },
  noLocationsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ItineraryLocations;
