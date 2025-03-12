import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ItineraryCreationScreen from './itinerary-creation-screen';
import ItineraryDetailsScreen from './itinerary-details-screen';

export type ItineraryStackParamList = {
  ItineraryCreation: undefined;
  ItineraryDetails: { itinerary: any };
};

const ItineraryStack = createNativeStackNavigator<ItineraryStackParamList>();

export default function ItineraryStackScreen() {
  return (
    <ItineraryStack.Navigator screenOptions={{ headerShown: false }}>
      {/* Screen for creating a new itinerary */}
      <ItineraryStack.Screen name="ItineraryCreation" component={ItineraryCreationScreen} />
      {/* Screen for displaying an existing itinerary */}
      <ItineraryStack.Screen name="ItineraryDetails" component={ItineraryDetailsScreen} />
    </ItineraryStack.Navigator>
  );
}
