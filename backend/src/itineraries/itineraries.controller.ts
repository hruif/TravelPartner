import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    Query,
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
 * This controller handles CRUD operations for itineraries and also provides sub-routes
 * to manage locations within a specific itinerary.
 */
@Controller('itineraries')
export class ItinerariesController {
    constructor(private readonly itinerariesService: ItinerariesService) {}

    /**
     * Retrieves all itineraries for the authenticated user.
     *
     * @param user The authenticated user retrieved via the token.
     * @returns An array of itineraries.
     */
    @Get()
    async getAllItineraries(@GetUser() user): Promise<Itinerary[]> {
        return this.itinerariesService.getAllItineraries(user.uuid);
    }

    /**
     * Retrieves a specific itinerary by its uuid.
     *
     * @param id The unique identifier of the itinerary.
     * @param user The authenticated user.
     * @returns The itinerary object.
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
     * @param createDto The data transfer object containing itinerary details.
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
     * @param updateDto The data transfer object containing updated itinerary details.
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
     * @returns Void.
     */
    @Delete(':id')
    async deleteItinerary(
        @Param('id') id: string,
        @GetUser() user,
    ): Promise<void> {
        return this.itinerariesService.deleteItinerary(id, user.uuid);
    }

    // --- Location routes nested under itineraries ---

    /**
     * Retrieves all locations for a specific itinerary.
     *
     * @param id The unique identifier of the itinerary.
     * @param user The authenticated user.
     * @returns An array of locations belonging to the itinerary.
     */
    @Get(':id/location')
    async getLocations(
        @Param('id') id: string,
        @GetUser() user,
    ): Promise<Location[]> {
        return this.itinerariesService.getLocationsForItinerary(id, user.uuid);
    }

    /**
     * Retrieves a specific location within an itinerary.
     *
     * @param id The unique identifier of the itinerary.
     * @param locationId The unique identifier of the location.
     * @param user The authenticated user.
     * @returns The location object.
     */
    @Get(':id/location/:locationId')
    async getLocation(
        @Param('id') id: string,
        @Param('locationId') locationId: string,
        @GetUser() user,
    ): Promise<Location> {
        return this.itinerariesService.getLocationById(id, locationId, user.uuid);
    }

    /**
     * Creates a new location within a specific itinerary.
     *
     * @param id The unique identifier of the itinerary.
     * @param createLocationDto The data transfer object containing location details.
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
     * @param updateLocationDto The data transfer object containing updated location details.
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
     * @returns Void.
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
