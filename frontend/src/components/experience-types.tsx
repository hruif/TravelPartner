import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ExperienceTypesSelectorProps {
  experienceTypes: string[];
  toggleExperienceType: (type: string) => void;
  // Optionally pass in a list of available experience types
  availableTypes?: string[];
}

export function ExperienceTypesSelector({
  experienceTypes,
  toggleExperienceType,
  availableTypes = ["Accommodation", "Active", "Adventure", "Art", "Culture", "Learning", "Food", "Relaxation", "Indoors", "Outdoors"],
}: ExperienceTypesSelectorProps) {
  return (
    <View style={styles.container}>
      {availableTypes.map((type) => {
        const isSelected = experienceTypes && experienceTypes.includes(type);
        return (
          <TouchableOpacity
            key={type}
            style={[styles.button, isSelected && styles.selectedButton]}
            onPress={() => toggleExperienceType(type)}
          >
            <Ionicons
              name={isSelected ? 'checkmark' : 'add'}
              size={18}
              color="#000"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>{type}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
  selectedButton: {
    backgroundColor: '#C9DCAA',
  },
  icon: {
    marginRight: 5,
  },
  buttonText: {
    color: '#000',
    fontSize: 12,
  },
});
