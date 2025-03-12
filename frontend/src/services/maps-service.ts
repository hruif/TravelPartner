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
  }
