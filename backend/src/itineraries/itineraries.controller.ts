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
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

/**
 * Controller for itinerary endpoints.
 */
@Controller('itineraries')
export class ItinerariesController {
    constructor(private readonly itinerariesService: ItinerariesService) {}

    //////////// Itinerary Endpoints ////////////

    /**
     * Retrieves all itineraries.
     *
     * @returns {Promise<Itinerary[]>} An array of itineraries.
     */
    @Get()
    async getAllItineraries(): Promise<Itinerary[]> {
        return this.itinerariesService.getAllItineraries();
    }

    /**
     * Retrieves a specific itinerary by its id.
     *
     * @param id The unique identifier of the itinerary.
     * @returns {Promise<Itinerary>} The itinerary.
     * @throws {404} If itinerary not found.
     */
    @Get(':id')
    async getItinerary(@Param('id') id: string): Promise<Itinerary> {
        return this.itinerariesService.getItineraryById(id);
    }

    /**
     * Creates a new itinerary.
     *
     * @param dto The data for creating the itinerary.
     * @returns {Promise<Itinerary>} The newly created itinerary.
     */
    @Post()
    async createItinerary(
        @Body() dto: CreateItineraryDto,
    ): Promise<Itinerary> {
        return this.itinerariesService.createItinerary(dto);
    }

    /**
     * Updates an existing itinerary.
     *
     * @param id The unique identifier of the itinerary.
     * @param dto The data to update the itinerary.
     * @returns {Promise<Itinerary>} The updated itinerary.
     * @throws {404} If itinerary not found.
     */
    @Put(':id')
    async updateItinerary(
        @Param('id') id: string,
        @Body() dto: UpdateItineraryDto,
    ): Promise<Itinerary> {
        return this.itinerariesService.updateItinerary(id, dto);
    }

    /**
     * Deletes an itinerary.
     *
     * @param id The unique identifier of the itinerary.
     * @returns {Promise<void>} Void.
     * @throws {404} If itinerary not found.
     */
    @Delete(':id')
    async deleteItinerary(@Param('id') id: string): Promise<void> {
        return this.itinerariesService.deleteItinerary(id);
    }

    //////////// Location Endpoints under /itineraries/location ////////////

    /**
     * Retrieves all locations for itineraries.
     *
     * @returns {Promise<any[]>} An array of locations.
     */
    @Get('location')
    async getAllLocations(): Promise<any[]> {
        return this.itinerariesService.getAllLocations();
    }

    /**
     * Retrieves a specific location by its id.
     *
     * @param id The unique identifier of the location.
     * @returns {Promise<any>} The location.
     * @throws {404} If location not found.
     */
    @Get('location/:id')
    async getLocation(@Param('id') id: string): Promise<any> {
        return this.itinerariesService.getLocationById(id);
    }

    /**
     * Creates a new location for an itinerary.
     *
     * @param dto The data for creating the location.
     * @returns {Promise<any>} The newly created location.
     */
    @Post('location')
    async createLocation(
        @Body() dto: CreateLocationDto,
    ): Promise<any> {
        return this.itinerariesService.createLocation(dto);
    }

    /**
     * Updates an existing location.
     *
     * @param id The unique identifier of the location.
     * @param dto The data to update the location.
     * @returns {Promise<any>} The updated location.
     * @throws {404} If location not found.
     */
    @Put('location/:id')
    async updateLocation(
        @Param('id') id: string,
        @Body() dto: UpdateLocationDto,
    ): Promise<any> {
        return this.itinerariesService.updateLocation(id, dto);
    }

    /**
     * Deletes a location.
     *
     * @param id The unique identifier of the location.
     * @returns {Promise<void>} Void.
     * @throws {404} If location not found.
     */
    @Delete('location/:id')
    async deleteLocation(@Param('id') id: string): Promise<void> {
        return this.itinerariesService.deleteLocation(id);
    }
}
