import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import dotenv from 'dotenv';
dotenv.config();

import build from '../src/app'
import db from '#database/db';
export const app = build();

const test = suite('User API');

test('GET /users/:id : Get user by id - SUCCESS', async () => {
    const response = await app.inject({
        method: 'GET',
        url: `/users/1`
    })
    
    const body = JSON.parse(response.body);
    
    assert.ok(body, 'Body OK');
    assert.equal(response.statusCode, 200, 'Return 200');
});

test('GET /users/:id : Get user by id - FAILED', async () => {
    const response = await app.inject({
        method: 'GET',
        url: `/users/99`
    })
    
    const body = JSON.parse(response.body);
    
    assert.ok(body, 'Body OK');
    assert.equal(response.statusCode, 404, 'Return 404');
});

test.run();