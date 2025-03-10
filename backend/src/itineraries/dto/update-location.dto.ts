import { IsString, IsOptional } from 'class-validator';

/**
 * DTO for updating an existing location.
 * All properties are optional.
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
