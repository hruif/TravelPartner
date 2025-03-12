import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import GoogleMapComponent from '../components/google-map';
import { StackScreenProps } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { getCoordinates, getPlaceDetails } from "../services/maps-service";
import AnimatedPlaceholderInput from '../components/animated-input-placeholder';
import { PlaceDetailsPopup } from '../components/place-details-popup';
import { addLocationToItinerary } from '../services/itinerary-service';

type RootStackParamList = {
  Home: undefined;
  TravelJournal: undefined;
};

type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface MapScreenProps {
  itineraryId?: string;
  onLocationAdded?: () => void;
}

type CombinedMapScreenProps = HomeScreenProps & MapScreenProps;

export default function MapScreen({ navigation, itineraryId, onLocationAdded }: CombinedMapScreenProps) {
  const [searchText, setSearchText] = useState('');
  const [region, setRegion] = useState<Region | null>(null);
  const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationDetails, setLocationDetails] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [itineraryIdState, setItineraryIdState] = useState<string | undefined>(itineraryId);

  useEffect(() => {
    setItineraryIdState(itineraryId);
  }, [itineraryId]);

  // Process search query
  const handleSearch = async () => {
    // Hide the keyboard
    Keyboard.dismiss();

    if (!searchText.trim()) return;

    const location = await getCoordinates(searchText);
    if (location) {
      const details = await getPlaceDetails(location.place_id);
      setLocationDetails(details);
      setRegion({
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setMarker({
        latitude: location.lat,
        longitude: location.lng,
      });
      setShowDetails(true);
      setSearchPerformed(true);
    } else {
      alert("Location not found!");
      resetSearchState();
    }
  };

  // Reset search state
  const resetSearchState = () => {
    setRegion(null);
    setMarker(null);
    setLocationDetails(null);
    setShowDetails(false);
    setSearchPerformed(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <GoogleMapComponent region={region} marker={marker} />
      {/* Search Bar Overlay */}
      <View style={styles.searchContainer}>
        <AnimatedPlaceholderInput
          style={styles.searchBar}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {showDetails && locationDetails && (
        <PlaceDetailsPopup
          details={locationDetails}
          onClose={() => setShowDetails(false)}
          onAddLocation={async (title, photoURI) => {
            if (!itineraryId) {
              alert('Itinerary not set.');
              return;
            }
            try {
              await addLocationToItinerary(itineraryId, {
                photoURI,
                title,
                description: '',
                formattedAddress: '',
              });
              // Instead of alerting, call the callback:
              if (onLocationAdded) {
                onLocationAdded();
              }
            } catch (error) {
              console.error('Failed to add location:', error);
              alert('Error adding location to itinerary.');
            }
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    bottom: 25,
    width: '90%',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    elevation: 5,
    borderColor: '#969ba3',
    borderWidth: 2,
    overflow: 'hidden',
  },
  searchBar: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingHorizontal: 10,
    color: 'black',
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    paddingLeft: 15,
  },
  searchButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
  },
});
