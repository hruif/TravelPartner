import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

/**
 * Represents a user entity in the database.
 */
@Entity()
export class User {
  /**
   * The unique identifier of the user.
   * @type {number}
   */
  @PrimaryKey()
  uuid = v4();

  /**
   * The email address of the user.
   * @type {string}
   * @example johndoe@email.com
   */
  @Property()
  email: string;

  /**
   * The hashed password of the user.
   * @type {string}
   */
  @Property()
  password: string;

  /**
   * Creates a new User instance.
   *
   * @param {string} email - The email address of the user.
   * @param {string} password - The hashed password of the user.
   */
  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
