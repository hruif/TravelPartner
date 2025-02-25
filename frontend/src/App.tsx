import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/home-screen';
import TravelDiaryScreen from './screens/travel-diary-screen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TravelDiary" component={TravelDiaryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
