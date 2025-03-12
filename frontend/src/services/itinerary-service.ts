import apiClient from './api-client';

interface ItineraryEntry {
    title: string;
    description: string;
  }
  
  export async function postItinerary(entryData: ItineraryEntry) {
    const { title, description } = entryData;
    const bodyToSend = { title, description };
  
    try {
      const response = await apiClient.post('/itineraries', bodyToSend);
      return response.data;
    } catch (error) {
      console.error('Error posting itinerary:', error);
      throw error;
    }
  }  

export async function getItineraries() {
    const response = await apiClient.get('/itineraries');
    return response.data;
}

export async function deleteItinerary(postId: string) {
    await apiClient.delete(`/itineraries/${postId}`);
}

export async function getItineraryById(itineraryId: string) {
  const response = await apiClient.get(`/itineraries/${itineraryId}`);
  const data = response.data;
  if (data && data.locations) {
    // Transform each location so that it has an 'id' property based on its uuid
    data.locations = data.locations.map((loc: any) => ({
      ...loc,
      id: loc.uuid,
    }));
  }
  return data;
}


interface AddLocationData {
  photoURI: string;
  title: string;
  description?: string;
  formattedAddress?: string;
}

export async function addLocationToItinerary(itineraryId: string, locationData: AddLocationData) {
  const response = await apiClient.post(`/itineraries/${itineraryId}/location`, locationData);

  return response.data;
}

export async function deleteLocationFromItinerary(itineraryId: string, locationId: string) {
  try {
    const response = await apiClient.delete(
      `/itineraries/${itineraryId}/location/${locationId}`
    );
    return response.data;
  } catch (error) {
    console.error('Failed to delete location from itinerary:', error);
    throw error;
  }
}
