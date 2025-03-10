import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Image,
  Alert, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, ScrollView, Platform, FlatList, Button
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

import useAuthStore from "../stores/auth.store";

type RootStackParamList = {
  Home: undefined;
  TravelJournal: undefined;
};

type JournalScreenProps = StackScreenProps<RootStackParamList, 'TravelJournal'>;

export default function TravelDiaryScreen({ navigation }: JournalScreenProps) {
  const { logout } = useAuthStore();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [journalEntries, setJournalEntries] = useState<any[]>([]);

  // not in use yet
  //const [journalColl, setJournalColl] = useState<any[]>([]);
  //const [heldJournal, setHeldJournal] = useState(null);
  //const [showJournalOptions, setShowJournalOptions] = useState(false);
  //const [selectedJournal, setSelectedJournal] = useState(journalColl[0]);

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

  // to be implemented
  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing not implemented yet.');
  };

   // not in use yet; currently hard coding instead of using journal coll
  const handleNewJournal = () => {
  //   const newJournal = {
  //     uuid: Math.random().toString(), // elaborate later
  //     title: 'New Journal',
  //   };

  //   setJournalColl((prevColl) => [newJournal, ...prevColl]); 
  };

  // not in use yet
  // const handleJournalClick = (journalName: string) => {
  //   setSelectedJournal(journalName === selectedJournal ? null : journalName);
  // };

  // not in use yet
  // const handleLongPress = (journal) => {
  //   setHeldJournal(journal);
  //   setShowJournalOptions(true);
  // };

  // not in use yet
  // const handleTapOutside = () => {
  //   setHeldJournal(null);
  //   setShowJournalOptions(false);
  // };

  // not in use yet
  // const renameJournal = (journal) => {
  //   const newName = prompt('Enter new journal name:'); // change to modal later
  //   if (newName) {
  //     const updatedJournals = journalColl.map((item) => 
  //       item.uuid === journal.uuid ? { ...item, name: newName } : item
  //     );
  //     setJournalColl(updatedJournals); // update state to trigger re-render
  //   }
  // };

  // not in use yet
  // const deleteJournal = (journal) => {
  //   const updatedJournals = journalColl.filter((item) => item.uuid !== journal.uuid);
  //   setJournalColl(updatedJournals); 
  // };

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
      setEditingPost(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to publish entry. Please try again later.');
    }
  };
  

  // Refresh posts after deletion
  const handleDeletePost = async (postId: string) => {
    try {
      await deleteJournalEntry(postId);

      // refresh the list
      const updatedEntries = await getJournalEntries();
      setJournalEntries(updatedEntries);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete entry.');
    }
  };

  const handleEditPost = (post: Post) => {
    setTitle(post.title);
    setDate(new Date(post.date));
    setLocSearchText(post.location ? post.location.place_id : '');
    setLocation(post.location);
    setDescription(post.description);
    setPhoto(post.photoURI);
    setExperienceTypes(post.experienceTypes);
    setPrice(post.price);
    setRating(post.rating);

    setEditingPost(post);
    setShowCreatePost(true);
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
    setDate(selectedDate);
    setShowDatePicker(false);
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
    console.log('experience types before toggle', {experienceTypes});
    if (!experienceTypes) {
      return;
    }
    if (experienceTypes && experienceTypes.includes(type)) { // selected
      setExperienceTypes(experienceTypes.filter(item => item !== type)); // deselect
    } else {
      setExperienceTypes([...experienceTypes, type]);
    }
    console.log('experience types after toggle', {experienceTypes});
    const shouldbe = [...experienceTypes, type]
    console.log('should be', {shouldbe});
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

          <View style={styles.userInfo}>
            <Text style={styles.profileName}>Test Name</Text>

            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>n</Text> {/*implement counts later*/}
                <Text style={styles.statLabel}>trips</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>m</Text>
                <Text style={styles.statLabel}>entries</Text>
              </View>
            </View>
          </View>
        </View>

        <Text>🪺 Originally from Portland, OR </Text> {/*implement later: make customizable in edit profile*/}
        <Text>📍 Currently in Seattle, WA</Text> {/*implement later: make customizable in edit profile*/}

        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={handleEditProfile}
        >
          <Text style={styles.editProfileButtonText}>Edit profile</Text>
        </TouchableOpacity>

        <View style={styles.journalRow}>
          <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.journalNamesContainer}
          >
            <TouchableOpacity
              style={[styles.newButton, {backgroundColor:'#A6D7E0'}]}
              onPress={handleNewJournal}
            >
              <Ionicons name="book-outline" size={24} color="black" />
              <Text style={styles.newButtonText}>New journal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.journalItem}>
              <Text style = {{fontWeight: 'bold'}}>Trip 3</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.journalItem}>
              <Text>Trip 2</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.journalItem}>
              <Text>Trip 1</Text>
            </TouchableOpacity>

          </ScrollView>

        </View>

        <View style={styles.horizontalLine} />

        <TouchableOpacity 
          style={[styles.newButton, { backgroundColor: '#C4E0E5' }]} 
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
          <Ionicons name="pencil-outline" size={24} color="black" />
          <Text style={styles.newButtonText}>Make an entry</Text>
        </TouchableOpacity>


        <ProfilePosts
          journalEntries={journalEntries}
          onDelete={handleDeletePost}
          onEdit={handleEditPost}
        />

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="white" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Render popup if a post is selected */}
        {selectedDiaryPost && (
          <DiaryPostPopup
            post={selectedDiaryPost}
            onClose={() => setSelectedDiaryPost(null)}
            onDeletePost={handleDeletePost}
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
              {editingPost ? 'Editing entry' : 'New entry'}
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
                <TouchableOpacity key={star} onPress={() => setRating(star)} style={styles.starContainer}>
                  {star <= rating ? (
                    <Text style={{ fontSize: 28 }}>⭐</Text> 
                  ) : (
                    <Ionicons name="star-outline" size={28} color="#aaa" /> 
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {!editingPost ?
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
    flexDirection: 'column',
    flexGrow: 1,
    padding: 20,
    alignItems: 'flex-start',
    marginBottom: 30
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%'
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: '#aaa', // placeholder color
    marginRight: 30,
  },
  userInfo: {
    flex: 3, // allows text section to take remaining space
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBox: {
    alignItems: 'flex-start',
    marginRight: 40, // space between "trips" and "entries"
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 14,
    color: '#000',
  },
  editProfileButton: {
    marginTop: 20,
    width: '100%',
    height: 35,
    backgroundColor: '#DAE7C4',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editProfileButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  journalRow: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    paddingVertical: 5,  
    paddingHorizontal: 15, 
    height: 35, 
    borderRadius: 10,
    marginRight: 10,  
    gap: 10 // space btwn icon, text
  },
  newButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center', // Helps with vertical centering
  },
  journalNamesContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  journalItem: {
    fontSize: 14,
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  horizontalLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3', // Light grey color
    //marginTop: 10,
    marginBottom: 20,
    width: '100%', // Ensures it takes the full width of the screen
  },
  // Create post form styles
  scrollContainer: {
    flexGrow: 1,
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
  starContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 28, 
    width: 28, 
    textAlignVertical: 'center',
    marginBottom: 15
  },
  postButtonContainer: {
    width: '100%',
    height: 50,
    backgroundColor: '#D0DAAC',
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
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
