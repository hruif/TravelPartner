import { IsString, IsOptional } from 'class-validator';

/**
 * DTO for creating a new itinerary.
 */
export class CreateItineraryDto {
    @IsString()
    title: string;

    @IsString()
    description: string;
}
