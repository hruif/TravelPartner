import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function LargePost({ imageSource, title }) {
  return (
    <View style={styles.post}>
      <Image source={imageSource} style={styles.postImage} />
      <Text style={styles.postTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  post: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
  },
  postImage: {
    width: '100%',
    height: 300,
  },
  postTitle: {
    padding: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
