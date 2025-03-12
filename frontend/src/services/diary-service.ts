import apiClient from './api-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function postJournalEntry(entryData: any) {
    const { journalName, title, description, photoURI, price, rating, location } = entryData;

    const bodyToSend = {
        journal: journalName,
        photoURI,
        price,
        title,
        description,
        rating,
        formattedAddress: location?.formattedAddress || '',
      }      

  const response = await apiClient.post('/diary/entry', bodyToSend);
  return response.data;
}

export async function getJournalEntries() {
  const savedEntries = await AsyncStorage.getItem('journalEntries');
  if (savedEntries) {
    return JSON.parse(savedEntries);
  } else {
    const response = await apiClient.get('/diary/entries');
    const journalEntries = response.data;
    
    await AsyncStorage.setItem('journalEntries', JSON.stringify(journalEntries));
    
    return journalEntries;
  }
}

export async function deleteJournalEntry(postId: string) {
  await apiClient.delete(`/diary/entry/${postId}`);
  
  const currentEntries = await AsyncStorage.getItem('journalEntries');
  if (currentEntries) {
    const updatedEntries = JSON.parse(currentEntries).filter(entry => entry.uuid !== postId);
    await AsyncStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
  }
}