import { registerAs } from '@nestjs/config';

const PSQL_CONFIG = registerAs('PSQL_CONFIG', () => {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: process.env['DB_PORT'] || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'chatapp',
  };
});

export { PSQL_CONFIG };
