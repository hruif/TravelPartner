import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Text
} from 'react-native';
import React, { useState, useRef } from 'react';
import GoogleMapComponent from '../components/google-map';
import { StackScreenProps } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { getCoordinates, getPlaceDetails, getPlacePhotos } from "../services/maps-service";
import AnimatedPlaceholderInput from '../components/animated-input-placeholder';
import PlacePhotos from '../components/place-photos';
import GOOGLE_MAPS_API_KEY from '@env';

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
  const [photos, setPhotos] = useState<string[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  
  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  // Process search query
  const handleSearch = async () => {
    if (!searchText.trim()) return;

    const location = await getCoordinates(searchText);
    if (location) {
      setLoadingPhotos(true);
      
      // Get place details
      const details = await getPlaceDetails(location.place_id);
      setLocationDetails(details);
      
      // Update map
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
      
      // Get place photos
      try {
        const photoResults = await getPlacePhotos(location.place_id);
        setPhotos(photoResults || []);
      } catch (error) {
        console.error("Error loading photos:", error);
        setPhotos([]);
      } finally {
        setLoadingPhotos(false);
      }
      
      setShowDetails(true);
      setSearchPerformed(true);
      
      // Animate the photos panel in
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 40
      }).start();
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
    setPhotos([]);
    
    // Reset animation
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    }).start();
  };
  
  // Close details panel
  const hideDetails = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    }).start(() => {
      setShowDetails(false);
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
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
        
        {/* Location Photos Panel */}
        {showDetails && (
          <Animated.View 
            style={[
              styles.photosPanel,
              {
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, 0]
                    })
                  }
                ]
              }
            ]}
          >
            {locationDetails && (
              <View style={styles.locationHeader}>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{locationDetails.name}</Text>
                  {locationDetails.formatted_address && (
                    <Text style={styles.locationAddress}>{locationDetails.formatted_address}</Text>
                  )}
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={hideDetails}>
                  <Ionicons name="close" size={24} color="#555" />
                </TouchableOpacity>
              </View>
            )}
            <PlacePhotos photos={photos} loading={loadingPhotos} />
          </Animated.View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
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
  photosPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  locationInfo: {
    flex: 1,
    paddingRight: 10,
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  closeButton: {
    padding: 5,
  },
});