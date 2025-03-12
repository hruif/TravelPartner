import { Options, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User } from './users/user.entity';
import { config as dotenvConfig } from 'dotenv';
import { DiaryEntry } from './diary/diary-entry.entity';
import {Itinerary} from "./itineraries/itinerary.entity";
import {Location} from "./itineraries/location.entity";

// Load environment variables
dotenvConfig();

const config: Options = {
  entities: [User, DiaryEntry, Itinerary, Location],
  user: process.env.DATABASE_USER || 'defaultuser',
  password: process.env.DATABASE_PASSWORD || 'defaultpassword',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  driver: PostgreSqlDriver,
  debug: process.env.NODE_ENV === 'development', // Enable SQL query logs in dev mode
};

export default config;
