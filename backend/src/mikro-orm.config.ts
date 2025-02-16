import { Options, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User } from './users/user.entity';
import { config as dotenvConfig } from 'dotenv';

// Load environment variables
dotenvConfig();

const config: Options = {
  entities: [User],
  user: process.env.DATABASE_USER || 'defaultuser',
  password: process.env.DATABASE_PASSWORD || 'defaultpassword',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  dbName: process.env.DATABASE_NAME || 'defaultdb',
  driver: PostgreSqlDriver,
  debug: process.env.NODE_ENV === 'development', // Enable SQL query logs in dev mode
};

export default config;
