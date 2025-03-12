import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface MarkerData {
  latitude: number;
  longitude: number;
  title?: string;
}

interface GoogleMapComponentProps {
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null;
  marker: {
    latitude: number;
    longitude: number;
  } | null;
  itineraryMarkers?: MarkerData[];
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  region,
  marker,
  itineraryMarkers,
}) => {
  const defaultRegion = {
    latitude: -3.745,
    longitude: -38.523,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region || defaultRegion}>
        {/* The single search marker */}
        {marker && (
          <Marker
            coordinate={marker}
            title="Search Result"
            description="This is the location you searched for."
          />
        )}

        {/* The permanent itinerary markers */}
        {itineraryMarkers?.map((m, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: m.latitude, longitude: m.longitude }}
            title={m.title || 'Itinerary Location'}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default GoogleMapComponent;
