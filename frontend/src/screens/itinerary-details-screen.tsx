import React, { useEffect, useState } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, ImageBackground
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import MapScreen from './map-screen';
import { StackScreenProps } from '@react-navigation/stack';
import { ItineraryStackParamList } from './itinerary-stack';
import { ItineraryLocations } from '../components/itinerary-locations';

import { useItineraryMarkers } from '../components/itinerary-map-markers';
import { getLatLngFromAddress, getFirstImageForItineraryTitle } from '../services/maps-service';

type ItineraryDetailsScreenProps = StackScreenProps<ItineraryStackParamList, 'ItineraryDetails'>;

export default function ItineraryDetailsScreen({ navigation, route }: ItineraryDetailsScreenProps) {
  const { itinerary } = route.params;
  const destination = itinerary.title;
  const [defaultRegion, setDefaultRegion] = useState(null);

  const [selectedOption, setSelectedOption] = useState<'Itinerary' | 'Map'>('Itinerary');

  const { fetchedItinerary, markers, refreshItinerary } = useItineraryMarkers(itinerary.uuid);
  const [headerImage, setHeaderImage] = useState<string | null>(null);

  // If we haven't fetched anything yet, fallback to the initial object
  const displayedItinerary = fetchedItinerary || itinerary;
  const locations = displayedItinerary.locations || [];

  useEffect(() => {
    async function fetchDefaultRegion() {
      try {
        const coords = await getLatLngFromAddress(destination); // assuming destination is the itinerary title or derived address
        setDefaultRegion({
          latitude: coords.lat,
          longitude: coords.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.error('Failed to geocode itinerary title:', error);
      }
    }
    fetchDefaultRegion();
  }, [destination]);

  useEffect(() => {
    (async () => {
      try {
        const imageUrl = await getFirstImageForItineraryTitle(destination);
        setHeaderImage(imageUrl);
      } catch (error) {
        console.error('Failed to get header image:', error);
      }
    })();
  }, [destination]);

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* The SafeAreaView is used to account for notches, but you can control its padding */}
      <SafeAreaView edges={['left', 'right']} style={styles.container}>
      
        {/* Header with home button and title at bottom left */}
        <View style={styles.header}>
          {headerImage && (
            <ImageBackground
              source={{ uri: headerImage }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
          )}
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons name="home" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Your Trip to {destination}</Text>
        </View>


        {/* Horizontal tabs: Itinerary / Map */}
        <View style={styles.optionsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.optionsContent}
          >
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => setSelectedOption('Itinerary')}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedOption === 'Itinerary' && styles.selectedOptionText
                ]}
              >
                Itinerary
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => setSelectedOption('Map')}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedOption === 'Map' && styles.selectedOptionText
                ]}
              >
                Map
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Content area */}
        <View style={styles.content}>
          {selectedOption === 'Itinerary' ? (
            <ScrollView style={styles.itineraryScrollView}>
              <ItineraryLocations locations={locations} itineraryId={itinerary.uuid } refreshItinerary={refreshItinerary}/>
            </ScrollView>
          ) : (
            <View style={styles.mapContent}>
              <MapScreen
                navigation={navigation}
                itineraryId={itinerary.uuid}
                itineraryMarkers={markers}
                onLocationAdded={async () => {
                  await refreshItinerary();
                  setSelectedOption('Itinerary');
                }}
                defaultRegion={defaultRegion} 
              />
            </View>
          )}
        </View>

      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: { flex: 1 },
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: '20%',
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  homeButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 2,
    padding: 5,
  },
  headerText: {
    position: 'absolute',
    bottom: 12, 
    left: 12,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', 
    zIndex: 2,
  },
  optionsContainer: {
    height: 50,
    justifyContent: 'center',
  },
  optionsContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  optionButton: {
    marginRight: 20,
  },
  optionText: {
    fontSize: 18,
    color: 'gray',
  },
  selectedOptionText: {
    color: 'black',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: 'black',
  },
  content: {
    flex: 1,
  },
  mapContent: {
    flex: 1,
  },
  itineraryScrollView: {
    flex: 1,
    padding: 20,
  },
});
