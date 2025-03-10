import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Image,
  Alert, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, ScrollView,
  ImageBase, Platform
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';

import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { getCoordinates } from '../services/maps-service';
import { postJournalEntry, getJournalEntries, deleteJournalEntry } from '../services/diary-service';

import { DescriptionInput } from '../components/description-input';
import { ExperienceTypesSelector } from '../components/experience-types';
import { PriceInput } from '../components/price-input';

import { ProfilePosts, Post } from '../components/profile-posts';
import { DiaryPostPopup } from '../components/profile-post-popup';

type RootStackParamList = {
  Home: undefined;
  TravelJournal: undefined;
};

type JournalScreenProps = StackScreenProps<RootStackParamList, 'TravelJournal'>;

export default function TravelDiaryScreen({ navigation }: JournalScreenProps) {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [selectedDiaryPost, setSelectedDiaryPost] = useState<Post | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // States for the post form
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [locSearchText, setLocSearchText] = useState('');
  const [location, setLocation] = useState<{ lat: any; lng: any; place_id: any } | null>(null);
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [experienceTypes, setExperienceTypes] = useState<string[]>([]);
  const [price, setPrice] = useState(0);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (!showCreatePost) {
      async function fetchEntries() {
        try {
          const entries = await getJournalEntries();
          setJournalEntries(entries);
        } catch (error) {
          Alert.alert('Error', 'Failed to load your entries.');
        }
      }
      fetchEntries();
    }
  }, [showCreatePost]);

  const handleEntry = async () => {
    const entryData = {
      title, 
      date, 
      location,
      description,
      photoURI: photo,
      experienceTypes,
      price,
      rating,
    };
  
    try {
      await postJournalEntry(entryData);
      setShowCreatePost(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to publish entry. Please try again later.');
    }
  };
  

  // Refresh posts after deletion
  const handleDeletePost = async (postId: string) => {
    try {
      await deleteJournalEntry(postId);
      setSelectedDiaryPost(null); // close the popup

      // refresh the list
      const updatedEntries = await getJournalEntries();
      setJournalEntries(updatedEntries);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete entry.');
    }
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
  }

  const handleSaveEditingPost = async () => {
    if (editingPost) {
      try {
        // delete old post
        await deleteJournalEntry(editingPost.uuid);

        // save edited post
        const entryData = {
          title, 
          date, 
          location,
          description,
          photoURI: photo,
          experienceTypes,
          price,
          rating,
        };
        await postJournalEntry(entryData);

        // update local state with the new post and refresh the list
        const updatedEntries = await getJournalEntries();
        setJournalEntries(updatedEntries);
        setEditingPost(null);
        setShowCreatePost(false);
      } catch (error) {
        Alert.alert('Error', 'Failed to save the edited entry.');
      }
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    setDate(selectedDate);
  };

  const handleLocSearch = async () => {
    if (!locSearchText.trim()) return;
    const foundLocation = await getCoordinates(locSearchText);
    if (foundLocation) {
      setLocation(foundLocation);
    } else {
      Alert.alert('Location not found. This entry will not be displayable on the map as is.');
      setLocation(null);
    }
  };

  const pickPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const toggleExperienceType = (type: string) => {
    if (experienceTypes.includes(type)) {
      setExperienceTypes(experienceTypes.filter(item => item !== type));
    } else {
      setExperienceTypes([...experienceTypes, type]);
    }
  };

  // Profile view
  if (!showCreatePost) {
    return (
      <ScrollView contentContainerStyle={styles.profileContainer}>
        <View style={styles.profileHeader}>
          <Image 
            source={require('../../assets/blank-profile.png')} 
            style={styles.profilePic} 
          />
          <Text style={styles.profileName}>Test Name</Text>
        </View>

        <ProfilePosts
          journalEntries={journalEntries}
          onPostPress={(post: Post) => setSelectedDiaryPost(post)}
          onEditPost={(post: Post) => handleEditPost(post)}
        />

        <TouchableOpacity 
          style={styles.createPostButton} 
          onPress={() => {
            // reset state for new post
            setTitle('');
            setDate(new Date());
            setLocSearchText('');
            setLocation(null);
            setDescription('');
            setPhoto(null);
            setExperienceTypes([]);
            setPrice(0);
            setRating(0);

            setShowCreatePost(true)
          }}
        >
          <Text style={styles.createPostButtonText}>Make an entry</Text>
        </TouchableOpacity>

        {/* Render popup if a post is selected */}
        {selectedDiaryPost && (
          <DiaryPostPopup
            post={selectedDiaryPost}
            onClose={() => setSelectedDiaryPost(null)}
            onDelete={handleDeletePost}
            onEdit={() => {
              setTitle(selectedDiaryPost.title);
              setDate(new Date(selectedDiaryPost.date));
              setLocSearchText(selectedDiaryPost.location ? selectedDiaryPost.location.place_id : '');
              setLocation(selectedDiaryPost.location);
              setDescription(selectedDiaryPost.description);
              setPhoto(selectedDiaryPost.photoURI);
              setExperienceTypes(selectedDiaryPost.experienceTypes || []);
              setPrice(selectedDiaryPost.price);
              setRating(selectedDiaryPost.rating);

              setEditingPost(selectedDiaryPost);
              setShowCreatePost(true);
            }}
          />
        )}
      </ScrollView>
    );
  }

  // Create post form
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitleContainer}>
              {selectedDiaryPost ? 'Editing entry' : 'New entry'}
            </Text>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCreatePost(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.title}
            placeholder="Title"
            placeholderTextColor="#aaa"
            value={title}
            onChangeText={setTitle}
          />

          <View style={styles.dateContainer}>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
              <Text style={styles.dateText}>{date.toDateString()}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="location-outline" size={20} color={location ? "#000" : "#aaa"} style={styles.locIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Location"
              placeholderTextColor="#aaa"
              value={locSearchText}
              onChangeText={setLocSearchText}
              onSubmitEditing={handleLocSearch}
              onBlur={handleLocSearch}
            />
          </View>

          {photo && (
            <Image source={{ uri: photo }} style={styles.photoPreview} />
          )}

          <TouchableOpacity style={styles.photoContainer} onPress={pickPhoto}>
            <Text style={styles.photoContainerLabel}>
              {photo ? 'Change Photo' : 'Select photo'}
            </Text>
          </TouchableOpacity>

          <DescriptionInput
            description={description}
            setDescription={setDescription}
            placeholder="Description"
          />

          <ExperienceTypesSelector
            experienceTypes={experienceTypes}
            toggleExperienceType={toggleExperienceType}
          />

          <PriceInput
            price={price}
            setPrice={setPrice}
          />

          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Ionicons
                    name={star <= rating ? "star" : "star-outline"}
                    size={28}
                    color={star <= rating ? "#E0E5C4" : "#aaa"}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {!selectedDiaryPost ?
            <TouchableOpacity style={styles.postButtonContainer} onPress={handleEntry}>
              <Text style={styles.postButton}>Publish</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity style={styles.postButtonContainer} onPress={handleSaveEditingPost}>
              <Text style={styles.postButton}>Save Edits</Text>
            </TouchableOpacity>
          }
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>

  );
}

const styles = StyleSheet.create({
  // Profile page styles
  profileContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: '#aaa', // placeholder color
    marginBottom: 10,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  createPostButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#1f3b5c',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createPostButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    borderRadius: 10
  },
  // Create post form styles
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 10,
    alignItems: 'center',
  },
  formHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  formTitleContainer: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  cancelButton: {
    padding: 5,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#e74c3c',
  },
  title: {
    fontWeight: 'bold',
    width: '100%',
    height: 50,
    backgroundColor: '#ddd',
    color: '#000',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#ddd',
    color: '#000',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  dateContainer: {
    width: '100%',
    marginBottom: 15,
    borderRadius: 10
  },
  datePickerButton: {
    backgroundColor: '#ddd',
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: 'center',
    borderRadius: 10
  },
  dateText: {
    color: '#000',
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#ddd',
    paddingHorizontal: 15,
    marginBottom: 15,
    borderRadius: 10
  },
  locIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#000',
    fontSize: 16,
  },
  photoPreview: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  photoContainer: {
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000'
  },
  photoContainerLabel: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stars: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  postButtonContainer: {
    width: '100%',
    height: 50,
    backgroundColor: '#C4E0E5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 30,
  },
  postButton: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
