import { Injectable } from '@nestjs/common';
import { createClient, Client } from '@google/maps';

@Injectable()
export class GoogleMapsService {
  private client: Client;

  constructor() {
    this.client = createClient({
      key: 'AIzaSyAhNfKERtruky0y7w9K2TjNSufRqxcWBWc',
      Promise: Promise,
    });
  }

  async geocode(address: string) {
    const response = await this.client.geocode({ address }).asPromise();
    return response.json.results;
  }

  async getPlaceDetails(placeId: string) {
    const response = await this.client.place({ placeid: placeId }).asPromise();
    return response.json.result;
  }

  async calculateDistance(origins: string[], destinations: string[]) {
    const response = await this.client.distanceMatrix({
      origins,
      destinations,
    }).asPromise();
    return response.json.rows;
  }
}