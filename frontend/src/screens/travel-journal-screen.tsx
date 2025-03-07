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
  const [title, setTitle] = useState('');
  const [locSearchText, setLocSearchText] = useState('');
  const [location, setLocation] = useState<{ lat: any; lng: any; place_id: any } | null>(null);
  
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [experienceTypes, setExperienceTypes] = useState<string[]>([]);
  const [price, setPrice] = useState(0);
  const [rating, setRating] = useState(0);

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

  const toggleExperienceType = (type: string) => {
    if (experienceTypes.includes(type)) {
      setExperienceTypes(experienceTypes.filter(item => item !== type));
    } else {
      setExperienceTypes([...experienceTypes, type]);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        <Text style={styles.titleContainer}>Make an entry</Text>

        <TextInput
          style={styles.descriptionContainer}
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
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#25292e',
    padding: 10,
    alignItems: 'center',
  },
  titleContainer: {
    top: '3%',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  descriptionContainer: {
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
  },
  postButtonContainer: {
    top: '3%',
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
