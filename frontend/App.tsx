import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TextInput} from 'react-native';
import GoogleMapComponent from './google-map';


export default function App() {
  return (
    <>
      <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>GlobeGram</Text>
        <TextInput style={styles.searchBar}
          placeholder="Search location..."
          placeholderTextColor="#aaa"
        />
      </View>  
      <GoogleMapComponent/>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 5,
    zIndex: 2,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'gray',
    fontStyle: 'normal',
    letterSpacing: 2,
    marginBottom: 20,
  },
  searchBar: {
    width: '90%',
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },  
});
