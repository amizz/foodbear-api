import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import dotenv from 'dotenv';
dotenv.config();

import build from '../src/app'
export const app = build();

const test = suite('Restaurant API');

test('GET /restaurants : Get all restaurants', async () => {
    const response = await app.inject({
        method: 'GET',
        url: '/restaurants'
    })
    
    const body = JSON.parse(response.body);
    assert.equal(body.length > 0, body.length > 0,'Return list of restaurants');
    assert.equal(response.statusCode, 200, 'Return 200');
});

test('GET /restaurants : Get all restaurants search opening', async () => {
    const response = await app.inject({
        method: 'GET',
        url: '/restaurants',
        query: {
            open: '2022-08-11T23:00:00.911Z'
        }
    })
    
    const body = JSON.parse(response.body);
    
    assert.equal(body.length > 0, body.length > 0,'Return list of restaurants');
    assert.equal(response.statusCode, 200, 'Return 200');
});

test('GET /restaurants/top : Top restaurants', async () => {
    const response = await app.inject({
        method: 'GET',
        url: '/restaurants/top'
    })
    
    const body = JSON.parse(response.body);
    
    assert.equal(body.length > 0, body.length > 0,'Return list of restaurants');
    assert.equal(response.statusCode, 200, 'Return 200');
});

test('GET /restaurants/top : Top restaurants with min price', async () => {
    const response = await app.inject({
        method: 'GET',
        url: '/restaurants/top',
        query: {
            min_price: '1000'
        }
    })
    
    const body = JSON.parse(response.body);
    
    assert.equal(body.length > 0, body.length > 0,'Return list of restaurants');
    assert.equal(response.statusCode, 200, 'Return 200');
});

test('GET /restaurants/top : Top restaurants with max price', async () => {
    const response = await app.inject({
        method: 'GET',
        url: '/restaurants/top',
        query: {
            max_price: '2000'
        }
    })
    
    const body = JSON.parse(response.body);
    
    assert.equal(body.length > 0, body.length > 0,'Return list of restaurants');
    assert.equal(response.statusCode, 200, 'Return 200');
});

test('GET /restaurants/top : Top restaurants with min and max price', async () => {
    const response = await app.inject({
        method: 'GET',
        url: '/restaurants/top',
        query: {
            min_price: '1000',
            max_price: '2000'
        }
    })
    
    const body = JSON.parse(response.body);
    
    assert.equal(body.length > 0, body.length > 0,'Return list of restaurants');
    assert.equal(response.statusCode, 200, 'Return 200');
});

test('GET /restaurants/search : Search restaurants', async () => {
    const response = await app.inject({
        method: 'GET',
        url: '/restaurants/search',
        query: {
            q: 'Grill'
        }
    })
    
    const body = JSON.parse(response.body);
    
    assert.equal(body.length > 0, body.length > 0,'Return list of restaurants');
    assert.equal(response.statusCode, 200, 'Return 200');
});

test.run();