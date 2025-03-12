import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import React, { useState } from 'react';
import GoogleMapComponent from '../components/google-map';
import { StackScreenProps } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { getAutocomplete, getCoordinates, getPlaceDetails } from "../services/maps-service";
import AnimatedPlaceholderInput from '../components/animated-input-placeholder';

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

export default function MapScreen({ navigation }: HomeScreenProps) {
  const [searchText, setSearchText] = useState('');
  const [region, setRegion] = useState<Region | null>(null);
  const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationDetails, setLocationDetails] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [autocompleteResults, setAutocompleteResults] = useState<any[]>([]);

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

  // Handle text input change
  const handleInputChange = async (text: string) => {
    setSearchText(text);
    if (text.trim()) {
      try {
        const results = await getAutocomplete(text);
        if (results && results.predictions) {
          setAutocompleteResults(results.predictions);
        } else {
          setAutocompleteResults([]);
        }
      } catch (error) {
        console.error('Error fetching autocomplete results:', error);
        setAutocompleteResults([]);
      }
    } else {
      setAutocompleteResults([]);
    }
  };

  // Handle place selection
  const handlePlaceSelect = async (placeId: string) => {
    const details = await getPlaceDetails(placeId);
    const location = details.geometry.location;
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
    setAutocompleteResults([]);
    setSearchText(details.formatted_address);
  };

  // Reset search state
  const resetSearchState = () => {
    setRegion(null);
    setMarker(null);
    setLocationDetails(null);
    setShowDetails(false);
    setSearchPerformed(false);
    setAutocompleteResults([]);
    setSearchText('');
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
          onChangeText={handleInputChange}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Autocomplete Results */}
      {autocompleteResults.length > 0 && (
        <FlatList
          data={autocompleteResults}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.autocompleteItem}
              onPress={() => handlePlaceSelect(item.place_id)}
            >
              <Text style={styles.autocompleteText}>{item.description}</Text>
            </TouchableOpacity>
          )}
          style={styles.autocompleteContainer}
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
    top: 50,
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
  autocompleteContainer: {
    position: 'absolute',
    top: 100,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    borderColor: '#969ba3',
    borderWidth: 1,
    maxHeight: 200,
  },
  autocompleteItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  autocompleteText: {
    fontSize: 16,
  },
});
