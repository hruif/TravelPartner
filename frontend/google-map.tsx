import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface GoogleMapComponentProps {
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ region }) => {
  const [title, setTitle] = useState('Marker Title');
  const [description, setDescription] = useState('Marker Description');
  const [isEditing, setIsEditing] = useState(false);

  const defaultRegion = {
    latitude: -3.745,
    longitude: -38.523,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const dismissKeyboard = () => {
    setIsEditing(false);
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <MapView style={styles.map} initialRegion={defaultRegion}>
          <Marker
            coordinate={{ latitude: -3.745, longitude: -38.523 }}
            title={title}
            description={description}
            onPress={() => setIsEditing(true)}
          />
        </MapView>
        {isEditing && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter Marker Title"
            />
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter Marker Description"
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
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
  inputContainer: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    width: '90%',
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 5,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    flex: 1, 
    borderRadius: 9, 
  },
});

export default GoogleMapComponent;