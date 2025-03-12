import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapScreen from './map-screen';
import { StackScreenProps } from '@react-navigation/stack';
import { ItineraryStackParamList } from './itinerary-stack';
import { getItineraryById } from '../services/itinerary-service';

type ItineraryDetailsScreenProps = StackScreenProps<ItineraryStackParamList, 'ItineraryDetails'>;

export default function ItineraryDetailsScreen({ navigation, route }: ItineraryDetailsScreenProps) {
  const { itinerary } = route.params;   
  const destination = itinerary.title;

  const [selectedOption, setSelectedOption] = useState<'Itinerary' | 'Map'>('Itinerary');

  // We'll store the fetched itinerary details (including locations) in state
  const [fetchedItinerary, setFetchedItinerary] = useState<any>(null);

  useEffect(() => {
    // If we have a UUID, fetch the latest itinerary data from the server
    if (itinerary.uuid) {
      (async () => {
        try {
          const fullItinerary = await getItineraryById(itinerary.uuid);
          setFetchedItinerary(fullItinerary);
        } catch (error) {
          console.error('Failed to fetch itinerary details:', error);
        }
      })();
    }
  }, [itinerary.uuid]);

  // If we haven't fetched anything yet, fallback to the initial object
  const displayedItinerary = fetchedItinerary || itinerary;
  const locations = displayedItinerary.locations || [];

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

        {/* Horizontal options */}
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
              <Text style={[styles.optionText, selectedOption === 'Itinerary' && styles.selectedOptionText]}>
                Itinerary
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => setSelectedOption('Map')}
            >
              <Text style={[styles.optionText, selectedOption === 'Map' && styles.selectedOptionText]}>
                Map
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Content area */}
        <View style={styles.content}>
          {selectedOption === 'Itinerary' ? (
            <View style={styles.itineraryContent}>
              <Text style={styles.itineraryText}>
                Itinerary details for {destination}:
              </Text>
              <View style={styles.locationsContainer}>
                {locations.length > 0 ? (
                  locations.map((loc: any, index: number) => (
                    <Text key={loc.id || index} style={styles.locationItem}>
                      {index + 1}. {loc.name || 'Untitled location'}
                    </Text>
                  ))
                ) : (
                  <Text>No locations found for this itinerary.</Text>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.mapContent}>
              <MapScreen 
                  navigation={navigation}
                  itineraryId={itinerary.uuid}
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
  content: { flex: 1 },
  itineraryContent: {
    flex: 1,
    padding: 20,
  },
  itineraryText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  locationsContainer: {
    marginTop: 10,
  },
  locationItem: {
    fontSize: 14,
    marginBottom: 5,
  },
  mapContent: {
    flex: 1,
  },
});
