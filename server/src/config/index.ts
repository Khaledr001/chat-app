import { APP_CONFIG } from './app.config';
import { MONGODB_CONFIG, PSQL_CONFIG } from './database.config';
import { JWT_CONFIG } from './jwt.config';

const configaration = [APP_CONFIG, PSQL_CONFIG, MONGODB_CONFIG, JWT_CONFIG];

export { configaration };
