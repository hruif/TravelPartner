import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { createClient, Client } from '@google/maps';

@Injectable()
export class MapsService {
  private client: Client;

  constructor(private readonly httpService: HttpService) {
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

  /*
   * This method will take an incomplete search input and return potential autocomplete results.
   * @param search: string
   */
  async getAutocomplete(input: string) {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${this.client.key}`;
    const response = await this.httpService.get(url).toPromise();
    return response.data;
  }
}
