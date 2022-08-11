import { Knex } from 'knex';
import fse from 'fs-extra';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex.raw(`TRUNCATE public."restaurant" CASCADE;`);
    await knex.raw(`ALTER SEQUENCE restaurant_id_seq RESTART;`);
    await knex.raw(`ALTER SEQUENCE menu_id_seq RESTART;`);
    await knex.raw(`ALTER SEQUENCE opening_hour_id_seq RESTART;`);

    const restaurantData = await fse.readJSON('./src/database/seeds/testing/cache/restaurant.json');
    const menuData = await fse.readJSON('./src/database/seeds/testing/cache/menu.json');
    const openingHourData = await fse.readJSON('./src/database/seeds/testing/cache/opening_hour.json');

    await knex('restaurant').insert(restaurantData);
    await knex('menu').insert(menuData);
    await knex('opening_hour').insert(openingHourData);

    await knex.raw(`SELECT setval('restaurant_id_seq', max(id)) FROM restaurant;`);
    await knex.raw(`SELECT setval('menu_id_seq', max(id)) FROM menu;`);
    await knex.raw(`SELECT setval('opening_hour_id_seq', max(id)) FROM opening_hour;`);
}