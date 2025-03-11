import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LargePost from '../components/large-post';
import SmallPost from '../components/small-post';
import PopupOverlay from '../components/small-post-popup';
import { getItineraries } from '../services/itinerary-service';

export default function HomeScreen({ navigation }) {
  const [itineraries, setItineraries] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  // Fetch itineraries on mount
  useEffect(() => {
    async function fetchItineraries() {
      try {
        const data = await getItineraries();
        setItineraries(data);
      } catch (error) {
        console.error('Error fetching itineraries:', error);
      }
    }
    fetchItineraries();
  }, []);

  const handleItineraryPress = (itinerary) => {
  navigation.navigate('Itinerary', {
    screen: 'ItineraryDetails',
    params: { itinerary },
  });
};

  return (
    <View
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Small posts */}
        <View style={styles.smallPostsSection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.smallPostsContainer}
          >
            {itineraries.map((itinerary) => (
              <SmallPost 
                key={itinerary.uuid}
                text={itinerary.title}
                onPress={() => handleItineraryPress(itinerary)}
                // Optionally, if your SmallPost supports imageSource, you could pass an image too
              />
            ))}
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
      </ScrollView>

      {/* Popups for small posts */}
      <PopupOverlay post={selectedPost} onClose={() => setSelectedPost(null)} />
    </View>
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
});
