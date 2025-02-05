import { Options, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User } from './users/user.entity';

const config: Options = {
  entities: [User],
  user: 'devuser', // Match PostgreSQL username in docker-compose
  password: 'devpassword', // Match PostgreSQL password
  host: 'postgres', // Use 'postgres' (service name in docker-compose)
  port: 5432, // PostgreSQL default port
  dbName: 'devdb', // Match database name
  driver: PostgreSqlDriver,
  debug: true, // Enable SQL query logs (optional)
};

export default config;
