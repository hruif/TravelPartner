import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Import screens
import HomeScreen from './home-screen';
import MapScreen from './map-screen';
import TravelDiaryScreen from './travel-diary-screen';

const Tab = createBottomTabNavigator();

export default function MainScreen() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Map') {
                        iconName = focused ? 'map' : 'map-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
                tabBarHideOnKeyboard: true,
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    headerTitle: () => (
                        <Image
                            source={require('../../assets/globegramlogo1.png')}
                            style={{ width: 140, height: 60 }}
                            resizeMode="contain"
                        />
                    ),
                    headerTitleAlign: 'left',

                    /*headerBackground: () => (
                        <LinearGradient
                            colors={['#F0FFFF', '#A7C7E7']}
                            style={{ flex: 1 }}
                        />
                    ),*/
                }}
            />
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Profile" component={TravelDiaryScreen} />
        </Tab.Navigator>
    );
}
