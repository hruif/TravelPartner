import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Itinerary } from './itinerary.entity';
import { Location } from './location.entity';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

/**
 * Service for handling itinerary and location operations.
 */
@Injectable()
export class ItinerariesService {
    constructor(private readonly em: EntityManager) {}

    //////////// Itinerary Operations ////////////

    /**
     * Retrieves all itineraries.
     *
     * @returns {Promise<Itinerary[]>} An array of itineraries.
     */
    async getAllItineraries(): Promise<Itinerary[]> {
        return await this.em.find(Itinerary, {});
    }

    /**
     * Retrieves a specific itinerary by its unique identifier.
     *
     * @param id - The unique identifier of the itinerary.
     * @returns {Promise<Itinerary>} The itinerary.
     * @throws {NotFoundException} if the itinerary does not exist.
     */
    async getItineraryById(id: string): Promise<Itinerary> {
        const itinerary = await this.em.findOne(Itinerary, { uuid: id });
        if (!itinerary) {
            throw new NotFoundException(`Itinerary with id ${id} not found`);
        }
        return itinerary;
    }

    /**
     * Creates a new itinerary.
     *
     * @param dto - The data for creating the itinerary.
     * @returns {Promise<Itinerary>} The newly created itinerary.
     */
    async createItinerary(dto: CreateItineraryDto): Promise<Itinerary> {
        const itinerary = this.em.create(Itinerary, dto) as Itinerary;
        await this.em.persistAndFlush(itinerary);
        return itinerary;
    }

    /**
     * Updates an existing itinerary.
     *
     * @param id - The unique identifier of the itinerary.
     * @param dto - The data to update the itinerary.
     * @returns {Promise<Itinerary>} The updated itinerary.
     * @throws {NotFoundException} if the itinerary does not exist.
     */
    async updateItinerary(id: string, dto: UpdateItineraryDto): Promise<Itinerary> {
        const itinerary = await this.getItineraryById(id);
        this.em.assign(itinerary, dto);
        await this.em.persistAndFlush(itinerary);
        return itinerary;
    }

    /**
     * Deletes an itinerary.
     *
     * @param id - The unique identifier of the itinerary.
     * @returns {Promise<void>} Void.
     * @throws {NotFoundException} if the itinerary does not exist.
     */
    async deleteItinerary(id: string): Promise<void> {
        const itinerary = await this.getItineraryById(id);
        await this.em.removeAndFlush(itinerary);
    }

    //////////// Location Operations under Itineraries ////////////

    /**
     * Retrieves all locations.
     *
     * @returns {Promise<Location[]>} An array of locations.
     */
    async getAllLocations(): Promise<Location[]> {
        return await this.em.find(Location, {});
    }

    /**
     * Retrieves a specific location by its unique identifier.
     *
     * @param id - The unique identifier of the location.
     * @returns {Promise<Location>} The location.
     * @throws {NotFoundException} if the location does not exist.
     */
    async getLocationById(id: string): Promise<Location> {
        const location = await this.em.findOne(Location, { uuid: id });
        if (!location) {
            throw new NotFoundException(`Location with id ${id} not found`);
        }
        return location;
    }

    /**
     * Creates a new location for an itinerary.
     *
     * @param dto - The data for creating the location.
     * @returns {Promise<Location>} The newly created location.
     * @throws {NotFoundException} if the associated itinerary does not exist.
     */
    async createLocation(dto: CreateLocationDto): Promise<Location> {
        // Retrieve the itinerary using the provided itineraryUuid.
        const itinerary = await this.em.findOne(Itinerary, { uuid: dto.itineraryUuid });
        if (!itinerary) {
            throw new NotFoundException(`Itinerary with id ${dto.itineraryUuid} not found`);
        }

        // Create and persist the location associated with the itinerary.
        const location = this.em.create(Location, {
            photoURI: dto.photoURI,
            title: dto.title,
            description: dto.description,
            formattedAddress: dto.formattedAddress,
            itinerary: itinerary,
            uuid: itinerary.uuid,
        });
        await this.em.persistAndFlush(location);
        return location;
    }

    /**
     * Updates an existing location.
     *
     * @param id - The unique identifier of the location.
     * @param dto - The data to update the location.
     * @returns {Promise<Location>} The updated location.
     * @throws {NotFoundException} if the location does not exist.
     */
    async updateLocation(id: string, dto: UpdateLocationDto): Promise<Location> {
        const location = await this.getLocationById(id);
        this.em.assign(location, dto);
        await this.em.persistAndFlush(location);
        return location;
    }

    /**
     * Deletes a location.
     *
     * @param id - The unique identifier of the location.
     * @returns {Promise<void>} Void.
     * @throws {NotFoundException} if the location does not exist.
     */
    async deleteLocation(id: string): Promise<void> {
        const location = await this.getLocationById(id);
        await this.em.removeAndFlush(location);
    }
}
