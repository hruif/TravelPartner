import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Image,
  Alert, Keyboard, TouchableWithoutFeedback, ScrollView
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { getCoordinates } from '../services/maps-service';
import { postJournalEntry } from '../services/diary-service';

import { DescriptionInput } from '../components/description-input';
import { ExperienceTypesSelector } from '../components/experience-types';
import { PriceInput } from '../components/price-input';

type RootStackParamList = {
  Home: undefined;
  TravelJournal: undefined;
};

type JournalScreenProps = StackScreenProps<RootStackParamList, 'TravelJournal'>;

export default function TravelDiaryScreen({ navigation }: JournalScreenProps) {
  // State for profile page vs create post form
  const [showCreatePost, setShowCreatePost] = useState(false);

  // Fields for the post form
  const [title, setTitle] = useState('');
  const [locSearchText, setLocSearchText] = useState('');
  const [location, setLocation] = useState<{ lat: any; lng: any; place_id: any } | null>(null);
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [experienceTypes, setExperienceTypes] = useState<string[]>([]);
  const [price, setPrice] = useState(0);
  const [rating, setRating] = useState(0);

  // Handle post submission
  const handleEntry = async () => {
    const entryData = {
      photoURI: photo,
      price,
      title,
      description,
      rating,
      location,
      // experienceTypes,
    };

    try {
      await postJournalEntry(entryData);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to post entry. Please try again later.');
    }
  };

  // Process location search query
  const handleLocSearch = async () => {
    if (!locSearchText.trim()) return;
    const foundLocation = await getCoordinates(locSearchText);
    if (foundLocation) {
      setLocation(foundLocation);
    } else {
      Alert.alert('Location not found!');
      setLocation(null);
    }
  };

  // Pick photo from gallery
  const pickPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  // Toggle experience type selection
  const toggleExperienceType = (type: string) => {
    if (experienceTypes.includes(type)) {
      setExperienceTypes(experienceTypes.filter(item => item !== type));
    } else {
      setExperienceTypes([...experienceTypes, type]);
    }
  };

  // Render the profile view if showCreatePost is false
  if (!showCreatePost) {
    return (
      <ScrollView contentContainerStyle={styles.profileContainer}>
        <View style={styles.profileHeader}>
          {/* Filler profile picture */}
          <Image 
            source={require('../../assets/blank-profile.png')} 
            style={styles.profilePic} 
          />
          <Text style={styles.profileName}>Test Name</Text>
        </View>
        <View style={styles.profilePostsSection}>
          <Text style={styles.sectionTitle}>Your Posts</Text>
          {/* Dummy list of posts */}
          <View style={styles.postItem}>
            <Text style={styles.postItemText}>Post 1</Text>
          </View>
          <View style={styles.postItem}>
            <Text style={styles.postItemText}>Post 2</Text>
          </View>
          <View style={styles.postItem}>
            <Text style={styles.postItemText}>Post 3</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.createPostButton} 
          onPress={() => setShowCreatePost(true)}
        >
          <Text style={styles.createPostButtonText}>Create new post!</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // Otherwise, render the create post form with a cancel button at the top right
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formHeader}>
          <Text style={styles.titleContainer}>Make an entry</Text>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowCreatePost(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Title"
          placeholderTextColor="#aaa"
          value={title}
          onChangeText={setTitle}
        />

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#aaa" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Location"
            placeholderTextColor="#aaa"
            value={locSearchText}
            onChangeText={setLocSearchText}
            onSubmitEditing={handleLocSearch}
          />
        </View>

        <DescriptionInput
          description={description}
          setDescription={setDescription}
          placeholder="Description"
        />

        {photo && (
          <Image source={{ uri: photo }} style={styles.photoPreview} />
        )}

        <TouchableOpacity style={styles.photoContainer} onPress={pickPhoto}>
          <Text style={styles.photoContainerLabel}>
            {photo ? 'Change Photo' : 'Select photo'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.experienceTypeLabel}>Experience Types:</Text>
        <ExperienceTypesSelector
          experienceTypes={experienceTypes}
          toggleExperienceType={toggleExperienceType}
        />

        <PriceInput
          price={price}
          setPrice={setPrice}
        />

        <TouchableOpacity style={styles.postButtonContainer} onPress={handleEntry}>
          <Text style={styles.postButton}>Post</Text>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  // Profile page styles
  profileContainer: {
    flexGrow: 1,
    backgroundColor: '#25292e',
    padding: 20,
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#aaa', // placeholder color
    marginBottom: 10,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
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
  createPostButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#28a745',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createPostButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Create post form styles
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#25292e',
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
  titleContainer: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  cancelButton: {
    padding: 5,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#e74c3c',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#3a3f47',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#3a3f47',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  photoPreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 15,
  },
  photoContainer: {
    width: '100%',
    height: 40,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
  },
  photoContainerLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  experienceTypeLabel: {
    color: '#fff',
    marginBottom: 10,
    alignSelf: 'flex-start',
    paddingLeft: 15,
  },
  postButtonContainer: {
    width: '100%',
    height: 50,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 30,
  },
  postButton: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
