import { Controller, Get, Query } from '@nestjs/common';
import { MapsService } from './maps.service';

@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Get('geocode')
  async geocode(@Query('address') address: string) {
    return this.mapsService.geocode(address);
  }

  @Get('search')
  async search(@Query('query') query: string) {
    return this.mapsService.searchPlaces(query);
  }

  @Get('autocomplete')
  async getAutocomplete(@Query('input') input: string) {
    return this.mapsService.getAutocomplete(input);
  }

  @Get('place-details')
  async getPlaceDetails(@Query('placeId') placeId: string) {
    return this.mapsService.getPlaceDetails(placeId);
  }

  @Get('distance')
  async calculateDistance(
    @Query('origins') origins: string,
    @Query('destinations') destinations: string,
  ) {
    const originsArray = origins.split(',');
    const destinationsArray = destinations.split(',');
    return this.mapsService.calculateDistance(originsArray, destinationsArray);
  }
}
