import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import GoogleMapComponent from '../components/google-map';
import { StackScreenProps } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import {getCoordinates, getPlaceDetails} from "../services/maps-service";

type RootStackParamList = {
  Home: undefined;
  TravelDiary: undefined;
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

  // Process search query
  const handleSearch = async () => {
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
      <>
        <SafeAreaView style={styles.container}>
          <StatusBar style="auto" />
          <GoogleMapComponent region={region} marker={marker} />

          {/* Search Bar at the Bottom */}
          <View style={styles.searchContainer}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search location..."
                placeholderTextColor="#aaa"
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={handleSearch}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Ionicons name="search" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    position: 'absolute',
    bottom: 20,
    width: '90%',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    elevation: 5, // Shadow effect for better UI
  },
  searchBar: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  searchButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
});
