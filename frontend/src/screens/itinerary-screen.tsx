import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import MapScreen from './map-screen';
import { StackScreenProps } from '@react-navigation/stack';

type RootStackParamList = {
  Itinerary: undefined;
  // other routes if needed
};

type ItineraryScreenProps = StackScreenProps<RootStackParamList, 'Itinerary'>;

export default function ItineraryScreen({ navigation }: ItineraryScreenProps) {
  const [selectedOption, setSelectedOption] = useState<'Itinerary' | 'Map'>('Itinerary');

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Your Trip to </Text>
        </View>

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

        <View style={styles.content}>
          {selectedOption === 'Itinerary' ? (
            <View style={styles.itineraryContent}>
              <Text style={styles.itineraryText}>Itinerary details will appear here.</Text>
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
  keyboardAvoidingContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 20,
    alignItems: 'center',
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
  itineraryContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itineraryText: {
    fontSize: 16,
    color: '#333',
  },
  mapContent: {
    flex: 1,
  },
});
