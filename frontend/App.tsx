import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView} from 'react-native';
import GoogleMapComponent from './google-map';


export default function App() {
  return (
    <>
      <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>GlobeGram</Text>
      <GoogleMapComponent />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
