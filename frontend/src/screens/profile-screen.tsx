import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Modal,
  Alert, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, ScrollView, Platform
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Ionicons } from '@expo/vector-icons';

import { getCoordinates } from '../services/maps-service';
import { postJournalEntry, getJournalEntries, deleteJournalEntry } from '../services/diary-service';

import { DescriptionInput } from '../components/description-input';
import { ExperienceTypesSelector } from '../components/experience-types';
import { PriceInput } from '../components/price-input';

import { ProfilePosts, Post } from '../components/profile-posts';

import useAuthStore from "../stores/auth.store";
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../services/api-client';
import { clearLocalJournals } from '../components/clear-local-journals';

type RootStackParamList = {
  Home: undefined;
  TravelJournal: undefined;
};

type JournalScreenProps = StackScreenProps<RootStackParamList, 'TravelJournal'>;

export default function TravelDiaryScreen({ navigation }: JournalScreenProps) {
  const { logout } = useAuthStore();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [journalEntries, setJournalEntries] = useState<any[]>([]);

  const [journals, setJournals] = useState<any[]>([]);
  const [selectedJournal, setSelectedJournal] = useState(journals[0]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newJournalName, setNewJournalName] = useState('');
  const [entries, setEntries] = useState<{ [journal: string]: any[] }>({});

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

      const loadJournals = async () => {
        const storedJournals = await AsyncStorage.getItem('journals');
        if (storedJournals) {
          const parsedJournals = JSON.parse(storedJournals)
          setJournals(parsedJournals); 
          if (parsedJournals.length > 0 && !selectedJournal) {
            setSelectedJournal(parsedJournals[0]);
          } 
        }
      };
      loadJournals(); 
    }
  }, [showCreatePost]);

  // to be implemented
  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing not implemented yet.');
  };

  const handleNewJournal = async () => {
    const newJournal = newJournalName; 
    
    let currentJournals = await AsyncStorage.getItem('journals');
    currentJournals = currentJournals ? JSON.parse(currentJournals) : [];

    currentJournals.push(newJournal);
    await AsyncStorage.setItem('journals', JSON.stringify(currentJournals));

    setJournals(currentJournals);

    setIsModalVisible(false);
    setNewJournalName('');
  };

  const handleEntry = async () => {
    if (!selectedJournal) return; // later make it so if journal exists, always select leftmost as default
    const entryData = {
      journalName: selectedJournal,
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
      const createdEntry = await postJournalEntry(entryData);
      
      const currentEntries = await AsyncStorage.getItem('journalEntries');
      const updatedEntries = currentEntries ? JSON.parse(currentEntries) : [];

      updatedEntries.push(createdEntry);
      await AsyncStorage.setItem('journalEntries', JSON.stringify(updatedEntries));

      setJournalEntries(updatedEntries);

      setTitle('');
      setDescription('');
      setPhoto(null);
      setPrice(0);
      setRating(0);
      setLocation(null);
      setShowCreatePost(false);
    } catch (error) {
      console.error('Error posting journal entry:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to publish entry. Please try again later.');
    }
  };
  
  const handleDeletePost = async (postId: string) => {
    try {
      await deleteJournalEntry(postId);
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
          journalName: selectedJournal,
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
              onPress={() => setIsModalVisible(true)}
            >
              <Ionicons name="book-outline" size={24} color="black" />
              <Text style={styles.newButtonText}>New journal</Text>
            </TouchableOpacity>

            {journals.map((journal, index) => (
              <TouchableOpacity 
                key={index} 
                onPress={() => setSelectedJournal(journal)} 
                style={styles.journalItem}
              >
                <Text style={[selectedJournal === journal && { fontWeight: 'bold' }]}>
                  {journal}
                </Text>
              </TouchableOpacity>
            ))}
        
          </ScrollView>
        </View>

        <Modal visible={isModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput 
                placeholder="Journal Name"
                value={newJournalName}
                onChangeText={setNewJournalName}
                style={styles.modalInput}
              />
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity onPress={handleNewJournal} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Create</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.horizontalLine} />

        {/*there's a default selected journal anyways though*/} 
        {selectedJournal && ( 
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

              setShowCreatePost(true);
            }}
          >
            <Ionicons name="pencil-outline" size={24} color="black" />
            <Text style={styles.newButtonText}>Make an entry</Text>
          </TouchableOpacity>
        )}

        <ProfilePosts
          journalEntries={journalEntries}
          selectedJournal={selectedJournal}
          onDelete={handleDeletePost}
          onEdit={handleEditPost}
        />

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="white" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity 
            style={styles.clearButton} 
            onPress={async () => {
              await clearLocalJournals();
              // Optionally, also clear your local state if needed:
              setJournals([]);
              setJournalEntries([]);
            }}
          >
            <Text style={styles.clearButtonText}>Clear Local Journals</Text>
          </TouchableOpacity>

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
              onPress={() => {
                setShowCreatePost(false);
                setEditingPost(null);
              }}
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalInput: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#D0DAAC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  modalButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  horizontalLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3', // Light grey color
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
  clearButton: {
    alignSelf: 'flex-start',
    padding: 5,
    marginVertical: 10,
  },
  clearButtonText: {
    fontSize: 12,
    color: '#555',
    textDecorationLine: 'underline',
  },
});
