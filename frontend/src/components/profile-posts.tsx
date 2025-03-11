import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface Post {
  uuid: string,
  journal: string,
  title: string,
  date: string,
  location: { lat: any; lng: any; place_id: any } | null,
  photoURI: string,
  description: string,
  experienceTypes: string[],
  price: number,
  rating: number
}

interface ProfilePostsProps {
  journalEntries: Post[];
  selectedJournal: string | null;
  onDelete: (id: string) => void;
  onEdit: (post: Post) => void;
}

export function ProfilePosts({ journalEntries, selectedJournal, onDelete, onEdit }: ProfilePostsProps) {
  const filteredEntries = journalEntries.filter(entry => entry.journal === selectedJournal);
  console.log("Selected Journal:", selectedJournal);
  console.log("Entries:", journalEntries);
  console.log("Filtered Entries:", filteredEntries);
  for (let i = 0; i < journalEntries.length; i++) {
    console.log(journalEntries[i].journal);
  }
  return (
    <View style={styles.profilePostsSection}>
      {filteredEntries.length > 0 ? (
        filteredEntries.map((entry) => (
          <View style={styles.postContainer} key={entry.uuid}>
            <View style={styles.header}>
              {entry.title && (
                <Text style={styles.postTitle}>{entry.title}</Text>
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => onDelete(entry.uuid)}>
                  <Text style={styles.delete}>Delete</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onEdit(entry)}>
                  <Text>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.postDate}>{new Date(entry.date).toDateString()}</Text>

            {entry.photoURI && (
              <Image source={{ uri: entry.photoURI }} style={styles.postPhoto} />
            )}

            <Text style={styles.postDescription}>{entry.description}</Text>

            {entry.experienceTypes && entry.experienceTypes.length > 0 && (
              <Text style={styles.postExperienceTypes}>
                Experience Types: {entry.experienceTypes.join(', ')}
              </Text>
            )}

            <Text style={styles.postPrice}>${entry.price}</Text>

            {entry.rating > 0 && (
              <View style={styles.stars}>
                {[...Array(entry.rating)].map((_, index) => (
                  <Text key={index}>⭐</Text>
                ))}
              </View>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.noEntriesText}>No entries yet.</Text>
      )}
    </View>
)}

const styles = StyleSheet.create({
  profilePostsSection: {
    width: '100%',
    marginTop: 20,
    marginBottom: 30,
  },
  postContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20, // btwn buttons
    marginTop: 10,
  },
  delete: {
    color: '#e74c3c',
  },
  postDate: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
    marginBottom: 10,
  },
  postPhoto: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  postDescription: {
    fontSize: 14,
    color: '#000',
    marginBottom: 10,
  },
  postExperienceTypes: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  postPrice: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  stars: {
    flexDirection: 'row',
    //marginLeft: 10,
  },
  noEntriesText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});