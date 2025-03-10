import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
} from '@nestjs/common';
import { ItinerariesService } from './itineraries.service';
import { Itinerary } from './itinerary.entity';
import { Location } from './location.entity';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { GetUser } from '../auth/get-user.decorator';

/**
 * Controller for itinerary endpoints.
 *
 * This controller handles CRUD operations for itineraries and provides nested location
 * operations under a specific itinerary. The GET endpoints for locations are removed,
 * and locations are returned as part of the itinerary object.
 */
@Controller('itineraries')
export class ItinerariesController {
    constructor(private readonly itinerariesService: ItinerariesService) {}

    /**
     * Retrieves all itineraries for the authenticated user.
     * Each itinerary will include its associated locations.
     *
         * @param user The authenticated user.
     * @returns An array of itineraries with nested locations.
     */
    @Get()
    async getAllItineraries(@GetUser() user): Promise<Itinerary[]> {
        return this.itinerariesService.getAllItineraries(user.uuid);
    }

    /**
     * Retrieves a specific itinerary by its uuid.
     * The returned itinerary includes its associated locations.
     *
     * @param id The unique identifier of the itinerary.
     * @param user The authenticated user.
     * @returns The itinerary object with nested locations.
     */
    @Get(':id')
    async getItinerary(
        @Param('id') id: string,
        @GetUser() user,
    ): Promise<Itinerary> {
        return this.itinerariesService.getItineraryById(id, user.uuid);
    }

    /**
     * Creates a new itinerary.
     *
     * @param createDto The DTO containing itinerary details.
     * @param user The authenticated user.
     * @returns The newly created itinerary.
     */
    @Post()
    async createItinerary(
        @Body() createDto: CreateItineraryDto,
        @GetUser() user,
    ): Promise<Itinerary> {
        return this.itinerariesService.createItinerary(createDto, user.uuid);
    }

    /**
     * Updates an existing itinerary.
     *
     * @param id The unique identifier of the itinerary.
     * @param updateDto The DTO containing updated itinerary details.
     * @param user The authenticated user.
     * @returns The updated itinerary.
     */
    @Put(':id')
    async updateItinerary(
        @Param('id') id: string,
        @Body() updateDto: UpdateItineraryDto,
        @GetUser() user,
    ): Promise<Itinerary> {
        return this.itinerariesService.updateItinerary(id, updateDto, user.uuid);
    }

    /**
     * Deletes an itinerary.
     *
     * @param id The unique identifier of the itinerary.
     * @param user The authenticated user.
     * @returns void.
     */
    @Delete(':id')
    async deleteItinerary(
        @Param('id') id: string,
        @GetUser() user,
    ): Promise<void> {
        return this.itinerariesService.deleteItinerary(id, user.uuid);
    }

    // --- Location operations ---

    /**
     * Creates a new location within a specific itinerary.
     *
     * @param id The unique identifier of the itinerary.
     * @param createLocationDto The DTO containing location details.
     * @param user The authenticated user.
     * @returns The newly created location.
     */
    @Post(':id/location')
    async createLocation(
        @Param('id') id: string,
        @Body() createLocationDto: CreateLocationDto,
        @GetUser() user,
    ): Promise<Location> {
        return this.itinerariesService.createLocation(id, createLocationDto, user.uuid);
    }

    /**
     * Updates an existing location within an itinerary.
     *
     * @param id The unique identifier of the itinerary.
     * @param locationId The unique identifier of the location.
     * @param updateLocationDto The DTO containing updated location details.
     * @param user The authenticated user.
     * @returns The updated location.
     */
    @Put(':id/location/:locationId')
    async updateLocation(
        @Param('id') id: string,
        @Param('locationId') locationId: string,
        @Body() updateLocationDto: UpdateLocationDto,
        @GetUser() user,
    ): Promise<Location> {
        return this.itinerariesService.updateLocation(id, locationId, updateLocationDto, user.uuid);
    }

    /**
     * Deletes a location from an itinerary.
     *
     * @param id The unique identifier of the itinerary.
     * @param locationId The unique identifier of the location.
     * @param user The authenticated user.
     * @returns void.
     */
    @Delete(':id/location/:locationId')
    async deleteLocation(
        @Param('id') id: string,
        @Param('locationId') locationId: string,
        @GetUser() user,
    ): Promise<void> {
        return this.itinerariesService.deleteLocation(id, locationId, user.uuid);
    }
}
