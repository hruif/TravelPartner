import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import LargePost from '../components/large-post';
import SmallPost from '../components/small-post';
import { getItineraries } from '../services/itinerary-service';
import { getFirstImageForItineraryTitle } from '../services/maps-service';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const [itineraries, setItineraries] = useState([]);
  const [itineraryImages, setItineraryImages] = useState({});

  // Function to fetch itineraries
  const fetchItineraries = async () => {
    try {
      const data = await getItineraries();
      setItineraries(data);
    } catch (error) {
      console.error('Error fetching itineraries:', error);
    }
  };

  // Re-fetch itineraries when screen gains focus
  useFocusEffect(
    useCallback(() => {
      fetchItineraries();
    }, [])
  );

  // After itineraries are fetched, fetch an image for each itinerary title
  useEffect(() => {
    async function fetchImages() {
      const imagesMap = {};
      await Promise.all(
        itineraries.map(async (itinerary) => {
          try {
            const imageUrl = await getFirstImageForItineraryTitle(itinerary.title);
            console.log(`Image for ${itinerary.title}:`, imageUrl); // Debug log
            imagesMap[itinerary.uuid] = imageUrl;
          } catch (error) {
            console.error(`Error fetching image for ${itinerary.title}:`, error);
            // Set a null value so the fallback image is used
            imagesMap[itinerary.uuid] = null;
          }
        })
      );
      setItineraryImages(imagesMap);
      console.log("Itinerary images map:", imagesMap); // Debug log
    }
    if (itineraries.length > 0) {
      fetchImages();
    }
  }, [itineraries]);
  

  const handleItineraryPress = (itinerary) => {
    navigation.navigate('Itinerary', {
      screen: 'ItineraryDetails',
      params: { itinerary },
    });
  };

  return (
    <View>
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
                itineraryId={itinerary.uuid}
                fetchItineraries={fetchItineraries}
                imageSource={
                  itineraryImages[itinerary.uuid]
                    ? { uri: itineraryImages[itinerary.uuid] }
                    : require('../../assets/arundel-england1.jpg')
                }
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
    </View>
  );
}

const styles = StyleSheet.create({
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
