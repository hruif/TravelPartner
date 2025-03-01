import apiClient from './api-client';
import { GOOGLE_MAPS_API_KEY } from '@env';

export const getCoordinates = async (address: string) => {
    try {
        const response = await apiClient.get(`/maps/geocode?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`);
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
        const response = await apiClient.get(`/maps/place-details?placeId=${encodeURIComponent(placeId)}&key=${GOOGLE_MAPS_API_KEY}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching place details:", error.response?.data?.message || error.message);
        return null;
    }
};

export const getPlacePhotos = async (placeId: string) => {
    try {
        const response = await apiClient.get(`/maps/place-photos?placeId=${encodeURIComponent(placeId)}&key=${GOOGLE_MAPS_API_KEY}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching place photos:", error.response?.data?.message || error.message);
        return [];
    }
};