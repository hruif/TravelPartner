import {
    Entity,
    PrimaryKey,
    Property,
    OneToMany,
    Collection,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Location } from './location.entity';

/**
 * Entity representing an itinerary.
 */
@Entity()
export class Itinerary {
    @PrimaryKey()
    uuid: string = v4();

    /**
     * Title of the itinerary.
     */
    @Property()
    title: string;

    /**
     * Description of the itinerary.
     */
    @Property()
    description: string;

    /**
     * Timestamp when the itinerary was created.
     */
    @Property()
    createdAt: Date = new Date();

    /**
     * Timestamp when the itinerary was last updated.
     */
    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();

    /**
     * List of locations associated with the itinerary.
     */
    @OneToMany(() => Location, (location) => location.itinerary)
    locations = new Collection<Location>(this);

    constructor(title: string, description?: string) {
        this.title = title;
        this.description = description;
    }
}
