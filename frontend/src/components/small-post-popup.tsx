import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';

export default function PopupOverlay({ post, onClose }) {
  if (!post) return null;
  
  return (
    <View style={styles.overlay}>
      <View style={styles.popup}>
        <View style={styles.header}>
          <Text style={styles.title}>{post.title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>Close</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.content} nestedScrollEnabled>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.imagesContainer}
          >
            {post.images.map((img, index) => (
              <Image key={index} source={img} style={styles.image} />
            ))}
          </ScrollView>
          <Text style={styles.description}>{post.description}</Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  popup: {
    height: '80%', // Adjust to cover the desired area
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  close: {
    fontSize: 16,
    color: '#e74c3c',
  },
  content: {
    flex: 1,
  },
  imagesContainer: {
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    marginRight: 10,
    borderRadius: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
  },
});
