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
    const response = await this.client.distanceMatrix({
      origins,
      destinations,
    }).asPromise();
    return response.json.rows;
  }
}