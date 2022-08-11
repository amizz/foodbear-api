import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import dotenv from 'dotenv';
dotenv.config();

import build from '../src/app'
import db from '#database/db';
export const app = build();

const test = suite('Purchase API');

test('POST /purchases : Create purchase route - SUCCESS', async () => {
    const response = await app.inject({
        method: 'POST',
        url: '/purchases',
        payload: {
            menu_id: 1,
            user_id: 1
        }
    })
    
    const body = JSON.parse(response.body);
    
    assert.type(body.message, 'string', 'Body message OK');
    assert.equal(response.statusCode, 200, 'Return 200');
});

test('POST /purchases : Create purchase route with zero cash balance - FAILED', async () => {
    const response = await app.inject({
        method: 'POST',
        url: '/purchases',
        payload: {
            menu_id: 1,
            user_id: 2
        }
    })
    
    const body = JSON.parse(response.body);
    
    assert.type(body.message, 'string', 'Body message OK');
    assert.equal(response.statusCode, 400, 'Return 400');
});

test('POST /purchases : Create purchase validation - FAILED', async () => {
    const response = await app.inject({
        method: 'POST',
        url: '/purchases',
        payload: {
            user_id: 2
        }
    })
    
    const body = JSON.parse(response.body);
    
    assert.equal(response.statusCode, 422, 'Return 400');
});
test.run();