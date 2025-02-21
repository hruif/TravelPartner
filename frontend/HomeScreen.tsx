import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Image} from 'react-native';
import GoogleMapComponent from './google-map';
import React, { useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';

type RootStackParamList = {
    Home: undefined;
    TravelDiary: undefined;
};

type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({navigation}: HomeScreenProps) {
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
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGVAZ21haWwuY29tIiwiaWF0IjoxNzQwMTM5NjU1LCJleHAiOjE3NDAxNDAyNTV9.g0HP6VPSvhY5LycieaaW3zToVOYjZ-sBos7LYU9OWXI";
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
        </View>
        <View style={styles.searchContainer}>
          <TextInput style={styles.searchBar}
              placeholder="Search location..."
              placeholderTextColor="#aaa"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}/>
        </View>  
        <View style={styles.container}>
      <View style={styles.container}>      
        <TouchableOpacity 
        style={styles.diaryIconContainer} 
        onPress={() => navigation.navigate('TravelDiary')}>
        <Image 
          source={require('./assets/diary-icon.png')}
          style={styles.Icon}
        />
        </TouchableOpacity>
        <TouchableOpacity 
        style={styles.mapIconContainer} 
        onPress={() => navigation.navigate('Home')}>
        <Image 
          source={require('./assets/mapicon.png')}
          style={styles.Icon}
        />
        </TouchableOpacity>
        <TouchableOpacity 
        style={styles.budgetIconContainer} 
        onPress={() => navigation.navigate('Home')}>
        <Image 
          source={require('./assets/budgeticon.png')}
          style={styles.Icon}
        />
        </TouchableOpacity>
      </View>
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
    justifyContent: 'flex-start',
  },
  titleContainer: {
    width: '50%',
    height: '7%',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 10,
    zIndex: 2,
    elevation: 2,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  searchContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
    zIndex: 2,
    elevation: 2,
  },
  diaryIconContainer: {
    position: 'absolute',
    bottom: '0.5%', 
    right: '8%',
    width: '10%',
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  mapIconContainer: {
    position: 'absolute',
    bottom: '0.5%', 
    width: '10%',
    height: '10%',
    justifyContent: 'center',
    alignItems: "center",
    alignSelf: 'center',
    zIndex: 2,
  },
  budgetIconContainer: {
    position: 'absolute',
    bottom: '0.5%', 
    left: '8%',
    width: '10%',
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    fontStyle: 'normal',
    letterSpacing: 2,
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
  Icon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
});
