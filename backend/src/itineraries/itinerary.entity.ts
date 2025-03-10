import {
    Entity,
    PrimaryKey,
    Property,
    ManyToOne,
    OneToMany,
    Collection,
} from '@mikro-orm/core';
import { User } from '../users/user.entity';
import { Location } from './location.entity';
import {v4} from "uuid";

/**
 * Entity representing an itinerary.
 */
@Entity()
export class Itinerary {
    /**
     * The unique identifier of the itinerary.
     */
    @PrimaryKey()
    uuid: string = v4();

    /**
     * The title of the itinerary.
     */
    @Property()
    title: string;

    /**
     * The description of the itinerary.
     */
    @Property({ nullable: true })
    description: string;

    /**
     * Many itineraries belong to one user.
     */
    @ManyToOne(() => User)
    user: User;

    /**
     * One itinerary can have many locations.
     */
    @OneToMany(() => Location, (location) => location.itinerary)
    locations = new Collection<Location>(this);

    constructor(title: string, description: string, user: User) {
        this.title = title;
        this.description = description;
        this.user = user;
    }
}
