import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LargePost from '../components/large-post';
import SmallPost from '../components/small-post';
import PopupOverlay from '../components/small-post-popup';
import useAuthStore from "../stores/auth.store";

export default function HomeScreen({ navigation }) {
  const { logout } = useAuthStore();
  const [selectedPost, setSelectedPost] = useState(null);

  const handleSmallPostPress = (postTitle) => {
    {/* Still need to grab images from back-end user posts */}
    const images = [
      {}
    ];

    { /* Still need to grab descriptions from back-end user posts */}
    const desc = `List of user-submitted posts for ${postTitle}.`;
    setSelectedPost({
      title: postTitle,
      images: images,
      description: desc,
    });
  };

  return (
    <ImageBackground
      source={require('../../assets/background3.avif')}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Small posts */}
        <View style={styles.smallPostsSection}>
        <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.smallPostsContainer}
        >
          <SmallPost 
            text="Arundel, England" 
            onPress={() => handleSmallPostPress("Arundel, England")} 
            imageSource={require('../../assets/arundel-england1.jpg')}
          />
          <SmallPost 
            text="Italy" 
            onPress={() => handleSmallPostPress("Italy")} 
            imageSource={require('../../assets/italy1.jpg')}
          />
          <SmallPost 
            text="St. Petersburg, Russia" 
            onPress={() => handleSmallPostPress("St. Petersburg, Russia")} 
            imageSource={require('../../assets/spbg-russia1.jpg')}
          />
          <SmallPost 
            text="Norway" 
            onPress={() => handleSmallPostPress("Norway")} 
            imageSource={require('../../assets/norway1.jpg')}
          />
        </ScrollView>

        </View>

        {/* Large posts */}
        <View style={styles.postsContainer}>
          <LargePost 
            imageSource={require('../../assets/vaticancity.jpg')}
            title="Vatican City" 
          />
          <LargePost 
            imageSource={require('../../assets/switzerland1.jpg')}
            title="Switzerland" 
          />
          <LargePost 
            imageSource={require('../../assets/tokyo1.jpg')}
            title="Tokyo" 
          />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="white" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Popups for small posts */}
      <PopupOverlay post={selectedPost} onClose={() => setSelectedPost(null)} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    paddingBottom: 30,
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingTop: 20,
  },
  smallPostsSection: {
    marginTop: 20,
    width: '100%',
  },
  smallPostsContainer: {
    paddingHorizontal: 10,
  },
  postsContainer: {
    marginTop: 38,
    width: '100%',
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
