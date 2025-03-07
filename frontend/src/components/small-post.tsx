import React from 'react';
import { TouchableOpacity, ImageBackground, Text, StyleSheet } from 'react-native';

export default function SmallPost({ text, onPress, imageSource }) {
  return (
    <TouchableOpacity style={styles.smallPost} onPress={onPress}>
      <ImageBackground 
        source={imageSource}
        style={styles.background}
        imageStyle={{ borderRadius: 10 }}
      >
        <Text style={styles.smallPostText}>{text}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  smallPost: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  smallPostText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});
