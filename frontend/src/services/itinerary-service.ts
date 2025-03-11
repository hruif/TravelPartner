import apiClient from './api-client';

export async function postItinerary(entryData: any) {
    const { title, description } = entryData;

    const bodyToSend = {
        title,
        description,
      }      

  const response = await apiClient.post('/itineraries', bodyToSend);
  return response.data;
}

export async function getItineraries() {
    const response = await apiClient.get('/itineraries');
    return response.data;
}

export async function deleteItinerary(postId: string) {
    await apiClient.delete(`/itineraries/${postId}`);
}
