import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Post } from './profile-posts';

interface DiaryPostPopupProps {
  post: Post;
  onClose: () => void;
  onDeletePost: (id: string) => void;
}

export function DiaryPostPopup({ post, onClose, onDeletePost }: DiaryPostPopupProps) {
  return (
    <View style={styles.overlay}>
      <View style={styles.popup}>
        <View style={styles.header}>
          <Text style={styles.title}>{post.title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>Close</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {post.photoURI ? (
            <Image source={{ uri: post.photoURI }} style={styles.image} />
          ) : null}
          <Text style={styles.description}>{post.description}</Text>
          <Text style={styles.rating}>Rating: {post.rating}</Text>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDeletePost(post.uuid)}
          >
            <Ionicons name="trash" size={24} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 100,
  },
  popup: {
    width: '100%',
    height: '60%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20, fontWeight: 'bold',
  },
  close: {
    fontSize: 16, color: '#e74c3c',
  },
  content: {
    flex: 1, // scrollable area
    marginTop: 10,
  },
  image: {
    width: '100%', height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  deleteButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
    padding: 10,
  },
});
