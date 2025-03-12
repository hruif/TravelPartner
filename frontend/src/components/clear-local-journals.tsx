import AsyncStorage from '@react-native-async-storage/async-storage';

export async function clearLocalJournals() {
  try {
    await AsyncStorage.removeItem('journals');
    await AsyncStorage.removeItem('journalEntries');
    console.log('Local journals cleared.');
  } catch (error) {
    console.error('Error clearing local journals:', error);
  }
}
