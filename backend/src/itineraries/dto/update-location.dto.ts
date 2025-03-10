import { IsString, IsOptional } from 'class-validator';

/**
 * Data Transfer Object for updating a location.
 */
export class UpdateLocationDto {
    @IsOptional()
    @IsString()
    photoURI?: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    formattedAddress?: string;
}
