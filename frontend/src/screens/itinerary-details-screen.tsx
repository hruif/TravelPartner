import React, { useEffect, useState } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import MapScreen from './map-screen';
import { StackScreenProps } from '@react-navigation/stack';
import { ItineraryStackParamList } from './itinerary-stack';
import { ItineraryLocations } from '../components/itinerary-locations';

import { useItineraryMarkers } from '../components/itinerary-map-markers';
import { getLatLngFromAddress } from '../services/maps-service';

type ItineraryDetailsScreenProps = StackScreenProps<ItineraryStackParamList, 'ItineraryDetails'>;

export default function ItineraryDetailsScreen({ navigation, route }: ItineraryDetailsScreenProps) {
  const { itinerary } = route.params;
  const destination = itinerary.title;
  const [defaultRegion, setDefaultRegion] = useState(null);

  const [selectedOption, setSelectedOption] = useState<'Itinerary' | 'Map'>('Itinerary');

  const { fetchedItinerary, markers, refreshItinerary } = useItineraryMarkers(itinerary.uuid);

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

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>

        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
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
              <ItineraryLocations locations={locations} />
            </ScrollView>
          ) : (
            <View style={styles.mapContent}>
              <MapScreen
                navigation={navigation}
                itineraryId={itinerary.uuid}
                itineraryMarkers={markers}
                onLocationAdded={async () => {
                  // 1) Re-fetch itinerary and rebuild markers
                  await refreshItinerary();
                  // 2) Switch back to the itinerary tab
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
    position: 'relative',
    backgroundColor: '#f0f0f0',
    paddingVertical: 20,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 2,
    padding: 5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
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
