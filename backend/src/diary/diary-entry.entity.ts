import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { User } from '../users/user.entity';

/**
 * Represents a travel diary entry in the database.
 */
@Entity()
export class DiaryEntry {
  /**
   * The unique identifier of the travel diary entry.
   */
  @PrimaryKey()
  uuid: string = v4();

  /**
   * The title of the entry.
   */
  @Property()
  title: string;

  /**
   * The description of the entry.
   */
  @Property({ nullable: true })
  description?: string;

  /**
   * The URI of the selected photo.
   */
  @Property({ nullable: true })
  photoURI?: string;

  /**
   * The price associated with the entry.
   */
  @Property()
  price: number = 0;

  /**
   * The rating for the entry.
   */
  @Property()
  rating: number = 0;

  /**
   * The formatted address for the location.
   */
  @Property()
  formattedAddress?: string;

  /**
   * The date and time when the entry was created.
   */
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  /**
   * The journal name for the entry.
   */
  @Property({ nullable: true })
  journal?: string;

  /**
   * Reference to the user who created the entry.
   * This establishes a many-to-one relationship with the User entity.
   */
  @ManyToOne(() => User)
  user: User;

  /**
   * Creates a new TravelDiaryEntry instance.
   *
   * @param title - The title of the entry.
   * @param user - The user who created the entry.
   * @param description - The description of the entry.
   * @param photoURI - The URI of the selected photo.
   * @param price - The price associated with the entry.
   * @param rating - The rating for the entry.
   * @param formattedAddress - The formatted address of the location.
   * @param journal - The journal name for the entry.
   */
  constructor(
    title: string,
    user: User,
    description?: string,
    photoURI?: string,
    price: number = 0,
    rating: number = 0,
    formattedAddress?: string,
    journal?: string,
  ) {
    this.title = title;
    this.user = user;
    this.description = description;
    this.photoURI = photoURI;
    this.price = price;
    this.rating = rating;
    this.formattedAddress = formattedAddress;
    this.journal = journal;
  }
}
