import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Itinerary } from './itinerary.entity';

/**
 * Entity representing a location within an itinerary.
 */
@Entity()
export class Location {
    @PrimaryKey()
    uuid: string = v4();

    /**
     * URI for the location's photo.
     */
    @Property()
    photoURI: string;

    /**
     * Title of the location.
     */
    @Property()
    title: string;

    /**
     * Description of the location.
     */
    @Property()
    description: string;

    /**
     * Formatted address for the location.
     */
    @Property()
    formattedAddress: string;

    /**
     * Reference to the itinerary this location belongs to.
     */
    @ManyToOne(() => Itinerary)
    itinerary: Itinerary;

    constructor(
        photoURI: string,
        title: string,
        description: string,
        formattedAddress: string,
        itinerary: Itinerary,
    ) {
        this.photoURI = photoURI;
        this.title = title;
        this.description = description;
        this.formattedAddress = formattedAddress;
        this.itinerary = itinerary;
    }
}
