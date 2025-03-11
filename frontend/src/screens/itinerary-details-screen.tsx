import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapScreen from './map-screen';
import { StackScreenProps } from '@react-navigation/stack';
import { ItineraryStackParamList } from './itinerary-stack';

type ItineraryDetailsScreenProps = StackScreenProps<ItineraryStackParamList, 'ItineraryDetails'>;

export default function ItineraryDetailsScreen({ navigation, route }: ItineraryDetailsScreenProps) {
  const { itinerary } = route.params;   // The itinerary object from home-screen or creation
  const destination = itinerary.title;  // Or other property

  const [selectedOption, setSelectedOption] = useState<'Itinerary' | 'Map'>('Itinerary');

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
                Itinerary details for {destination} will appear here.
              </Text>
            </View>
          ) : (
            <View style={styles.mapContent}>
              <MapScreen navigation={undefined} route={undefined} />
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
    fontWeight: 'bold' 
  },
  optionsContainer: { height: 50, justifyContent: 'center' },
  optionsContent: { paddingHorizontal: 20, alignItems: 'center' },
  optionButton: { marginRight: 20 },
  optionText: { fontSize: 18, color: 'gray' },
  selectedOptionText: { color: 'black', fontWeight: 'bold', borderBottomWidth: 2, borderBottomColor: 'black' },
  content: { flex: 1 },
  itineraryContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  itineraryText: { fontSize: 16, color: '#333' },
  mapContent: { flex: 1 },
});
