import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Image, StyleSheet } from 'react-native';

// Import screens
import HomeScreen from './home-screen';
import ProfileScreen from './profile-screen';
import ItineraryScreen from './itinerary-screen';

const Tab = createBottomTabNavigator();

export default function MainScreen() {
  return (
    <Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarShowLabel: false,
    tabBarActiveTintColor: 'tomato',
    tabBarInactiveTintColor: 'gray',
    tabBarHideOnKeyboard: true,
    tabBarIcon: ({ focused, color, size }) => {
      if (route.name === 'Itinerary') {
        return (
          <View style={{ marginTop: 10 }}>
            <View style={styles.mapIconWrapper}>
              <Image 
                source={require('../../assets/logo-circle.png')}
                style={styles.mapIconImage}
              />
            </View>
          </View>
        );
      }
      
      let iconName;
      if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
      else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
      
      return (
        <View style={{ marginTop: 4 }}>
          <Ionicons name={iconName} size={size} color={color} />
        </View>
      );
    },
  })}
>
  <Tab.Screen name="Home" component={HomeScreen} />
  <Tab.Screen name="Itinerary" component={ItineraryScreen} />
  <Tab.Screen name="Profile" component={ProfileScreen} />
</Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  mapIconWrapper: {
    marginTop: 3, 
  },
  mapIconImage: {
    width: 45,  
    height: 45,
    resizeMode: 'contain',
  },
});
