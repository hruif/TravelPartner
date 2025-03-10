import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Itinerary } from './itinerary.entity';
import { Location } from './location.entity';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { User } from '../users/user.entity';

/**
 * Service for handling itinerary operations.
 *
 * This service manages CRUD operations for itineraries and nested locations.
 */
@Injectable()
export class ItinerariesService {
    constructor(private readonly em: EntityManager) {}

    /**
     * Retrieves all itineraries for the authenticated user.
     *
     * @param userUuid - The uuid of the authenticated user.
     * @returns An array of itineraries.
     */
    async getAllItineraries(userUuid: string): Promise<Itinerary[]> {
        return await this.em.find(Itinerary, { user: { uuid: userUuid } });
    }

    /**
     * Retrieves a specific itinerary by its unique identifier.
     *
     * @param id - The unique identifier of the itinerary.
     * @param userUuid - The uuid of the authenticated user.
     * @returns The itinerary.
     * @throws {NotFoundException} if the itinerary does not exist.
     * @throws {UnauthorizedException} if the itinerary does not belong to the user.
     */
    async getItineraryById(id: string, userUuid: string): Promise<Itinerary> {
        const itinerary = await this.em.findOne(Itinerary, { uuid: id });
        if (!itinerary) {
            throw new NotFoundException(`Itinerary with id ${id} not found`);
        }
        if (itinerary.user.uuid !== userUuid) {
            throw new UnauthorizedException('You are not allowed to access this itinerary');
        }
        return itinerary;
    }

    /**
     * Creates a new itinerary associated with the authenticated user.
     *
     * @param dto - The data for creating the itinerary.
     * @param userUuid - The uuid extracted from the JWT token payload.
     * @returns The newly created itinerary.
     * @throws {NotFoundException} if the user is not found.
     */
    async createItinerary(
        dto: CreateItineraryDto,
        userUuid: string,
    ): Promise<Itinerary> {
        // Retrieve the user based on the uuid from the token payload.
        const user = await this.em.findOne(User, { uuid: userUuid });
        if (!user) {
            throw new NotFoundException(`User with uuid ${userUuid} not found`);
        }
        // Create and persist the itinerary associated with the authenticated user.
        const itinerary = this.em.create(Itinerary, { ...dto, user }) as Itinerary;
        await this.em.persistAndFlush(itinerary);
        return itinerary;
    }

    /**
     * Updates an existing itinerary.
     *
     * @param id - The unique identifier of the itinerary.
     * @param dto - The data to update the itinerary.
     * @param userUuid - The uuid of the authenticated user.
     * @returns The updated itinerary.
     * @throws {NotFoundException} if the itinerary does not exist.
     * @throws {UnauthorizedException} if the itinerary does not belong to the user.
     */
    async updateItinerary(
        id: string,
        dto: Partial<UpdateItineraryDto>,
        userUuid: string,
    ): Promise<Itinerary> {
        const itinerary = await this.getItineraryById(id, userUuid);
        // Update the itinerary with new data.
        this.em.assign(itinerary, dto);
        await this.em.persistAndFlush(itinerary);
        return itinerary;
    }

    /**
     * Deletes an itinerary.
     *
     * @param id - The unique identifier of the itinerary.
     * @param userUuid - The uuid of the authenticated user.
     * @returns void.
     * @throws {NotFoundException} if the itinerary does not exist.
     * @throws {UnauthorizedException} if the itinerary does not belong to the user.
     */
    async deleteItinerary(id: string, userUuid: string): Promise<void> {
        const itinerary = await this.getItineraryById(id, userUuid);
        await this.em.removeAndFlush(itinerary);
    }

    // --- Location-related methods ---

    /**
     * Retrieves all locations for a specific itinerary.
     *
     * @param itineraryId - The unique identifier of the itinerary.
     * @param userUuid - The uuid of the authenticated user.
     * @returns An array of locations belonging to the itinerary.
     */
    async getLocationsForItinerary(itineraryId: string, userUuid: string): Promise<Location[]> {
        const itinerary = await this.getItineraryById(itineraryId, userUuid);
        // Initialize the collection of locations if needed.
        await itinerary.locations.init();
        return itinerary.locations.getItems();
    }

    /**
     * Retrieves a specific location within an itinerary.
     *
     * @param itineraryId - The unique identifier of the itinerary.
     * @param locationId - The unique identifier of the location.
     * @param userUuid - The uuid of the authenticated user.
     * @returns The location.
     * @throws {NotFoundException} if the location does not exist within the itinerary.
     */
    async getLocationById(
        itineraryId: string,
        locationId: string,
        userUuid: string,
    ): Promise<Location> {
        // Ensure the itinerary exists and belongs to the user.
        const itinerary = await this.getItineraryById(itineraryId, userUuid);
        // Find the location associated with the itinerary.
        const location = await this.em.findOne(Location, { uuid: locationId, itinerary });
        if (!location) {
            throw new NotFoundException(`Location with id ${locationId} not found in itinerary ${itineraryId}`);
        }
        return location;
    }

    /**
     * Creates a new location within a specific itinerary.
     *
     * @param itineraryId - The unique identifier of the itinerary.
     * @param dto - The data for creating the location.
     * @param userUuid - The uuid of the authenticated user.
     * @returns The newly created location.
     */
    async createLocation(
        itineraryId: string,
        dto: CreateLocationDto,
        userUuid: string,
    ): Promise<Location> {
        // Ensure the itinerary exists and belongs to the user.
        const itinerary = await this.getItineraryById(itineraryId, userUuid);
        // Create and persist the location associated with the itinerary.
        const location = this.em.create(Location, { ...dto, itinerary });
        await this.em.persistAndFlush(location);
        return location;
    }

    /**
     * Updates an existing location within an itinerary.
     *
     * @param itineraryId - The unique identifier of the itinerary.
     * @param locationId - The unique identifier of the location.
     * @param dto - The data to update the location.
     * @param userUuid - The uuid of the authenticated user.
     * @returns The updated location.
     * @throws {NotFoundException} if the location does not exist.
     */
    async updateLocation(
        itineraryId: string,
        locationId: string,
        dto: Partial<UpdateLocationDto>,
        userUuid: string,
    ): Promise<Location> {
        const location = await this.getLocationById(itineraryId, locationId, userUuid);
        // Update the location with new data.
        this.em.assign(location, dto);
        await this.em.persistAndFlush(location);
        return location;
    }

    /**
     * Deletes a location from an itinerary.
     *
     * @param itineraryId - The unique identifier of the itinerary.
     * @param locationId - The unique identifier of the location.
     * @param userUuid - The uuid of the authenticated user.
     * @returns void.
     * @throws {NotFoundException} if the location does not exist.
     */
    async deleteLocation(
        itineraryId: string,
        locationId: string,
        userUuid: string,
    ): Promise<void> {
        const location = await this.getLocationById(itineraryId, locationId, userUuid);
        await this.em.removeAndFlush(location);
    }
}
