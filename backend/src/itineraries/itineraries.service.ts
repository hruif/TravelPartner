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
import {v4} from "uuid";

/**
 * Service for handling itinerary operations.
 *
 * This service manages CRUD operations for itineraries and nested locations.
 * The itinerary retrieval methods also populate the locations so that they
 * are included in the returned object.
 */
@Injectable()
export class ItinerariesService {
    constructor(private readonly em: EntityManager) {}

    /**
     * Retrieves all itineraries for the authenticated user.
     * Each itinerary's locations are populated before returning.
     *
     * @param userUuid - The uuid of the authenticated user.
     * @returns An array of itineraries with nested locations.
     */
    async getAllItineraries(userUuid: string): Promise<Itinerary[]> {
        const itineraries = await this.em.find(Itinerary, { user: { uuid: userUuid } });
        // Populate locations for each itinerary
        await Promise.all(itineraries.map(async (itinerary) => {
            await this.em.populate(itinerary, ['locations']);
        }));
        return itineraries;
    }

    /**
     * Retrieves a specific itinerary by its unique identifier.
     * The itinerary's locations are populated before returning.
     *
     * @param id - The unique identifier of the itinerary.
     * @param userUuid - The uuid of the authenticated user.
     * @returns The itinerary with its locations.
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
        await this.em.populate(itinerary, ['locations']);
        return itinerary;
    }

    /**
     * Creates a new itinerary associated with the authenticated user.
     *
     * @param dto - The DTO for creating the itinerary.
     * @param userUuid - The uuid extracted from the JWT token payload.
     * @returns The newly created itinerary.
     * @throws {NotFoundException} if the user is not found.
     */
    async createItinerary(
        dto: CreateItineraryDto,
        userUuid: string,
    ): Promise<Itinerary> {
        const user = await this.em.findOne(User, { uuid: userUuid });
        if (!user) {
            throw new NotFoundException(`User with uuid ${userUuid} not found`);
        }
        const itinerary = this.em.create(Itinerary, { ...dto, user }) as Itinerary;
        await this.em.persistAndFlush(itinerary);
        // Return itinerary with an empty locations array
        itinerary.locations.init();
        return itinerary;
    }

    /**
     * Updates an existing itinerary.
     *
     * @param id - The unique identifier of the itinerary.
     * @param dto - The DTO containing updated itinerary details.
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
        this.em.assign(itinerary, dto);
        await this.em.persistAndFlush(itinerary);
        await this.em.populate(itinerary, ['locations']);
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
     * Creates a new location within a specific itinerary.
     *
     * @param itineraryId - The unique identifier of the itinerary.
     * @param dto - The DTO for creating the location.
     * @param userUuid - The uuid of the authenticated user.
     * @returns The newly created location.
     */
    async createLocation(
        itineraryId: string,
        dto: CreateLocationDto,
        userUuid: string,
    ): Promise<Location> {
        const itinerary = await this.getItineraryById(itineraryId, userUuid);
        const location = this.em.create(Location, { ...dto, itinerary, uuid: v4() });
        await this.em.persistAndFlush(location);
        return location;
    }

    /**
     * Updates an existing location within an itinerary.
     *
     * @param itineraryId - The unique identifier of the itinerary.
     * @param locationId - The unique identifier of the location.
     * @param dto - The DTO containing updated location details.
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

    /**
     * Retrieves a specific location within an itinerary.
     *
     * @param itineraryId - The unique identifier of the itinerary.
     * @param locationId - The unique identifier of the location.
     * @param userUuid - The uuid of the authenticated user.
     * @returns The location.
     * @throws {NotFoundException} if the location does not exist.
     */
    async getLocationById(
        itineraryId: string,
        locationId: string,
        userUuid: string,
    ): Promise<Location> {
        // Ensure the itinerary exists and belongs to the user.
        const itinerary = await this.getItineraryById(itineraryId, userUuid);
        const location = await this.em.findOne(Location, { uuid: locationId, itinerary });
        if (!location) {
            throw new NotFoundException(
                `Location with id ${locationId} not found in itinerary ${itineraryId}`,
            );
        }
        return location;
    }
}
