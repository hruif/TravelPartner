import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TextInput} from 'react-native';
import GoogleMapComponent from './google-map';
import React, { useState } from 'react';

export default function App() {
  const [searchText, setSearchText] = useState('');

  interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  const [region, setRegion] = useState<Region | null>(null);

  // Geocoding function using backend endpoint
  const getCoordinates = async (address: string) => {
    // hardcode from swagger
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZ21haWwuY29tIiwiaWF0IjoxNzM5Nzg2MjE3LCJleHAiOjE3Mzk3ODYyNzd9.hMPFioeEqqIrDVjwgKZl1GTLxG7B8DKNqF8SstP0Ya8";
    // endpoint to send request to
    const url = `http://146.190.151.248:3000/maps/geocode?address=${encodeURIComponent(address)}`;
  
    try {
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) { // debug
        console.error("Fetch failed with status:", response.status);
        return null;
      }
      const coordinates = await response.json();
      console.log("Response data:", coordinates);
      if (coordinates.length > 0) {
        // use first result
        const location = coordinates[0].geometry.location;
        console.log("Extracted location:", location);
        return location;
      } else {
        console.log("No results found.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching location data from backend", error);
      return null;
    }
  };

  // Process search query
  const handleSearch = async () => {
    const location = await getCoordinates(searchText);
    console.log("Coordinates for address:", searchText, location);
    // moves camera to search location
    if (location) {
      console.log("location: ", location);
      setRegion({
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } else {
      alert("Location not found!");
      setRegion(null);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>GlobeGram</Text>
          <TextInput style={styles.searchBar}
            placeholder="Search location..."
            placeholderTextColor="#aaa"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
          />
        </View>  
        <GoogleMapComponent region={region}/>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 5,
    zIndex: 2,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'gray',
    fontStyle: 'normal',
    letterSpacing: 2,
    marginBottom: 20,
  },
  searchBar: {
    width: '90%',
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },  
});
