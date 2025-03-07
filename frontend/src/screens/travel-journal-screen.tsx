import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Button, 
         Alert, Keyboard, TouchableWithoutFeedback, ScrollView } from "react-native";
import { StackScreenProps } from '@react-navigation/stack';
import { getCoordinates } from "../services/maps-service";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';


type RootStackParamList = {
  Home: undefined;
  TravelJournal: undefined;
};

type JournalScreenProps = StackScreenProps<RootStackParamList, 'TravelJournal'>;

export default function TravelDiaryScreen({navigation}: JournalScreenProps) {
  const [title, setTitle] = useState("");

  const [locSearchText, setLocSearchText] = useState('');
  const [location, setLocation] = useState<{ lat: any; lng: any; place_id: any} | null>(null);
  
  const [description, setDescription] = useState("");
  const [photo, setphoto] = useState(null);
  const [experienceTypes, setExperienceTypes] = useState<string[]>([]);
  const [price, setPrice] = useState(0);
  const [rating, setRating] = useState(0);


  // handle journal entry (post) submission
  const handleEntry = async () => {
    const entryData = {
      title,
      location,
      description,
      photoURI: photo, 
      experienceTypes,
      price,
      rating
    }

    try {
      //await postJournalEntry(entryData); // call API to save entry
      navigation.goBack(); // after posting
    } catch (error) {
      Alert.alert("Error", "Failed to post entry. Please try again later.");
    }
  }

  // process location search query
  const handleLocSearch = async () => {
    if (!locSearchText.trim()) return;

    const location = await getCoordinates(locSearchText);
    if (location) {
      setLocation(location);
    } else {
      Alert.alert("Location not found!");
      setLocation(null);
    }
  };

  // pick photo from gallery
  const pickPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      //aspect: [4, 3], // maintain for android; iOS is always square
      quality: 1,
    });

    if (!result.canceled) {
      setphoto(result.assets[0].uri);
    }
  }

  // select or deselect an experience type
  const toggleExperienceType = (type: string) => {
    if (experienceTypes.includes(type)) { // deselect
      setExperienceTypes(experienceTypes.filter(item => item !== type));
    } else { // select
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
              onSubmitEditing={handleLocSearch} // Trigger search on enter
            />
          </View>

          <TextInput
            style={[styles.descriptionContainer, styles.text]}
            placeholder="Description"
            placeholderTextColor="#aaa"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          {photo && (
            <Image source={{ uri: photo }} style={styles.photoPreview} />
          )}

          <TouchableOpacity style={styles.photoContainer} onPress={pickPhoto}>
            <Text style={styles.photoContainerLabel}>{photo ? "Change Photo" : "Select photo"}</Text>
          </TouchableOpacity>

          <Text style={styles.experienceTypeLabel}>Experience Types:</Text>
          <View style={styles.experienceButtons}>
            {["Active", "Art", "Learning", "Food", "Accommodation", "Indoors", "Outdoors"].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.experienceButton,
                  experienceTypes.includes(type) && styles.selectedButton,
                ]}
                onPress={() => toggleExperienceType(type)}
              >
                <Ionicons
                  name={experienceTypes.includes(type) ? "checkmark" : "add"}
                  size={18}
                  color="#fff"
                  style={styles.experienceIcon}
                />
                <Text style={styles.experienceButtonText}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.priceSymbol}>$</Text>
            <TextInput
              style={styles.priceInput}
              placeholder="Price"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={price.toString()} // convert num to string for text input prop
              onChangeText={(text) => {
                const sanitizedText = text.replace(/[^0-9.]/g, ''); // Allow only numbers & .
                const formattedText = sanitizedText.replace(/(\..*)\./g, '$1'); // Prevent multiple decimals
                setPrice(parseFloat(formattedText) || 0); // convert text back to num
              }}
            />
          </View>

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
    backgroundColor: "#25292e",
    padding: 10,
    alignItems: "center"
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  titleContainer: {
    top: '3%',
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    backgroundColor: "#3a3f47",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10, 
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  locationText: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 10,
  },
  descriptionContainer: {
    width: "100%",
    height: 50,
    backgroundColor: "#3a3f47",
    color: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  text: {
    paddingTop: 10,
    height: 100,
    textAlignVertical: "top",
  },
  photoContainer: {
    width: "100%",
    height: 40,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15,
  },
  photoContainerLabel: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  photoPreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 15
  },
  experienceTypeLabel: {
    color: "#fff",
    marginBottom: 10,
  },
  experienceButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  experienceButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3a3f47",
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
  selectedButton: {
    backgroundColor: "#28a745",
  },
  experienceButtonText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 16,
  },
  experienceIcon: {
    marginRight: 5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    backgroundColor: "#3a3f47",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  priceSymbol: {
    color: "#fff",
    fontSize: 18,
    marginRight: 5,
  },
  priceInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  postButton: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  iconContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '10%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 3,
  },
  journalIconContainer: {
    position: 'absolute',
    bottom: '70%',
    right: '8%',
    width: '10%',
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  mapIconContainer: {
    position: 'absolute',
    bottom: '70%',
    right: '55.5%',
    left: '45.5%',
    width: '10%',
    height: '10%',
    justifyContent: 'center',
    alignItems: "center",
    alignSelf: 'center',
    zIndex: 3,
  },
  budgetIconContainer: {
    position: 'absolute',
    bottom: '70%',
    left: '8%',
    width: '10%',
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  postButtonContainer: {
    top: '3%',
    width: "100%",
    height: 50,
    backgroundColor: "#28a745",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 30
  }
});
