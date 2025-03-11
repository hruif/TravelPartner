import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text,  
  ScrollView, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  TextInput,
  Alert
} from 'react-native';
import MapScreen from './map-screen';
import { StackScreenProps } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ItineraryCreation } from '../components/itinerary-creation';
import { postItinerary } from '../services/itinerary-service';

type RootStackParamList = {
  Itinerary: undefined;
  Home: undefined;
};

type ItineraryScreenProps = StackScreenProps<RootStackParamList, 'Itinerary'>;

export default function ItineraryScreen({ navigation }: ItineraryScreenProps) {
  // tripStarted controls whether to show the itinerary creation UI or the full itinerary interface
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
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
        <ItineraryCreation 
          destination={destination}
          setDestination={setDestination}
          onStartTrip={async () => {
            try {
              // Call postItinerary from itinerary-service with the destination as title
              await postItinerary({ title: destination, description: "" });
              setTripStarted(true);
            } catch (error) {
              Alert.alert('Error', 'Failed to post itinerary.');
            }
          }}
          onBack={() => navigation.navigate('Home')}
        />
      </SafeAreaView>
    );
  }

  // Full itinerary interface with back button
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
