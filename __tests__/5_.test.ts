import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import dotenv from 'dotenv';
dotenv.config();

import build from '../src/app'
import db from '#database/db';
export const app = build();

const test = suite('Main API');

test.after(async () => {
    await db.destroy();
    await app.close();
})

test.run();