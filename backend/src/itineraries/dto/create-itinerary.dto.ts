import { IsString, IsOptional } from 'class-validator';

/**
 * Data Transfer Object for creating an itinerary.
 */
export class CreateItineraryDto {
    @IsString()
    title: string;

    @IsString()
    description: string;
}
