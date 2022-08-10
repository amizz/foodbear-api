import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
        ALTER TABLE restaurant ADD COLUMN ts_name tsvector
        GENERATED ALWAYS AS (to_tsvector('english', name)) STORED;
        CREATE INDEX ts_name_idx ON restaurant USING GIN (ts_name);
    `);
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`
        DROP INDEX ts_name_idx;
        ALTER TABLE restaurant DROP COLUMN ts_name;
    `);
}

