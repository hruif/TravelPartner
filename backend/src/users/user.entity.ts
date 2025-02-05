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
   * The username of the user.
   * @type {string}
   */
  @Property({ unique: true })
  username: string;

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
   * @param {string} username - The username of the user.
   * @param {string} email - The email address of the user.
   * @param {string} password - The hashed password of the user.
   */
  constructor(username: string, email: string, password: string) {
    this.username = username;
    this.email = email;
    this.password = password;
  }
}
