import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity 
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  Itinerary: undefined;
  Home: undefined;
  ItineraryDetails: undefined;
};

type ItineraryScreenProps = StackScreenProps<RootStackParamList, 'Itinerary'>;

export default function ItineraryScreen({ navigation }: ItineraryScreenProps) {
  const [destination, setDestination] = useState('');

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.label}>Where to?</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter destination"
          placeholderTextColor="#aaa"
          value={destination}
          onChangeText={setDestination}
        />
      </View>

      <TouchableOpacity 
        style={styles.startButton} 
        onPress={() => navigation.navigate('ItineraryDetails')}
      >
        <Text style={styles.startButtonText}>Start your trip</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
  content: {
    marginTop: 60,
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
  },
  startButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
