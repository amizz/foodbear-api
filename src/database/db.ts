import knex from 'knex';
import * as knexfile from './knexfile';

export default knex(knexfile[process.env.NODE_ENV || 'development']);