import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const GoogleMapComponent = () => {
  const initialRegion = {
    latitude: -3.745,
    longitude: -38.523,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
        >
          <Marker
            coordinate={{ latitude: -3.745, longitude: -38.523 }}
            title="Marker Title"
            description="Marker Description"
          />
        </MapView>
      </View>  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'flex-end', 
  },
  mapContainer: {
    width: '100%',
    height: 675,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    flex: 1, 
    borderRadius: 9, 
  },
});

export default GoogleMapComponent;