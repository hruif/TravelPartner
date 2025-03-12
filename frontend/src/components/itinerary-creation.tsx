import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface ItineraryCreationProps {
  destination: string;
  setDestination: (value: string) => void;
  onStartTrip: () => void;
  onBack: () => void;
}

export function ItineraryCreation({ destination, setDestination, onStartTrip, onBack }: ItineraryCreationProps) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.plannerContainer}>
      <TouchableOpacity 
        style={styles.backButtonMinimal} 
        onPress={onBack}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Let's Plan!</Text>
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
        onPress={onStartTrip}
      >
        <Text style={styles.startTripButtonText}>Start your trip</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  plannerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 50, 
  },
  backButtonMinimal: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    padding: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'center',
    marginTop: 20, 
    marginBottom: 10,
  },
  plannerContent: {
    marginBottom: 40,
    marginTop: 20, 
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
});

export default ItineraryCreation;
