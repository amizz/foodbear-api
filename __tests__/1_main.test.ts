import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import dotenv from 'dotenv';
dotenv.config();
import db from '#database/db';

import build from '../src/app'
export const app = build();

const main = suite('Main API');

main.before(async () => {
    try {
        if(!(await db.schema.hasTable('knex_migrations'))) {
            console.log('running migration');
            await db.migrate.latest();
        }
    
        await db.seed.run();
    } catch (error) {
        console.error(error);
    }
});

main('GET / : Root route', async () => {
    const response = await app.inject({
        method: 'GET',
        url: '/'
    })
    
    const body = JSON.parse(response.body);
    
    assert.type(body.message, 'string', 'Body message OK');
    assert.type(body.date, 'string', 'Body date OK');
    assert.equal(response.statusCode, 200, 'Return 200');
});

main.run();