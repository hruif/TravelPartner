import { Injectable } from '@nestjs/common';
import { createClient, Client } from '@google/maps';

@Injectable()
export class MapsService {
  private client: Client;

  constructor() {
    this.client = createClient({
      key: process.env.GOOGLE_PLACES_API_KEY || '',
      Promise: Promise,
    });
  }

  /*
   * This method will take an address and return the geocode of that address.
   * @param address: string
   */
  async geocode(address: string) {
    const response = await this.client.geocode({ address }).asPromise();
    return response.json.results;
  }

  /*
   * This method will take a placeId and return the details of that place.
   * @param placeId: string
   */
  async getPlaceDetails(placeId: string) {
    const response = await this.client.place({ placeid: placeId }).asPromise();
    return response.json.result;
  }

  /*
   * This method will take an array of origins and destinations and return the distance between them.
   * @param origins: string[]
   * @param destinations: string[]
   */
  async calculateDistance(origins: string[], destinations: string[]) {
    const response = await this.client
      .distanceMatrix({
        origins,
        destinations,
      })
      .asPromise();
    return response.json.rows;
  }

  /*
   * This method will perform a text-based search for places matching a given query.
   * Example: "Spicy Vegetarian Food in Sydney, Australia"
   * @param query: string
   */
  async searchPlaces(query: string) {
    const response = await this.client
      .places({
        query,
      })
      .asPromise();

    return response.json.results;
  }

  /**
   * Get photos for a specific place by place ID
   * @param placeId: string
   */
  async getPlacePhotos(placeId: string, clientApiKey?: string) {
    try {
      // Use the provided API key or fall back to environment variable
      const apiKey = clientApiKey || process.env.GOOGLE_PLACES_API_KEY;
      
      if (!apiKey) {
        console.error('No API key available for Google Maps');
        return [];
      }
      
      console.log(`Using API key (first 4 chars): ${apiKey.substring(0, 4)}...`);
      
      // Create a client with the API key
      const client = createClient({
        key: apiKey,
        Promise: Promise,
      });
      
      const place = await client.place({
        placeid: placeId,
        fields: ['photo']
      }).asPromise();
      
      if (!place.json.result.photos) {
        return [];
      }
      
      // Get photo references and construct URLs
      const photoUrls = place.json.result.photos.map(photo => {
        const ref = photo.photo_reference;
        return `${process.env.API_URL || 'http://localhost:3000'}/maps/photo?photoreference=${ref}&maxwidth=400&key=${apiKey}`;
      });
      
      return photoUrls;
    } catch (error) {
      console.error('Error fetching place photos:', error);
      return [];
    }
  }

  /**
   * Proxy Google Photos API to protect API key
   * @param photoReference: string
   * @param maxWidth: string
   */
  async getPhoto(photoReference: string, maxWidth: string) {
    try {
      const response = await this.client.placesPhoto({
        photoreference: photoReference,
        maxwidth: parseInt(maxWidth, 10) || 400,
      }).asPromise();
      
      return response.data;
    } catch (error) {
      console.error('Error fetching photo:', error);
      throw error;
    }
  }
}
