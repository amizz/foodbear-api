import { Knex } from 'knex';
import fse from 'fs-extra';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex.raw(`TRUNCATE public."user" CASCADE;`);
    await knex.raw(`ALTER SEQUENCE user_id_seq RESTART;`)
    await knex.raw(`ALTER SEQUENCE purchase_id_seq RESTART;`)

    const userData = await fse.readJSON(`./src/database/seeds/testing/cache/user.json`);
    const purchaseData = await fse.readJSON(`./src/database/seeds/testing/cache/purchase.json`);

    await knex('user').insert(userData);
    await knex('purchase').insert(purchaseData);

    
    await knex.raw(`SELECT setval('user_id_seq', max(id)) FROM "user";`);
    await knex.raw(`SELECT setval('purchase_id_seq', max(id)) FROM "purchase";`);
};
