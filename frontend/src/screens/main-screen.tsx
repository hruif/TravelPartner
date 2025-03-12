import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Image, StyleSheet } from 'react-native';

import HomeScreen from './home-screen';
import ProfileScreen from './profile-screen';
import ItineraryStackScreen from './itinerary-stack'; 

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

          let iconName: any;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return (
            <View style={{ marginTop: 4 }}>
              <Ionicons name={iconName} size={size} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Itinerary"
        component={ItineraryStackScreen}
        options={{
          tabBarStyle: { display: 'none' },
          headerShown: false,
        }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            // Prevent the default tab press behavior
            e.preventDefault();
            // Always navigate to the creation screen when the tab is pressed
            navigation.navigate('Itinerary', { screen: 'ItineraryCreation' });
          },
        })}
      />
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
