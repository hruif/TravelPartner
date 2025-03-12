import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

export interface MarkerData {
  latitude: number;
  longitude: number;
  title?: string;
}

export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface GoogleMapComponentProps {
  region?: Region | null;
  defaultRegion?: Region | null;
  marker?: {
    latitude: number;
    longitude: number;
  } | null;
  itineraryMarkers?: MarkerData[];
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  region,
  defaultRegion,
  marker,
  itineraryMarkers,
}) => {
  const hardCodedDefaultRegion: Region = {
    latitude: -3.745,
    longitude: -38.523,
    latitudeDelta: 5.0,      // Zoomed out default
    longitudeDelta: 5.0,     // Zoomed out default
  };

  const finalRegion = region ?? defaultRegion ?? hardCodedDefaultRegion;

  const polylineCoordinates = itineraryMarkers?.map((m) => ({
    latitude: m.latitude,
    longitude: m.longitude,
  }));

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={finalRegion}>
        {marker && (
          <Marker
            coordinate={marker}
            tracksViewChanges={false}
            title="Search Result"
          >
            <View style={styles.searchMarker}>
              <Text style={styles.searchMarkerText}>S</Text>
            </View>
          </Marker>
        )}

        {itineraryMarkers?.map((m, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: m.latitude, longitude: m.longitude }}
            tracksViewChanges={false}
          >
            <View style={styles.itineraryMarker}>
              <Text style={styles.itineraryMarkerText}>
                {m.title ?? String(index + 1)}
              </Text>
            </View>
          </Marker>
        ))}

        {polylineCoordinates && polylineCoordinates.length > 1 && (
          <Polyline
            coordinates={polylineCoordinates}
            strokeColor="#2980b9"
            strokeWidth={3}
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
  searchMarker: {
    backgroundColor: 'white',
    borderColor: '#d35400',
    borderWidth: 3,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchMarkerText: {
    color: '#d35400',
    fontWeight: 'bold',
  },
  itineraryMarker: {
    backgroundColor: 'white',
    borderColor: '#2980b9',
    borderWidth: 3,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itineraryMarkerText: {
    color: '#2980b9',
    fontWeight: 'bold',
  },
});

export default GoogleMapComponent;
