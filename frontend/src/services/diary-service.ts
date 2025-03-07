import apiClient from './api-client';

export async function postJournalEntry(entryData: any) {
    const { title, description, photoURI, price, rating, location } = entryData;

    const bodyToSend = {
    title,
    description,
    photoURI,
    price,
    rating,
    momentAddress: location?.someLocationField || "",
    };

  const response = await apiClient.post('/diary/entry', bodyToSend);
  return response.data;
}