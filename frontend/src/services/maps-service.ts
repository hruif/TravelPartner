import apiClient from './api-client';

export const getCoordinates = async (address: string) => {
    try {
        const response = await apiClient.get(`/maps/geocode?address=${encodeURIComponent(address)}`);
        if (response.data.length > 0) {
            return {
                lat: response.data[0].geometry.location.lat,
                lng: response.data[0].geometry.location.lng,
                place_id: response.data[0].place_id,
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching location data:", error.response?.data?.message || error.message);
        return null;
    }
};  

export const getPlaceDetails = async (placeId: string) => {
    try {
        const response = await apiClient.get(`/maps/place-details?placeId=${encodeURIComponent(placeId)}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching place details:", error.response?.data?.message || error.message);
        return null;
    }
};

export async function getLatLngFromAddress(address: string) {
    const response = await apiClient.get('/maps/geocode', {
      params: { address },
    });
    
    const data = response.data;
    if (data && data.length > 0) {
      const location = data[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    }

    throw new Error('No geocode results found');
};

export async function getFirstImageForItineraryTitle(query: string) {
    const response = await apiClient.get('/maps/search', { params: { query } });
    const data = response.data;
    console.log(data);
    if (data && data.length > 0) {
      const placeId = data[0].place_id;
      if (!placeId) {
        throw new Error('No place_id found in search results');
      }
      const details = await getPlaceDetails(placeId);
      if (details && details.photos && details.photos.length > 0) {
        const firstPhotoRef = details.photos[0].photo_reference;
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${firstPhotoRef}&key=AIzaSyBwDfYSVR0oQWqoFR7hOPgqK_JChCNlSoI`;
      }
      throw new Error('No photos found in place details');
    }
    throw new Error('No search results found');
  }
