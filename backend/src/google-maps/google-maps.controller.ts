import { Controller, Get, Query } from '@nestjs/common';
import { GoogleMapsService } from './google-maps.service';

@Controller('google-maps')
export class GoogleMapsController {
  constructor(private readonly googleMapsService: GoogleMapsService) {}

  @Get('geocode')
  async geocode(@Query('address') address: string) {
    return this.googleMapsService.geocode(address);
  }

  @Get('search')
  async search(@Query('query') query: string) {
    return this.googleMapsService.searchPlaces(query);
  }

  @Get('place-details')
  async getPlaceDetails(@Query('placeId') placeId: string) {
    return this.googleMapsService.getPlaceDetails(placeId);
  }

  @Get('distance')
  async calculateDistance(
    @Query('origins') origins: string,
    @Query('destinations') destinations: string,
  ) {
    const originsArray = origins.split(',');
    const destinationsArray = destinations.split(',');
    return this.googleMapsService.calculateDistance(originsArray, destinationsArray);
  }
}