import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
	path: process.env.KNEX === 'true' ? path.resolve('../../.env') : undefined
});

// Update with your config settings.
import { Knex } from "knex"

export const development: Knex.Config = {
	client: 'postgresql',
	connection: {
		host: process.env.DB_HOST,
		port: parseInt(process.env.DB_PORT ?? '5376'),
		database: process.env.DB_NAME,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD
	},
	pool: {
		min: 1,
		max: 10
	},
	migrations: {
		tableName: 'knex_migrations',
		directory: 'migrations'
	},
	seeds: {
		timestampFilenamePrefix: true,
		directory: 'seeds'
	}
}

export const testing: Knex.Config = {
	client: 'postgresql',
	connection: {
		host: process.env.DB_TEST_HOST,
		port: parseInt(process.env.DB_TEST_PORT!),
		database: process.env.DB_TEST_NAME,
		user: process.env.DB_TEST_USER,
		password: process.env.DB_TEST_PASSWORD
	},
	pool: {
		min: 1,
		max: 10
	},
	migrations: {
		tableName: 'knex_migrations',
		directory: 'src/database/migrations'
	},
	seeds: {
		timestampFilenamePrefix: true,
		directory: 'src/database/seeds/testing'
	}
}

export const staging: Knex.Config = {
	client: 'postgresql',
	connection: {
		host: process.env.DB_HOST,
		port: parseInt(process.env.DB_PORT ?? '5376'),
		database: process.env.DB_NAME,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD
	},
	pool: {
		min: 1,
		max: 1
	},
	migrations: {
		tableName: 'knex_migrations',
		directory: 'migrations'
	},
	seeds: {
		directory: 'seeds'
	}
}

export const production: Knex.Config = {
	client: 'postgresql',
	connection: {
		host: process.env.DB_HOST,
		port: parseInt(process.env.DB_PORT ?? '5376'),
		database: process.env.DB_NAME,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD
	},
	pool: {
		min: 1,
		max: 10
	},
	migrations: {
		tableName: 'knex_migrations',
		directory: 'migrations'
	},
	seeds: {
		directory: 'seeds'
	}
}
