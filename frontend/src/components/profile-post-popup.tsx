import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Post } from './profile-posts';

interface DiaryPostPopupProps {
  post: Post;
  onClose: () => void;
  onDelete: (id: string) => void;
  onEdit: () => void;
}

export function DiaryPostPopup({ post, onClose, onDelete, onEdit }: DiaryPostPopupProps) {
  return (
    <TouchableWithoutFeedback onPress={onClose}> 
      <View style={styles.overlay}>
        <TouchableWithoutFeedback>
          <View style={styles.popup}>
            <View style={styles.header}>
              <Text style={styles.title}>{post.title}</Text>
              <TouchableOpacity onPress={() => onDelete(post.uuid)}>
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onEdit}>
                <Text>Edit</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
              {post.photoURI ? (
                <Image source={{ uri: post.photoURI }} style={styles.image} />
              ) : null}
              <Text style={styles.date}>{new Date(post.date).toLocaleDateString()}</Text>
              {post.location && post.location.place_id && (
                <Text style={styles.location}>Location: {post.location.place_id}</Text>
              )}
              <Text style={styles.description}>{post.description}</Text>
              {post.experienceTypes && post.experienceTypes.length > 0 && (
                <Text style={styles.experienceTypes}>
                  Experience Types: {post.experienceTypes.join(', ')}
                </Text>
              )}
              {post.price > 0 && (
                <Text style={styles.price}>${post.price}</Text>
              )}
              {post.rating > 0 && (
                <View style={styles.stars}>
                  {[...Array(post.rating)].map((_, index) => (
                    <Ionicons
                      key={index}
                      name="star"
                      size={20}
                      color="#FFD700"
                    />
                  ))}
                </View>
              )}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
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
  delete: {
    color: '#e74c3c',
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
  date: {
    fontSize: 16,
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  experienceTypes: {
    fontSize: 16,
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    marginBottom: 5,
  },
  stars: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
});
