import apiClient from './api-client';

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
    const response = await apiClient.get('/diary/entries');
    return response.data;
}

export async function deleteJournalEntry(postId: string) {
    await apiClient.delete(`/diary/entry/${postId}`);
}
