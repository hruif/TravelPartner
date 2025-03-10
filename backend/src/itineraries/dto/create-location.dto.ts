import { IsString } from 'class-validator';

/**
 * DTO for creating a new location within an itinerary.
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
}
