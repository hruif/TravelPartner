import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Button } from "react-native";
import { StackScreenProps } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  TravelDiary: undefined;
};

type DiaryScreenProps = StackScreenProps<RootStackParamList, 'TravelDiary'>;

export default function TravelDiaryScreen({navigation}: DiaryScreenProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  // much of this is still a wip, its just a basic ui to be able to display

  return (
    <View style={styles.container}>
      <Text style={styles.titleContainer}>Create a Post</Text>

      <TextInput
        style={styles.textContainer}
        placeholder="Title"
        placeholderTextColor="#aaa"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.textContainer, styles.text]}
        placeholder="Write a description..."
        placeholderTextColor="#aaa"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity style={styles.imageContainer}>
        <Text style={styles.image}>Select an Image</Text>
      </TouchableOpacity>

      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
      )}

      <TouchableOpacity style={styles.postButtonContainer}>
        <Text style={styles.postButton}>Post</Text>
      </TouchableOpacity>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    padding: 20,
    alignItems: "center",
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
  },
  titleContainer: {
    top: '3%',
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  textContainer: {
    top: '3%',
    width: "100%",
    height: 50,
    backgroundColor: "#3a3f47",
    color: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  imageContainer: {
    top: '3%',
    width: "100%",
    height: 50,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15,
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
  diaryIconContainer: {
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
  text: {
    top: '3%',
    height: 100,
    textAlignVertical: "top",
  },
  image: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  postButton: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  Icon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
});
