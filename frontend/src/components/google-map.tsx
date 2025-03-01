import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

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
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ region, marker }) => {
  const defaultRegion = {
    latitude: -3.745,
    longitude: -38.523,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region || defaultRegion}>
        {marker && (
          <Marker
            coordinate={marker}
            title={"Location"}
            description={"This is the location you searched for."}
          />
        )}
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
