import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import LargePost from '../components/large-post';  
import SmallPost from '../components/small-post';

export default function HomeScreen({ navigation }) {
  const { logout } = useAuth(); // Logout function

  return (
    <ImageBackground
      source={require('../../assets/background3.avif')}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Horizontal small posts section */}
        <View style={styles.smallPostsSection}>
          <ScrollView 
            horizontal={true} 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.smallPostsContainer}
          >
            <SmallPost text="Post 1" />
            <SmallPost text="Post 2" />
            <SmallPost text="Post 3" />
          </ScrollView>
        </View>

        {/* Large posts section */}
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
