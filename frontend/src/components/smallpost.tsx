import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SmallPost({ text }) {
  return (
    <View style={styles.smallPost}>
      <Text style={styles.smallPostText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  smallPost: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  smallPostText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});
