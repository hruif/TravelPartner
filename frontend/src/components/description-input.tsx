import React from 'react';
import { TextInput, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface DescriptionInputProps {
  description: string;
  setDescription: (desc: string) => void;
  placeholder?: string;
  style?: ViewStyle | ViewStyle[];
  inputStyle?: TextStyle | TextStyle[];
}

export function DescriptionInput({
  description,
  setDescription,
  placeholder = 'Description',
  style,
  inputStyle,
}: DescriptionInputProps) {
  return (
    <TextInput
      style={[styles.descriptionContainer, inputStyle, style]}
      placeholder={placeholder}
      placeholderTextColor="#aaa"
      value={description}
      onChangeText={setDescription}
      multiline
    />
  );
}

const styles = StyleSheet.create({
  descriptionContainer: {
    width: '100%',
    height: 100,
    backgroundColor: '#ddd',
    color: '#000',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingTop: 15, // Ensure equal padding from top
    fontSize: 16,
    marginBottom: 15,
    textAlignVertical: 'top', // Keeps text at the top
  }
});
