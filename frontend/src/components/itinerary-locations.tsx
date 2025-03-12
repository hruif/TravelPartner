import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export interface Location {
  id?: string;
  title?: string;
  photoURI?: string;
}

interface ItineraryLocationsProps {
  locations: Location[];
}

export const ItineraryLocations: React.FC<ItineraryLocationsProps> = ({ locations }) => {
  return (
    <View style={styles.locationsContainer}>
      {locations.length > 0 ? (
        locations.map((loc, index) => (
          <View key={loc.id || index} style={styles.locationItemContainer}>
            <Text style={styles.locationTitle}>
              {loc.title || 'Untitled location'}
            </Text>
            {loc.photoURI ? (
              <Image source={{ uri: loc.photoURI }} style={styles.locationImage} />
            ) : (
              <Text style={styles.noImageText}>No image</Text>
            )}
          </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  locationTitle: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  locationImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginLeft: 10,
  },
  noImageText: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 10,
  },
  noLocationsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});
