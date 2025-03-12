import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';

import { ItineraryCreation } from '../components/itinerary-creation';
import { postItinerary } from '../services/itinerary-service';
import { ItineraryStackParamList } from './itinerary-stack';

type ItineraryCreationScreenProps = StackScreenProps<ItineraryStackParamList, 'ItineraryCreation'>;

export default function ItineraryCreationScreen({ navigation }: ItineraryCreationScreenProps) {
  const [destination, setDestination] = useState('');

  const handleStartTrip = async () => {
    try {
      const newItinerary = await postItinerary({ title: destination, description: '' });
      // Navigate to the details screen with the newly created itinerary
      navigation.navigate('ItineraryDetails', { itinerary: newItinerary });
    } catch (error) {
      Alert.alert('Error', 'Failed to post itinerary.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
        <ItineraryCreation
          destination={destination}
          setDestination={setDestination}
          onStartTrip={handleStartTrip}
          onBack={() => navigation.navigate('Home')}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: { flex: 1 },
  container: { flex: 1, backgroundColor: '#fff' },
});
