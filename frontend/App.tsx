import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native';
import GoogleMapComponent from './google-map';
import React, { useState } from 'react';

export default function App() {
  const [searchText, setSearchText] = useState('');
  const [region, setRegion] = useState<Region | null>(null);
  const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationDetails, setLocationDetails] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };

  // Geocoding function using backend endpoint
  const getCoordinates = async (address: string) => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGVAZ21haWwuY29tIiwiaWF0IjoxNzQwMTU0NjAyLCJleHAiOjE3NDAxNTUyMDJ9.GQW_3_1FrDJFudlXWYgpst-A-5xQH-z1H1wkSYdnohY";
    const url = `http://146.190.151.248:3000/maps/geocode?address=${encodeURIComponent(address)}`;
  
    try {
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        console.error("Fetch failed with status:", response.status);
        return null;
      }
      const coordinates = await response.json();
      if (coordinates.length > 0) {
        const location = coordinates[0].geometry.location;
        const placeId = coordinates[0].place_id;
        return {
          lat: location.lat, 
          lng: location.lng,
          place_id: placeId
        };
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
      setRegion(null);
      setMarker(null);
      setLocationDetails(null);
      setShowDetails(false);
      setSearchPerformed(false);
    }
  };

  const getPlaceDetails = async (placeId: string) => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGVAZ21haWwuY29tIiwiaWF0IjoxNzQwMTU0NjAyLCJleHAiOjE3NDAxNTUyMDJ9.GQW_3_1FrDJFudlXWYgpst-A-5xQH-z1H1wkSYdnohY";
    const url = `http://146.190.151.248:3000/maps/place-details?placeId=${encodeURIComponent(placeId)}`;
    try {
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        console.error("Fetch failed with status:", response.status);
        return null;
      }
      const details = await response.json();
      return details;
    } catch (error) {
      console.error("Error fetching location data from backend", error);
      return null;
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
        <GoogleMapComponent region={region} marker={marker}/>
        {searchPerformed && (
          <>
            {showDetails && locationDetails ? (
              <ScrollView style={styles.detailsContainer}>
                <Text style={styles.locationName}>{locationDetails.name}</Text>
                <Text style={styles.locationAddress}>{locationDetails.formatted_address}</Text>
                {locationDetails.photos && locationDetails.photos.map((photo: { photo_reference: string }, index: number) => (
                  <Image
                    key={index}
                    style={styles.photo}
                    source={{ uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${"test123"}` }}
                  />
                ))}
                <TouchableOpacity style={styles.closeButton} onPress={() => setShowDetails(false)}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            ) : (
              <TouchableOpacity style={styles.showDetailsButton} onPress={() => setShowDetails(true)}>
                <Text style={styles.showDetailsButtonText}>Show Details</Text>
              </TouchableOpacity>
            )}
          </>
        )}
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
  detailsContainer: {
    width: '100%',
    marginTop: 20,
    backgroundColor: '#f8f8f8',
  },
  locationName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingRight: 50, // Add padding to avoid overlap with buttons
    backgroundColor: '#f8f8f8',
    padding: 10,
  },
  locationAddress: {
    fontSize: 16,
    marginBottom: 10,
    paddingRight: 50, // Add padding to avoid overlap with buttons
    backgroundColor: '#f8f8f8',
    padding: 10,
  },
  photo: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  showDetailsButton: {
    position: 'absolute',
    top: 180,
    right: 5,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  showDetailsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});