import { IsString } from 'class-validator';

/**
 * Data Transfer Object for creating a location.
 */
export class CreateLocationDto {
    @IsString()
    photoURI: string;

    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    formattedAddress: string;

    /**
     * The uuid of the itinerary to which this location belongs.
     */
    @IsString()
    itineraryUuid: string;
}
