import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text,  
  ScrollView, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  TextInput
} from 'react-native';
import MapScreen from './map-screen';
import { StackScreenProps } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  Itinerary: undefined;
  Home: undefined;
};

type ItineraryScreenProps = StackScreenProps<RootStackParamList, 'Itinerary'>;

export default function ItineraryScreen({ navigation }: ItineraryScreenProps) {
  // tripStarted controls whether to show the minimal trip planner or full itinerary interface
  const [tripStarted, setTripStarted] = useState(false);
  const [destination, setDestination] = useState('');
  const [selectedOption, setSelectedOption] = useState<'Itinerary' | 'Map'>('Itinerary');

  // Reset tripStarted whenever this screen gains focus (optional)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setTripStarted(false);
    });
    return unsubscribe;
  }, [navigation]);

  if (!tripStarted) {
    return (
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.plannerContainer}>
        <TouchableOpacity 
          style={styles.backButtonMinimal} 
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.plannerContent}>
          <Text style={styles.plannerLabel}>Where to?</Text>
          <TextInput 
            style={styles.plannerInput}
            placeholder="Enter destination"
            placeholderTextColor="#aaa"
            value={destination}
            onChangeText={setDestination}
          />
        </View>
        <TouchableOpacity 
          style={styles.startTripButton}
          onPress={() => {
            setTripStarted(true);
          }}
        >
          <Text style={styles.startTripButtonText}>Start your trip</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Full itinerary interface with back button (already present)
  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Your Trip to {destination}</Text>
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
  // Minimal trip planner styles
  plannerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
    paddingTop: 50, 
  },
  plannerContent: {
    marginBottom: 40,
  },
  plannerLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  plannerInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
    color: '#000',
  },
  backButtonMinimal: {
    position: 'absolute',
    top: 47,
    left: 10,
    zIndex: 10,
    padding: 5,
  },
  startTripButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  startTripButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Full itinerary interface styles
  keyboardAvoidingContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
