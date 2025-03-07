import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Post {
  uuid: string;
  title: string;
}

interface ProfilePostsProps {
  journalEntries: Post[];
}

export function ProfilePosts({ journalEntries }: ProfilePostsProps) {
  return (
    <View style={styles.profilePostsSection}>
      <Text style={styles.sectionTitle}>Your Posts</Text>
      {journalEntries.length > 0 ? (
        journalEntries.map((entry) => (
          <View key={entry.uuid} style={styles.postItem}>
            <Text style={styles.postItemText}>{entry.title}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.postItemText}>No posts yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  profilePostsSection: {
    width: '100%',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
  },
  postItem: {
    backgroundColor: '#3a3f47',
    width: '100%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  postItemText: {
    color: '#fff',
    fontSize: 16,
  },
});
