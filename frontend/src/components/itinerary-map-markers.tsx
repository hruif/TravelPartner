import { useState, useEffect } from 'react';
import { getItineraryById } from '../services/itinerary-service';
import { getLatLngFromAddress } from '../services/maps-service';

interface MarkerData {
  latitude: number;
  longitude: number;
  title: string;
}

/**
 * A reusable hook that fetches an itinerary by its uuid, builds an array
 * of marker objects (lat, lng, title), and returns both the full itinerary
 * and the marker array. Also exposes a refresh function.
 */
export function useItineraryMarkers(itineraryUuid?: string) {
  const [fetchedItinerary, setFetchedItinerary] = useState<any>(null);
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  async function fetchAndBuildMarkers() {
    if (!itineraryUuid) return;
    try {
      const fullItinerary = await getItineraryById(itineraryUuid);
      setFetchedItinerary(fullItinerary);

      const locations = fullItinerary.locations || [];
      const builtMarkers: MarkerData[] = [];

      for (let i = 0; i < locations.length; i++) {
        const loc = locations[i];
        let lat = Number(loc.latitude);
        let lng = Number(loc.longitude);

        // If lat/lng are not valid, try geocoding from formattedAddress
        if ((!lat || !lng) && loc.formattedAddress) {
          try {
            const coords = await getLatLngFromAddress(loc.formattedAddress);
            lat = coords.lat;
            lng = coords.lng;
          } catch (err) {
            console.error('Failed to get lat/lng for address:', loc.formattedAddress, err);
            continue; // skip this location
          }
        }

        // If we have valid coords, push to the array
        if (lat && lng) {
          builtMarkers.push({
            latitude: lat,
            longitude: lng,
            title: String(i + 1), // label them 1, 2, 3, ...
          });
        }
      }

      setMarkers(builtMarkers);
    } catch (error) {
      console.error('Failed to fetch itinerary details:', error);
    }
  }

  // Run on mount or whenever itineraryUuid changes
  useEffect(() => {
    fetchAndBuildMarkers();
  }, [itineraryUuid]);

  // Expose a refresh function if we want to manually re-fetch
  async function refreshItinerary() {
    await fetchAndBuildMarkers();
  }

  return {
    fetchedItinerary,
    markers,
    refreshItinerary,
  };
}
