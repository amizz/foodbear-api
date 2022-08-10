import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
        CREATE OR REPLACE FUNCTION update_timestamp()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = now(); 
            RETURN NEW;
        END;
        $$ language 'plpgsql';
    `);

    /**
     * User
     */
    await knex.schema.withSchema('public').createTable('user', (table) => {
        table.increments('id').primary().index().unique().unsigned();
        table.string('name').notNullable();
        table.integer('cash_balance').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
    
    await knex.raw(`
        CREATE TRIGGER update_user_timestamp BEFORE UPDATE
        ON "user" FOR EACH ROW EXECUTE PROCEDURE 
        update_timestamp();
    `);
    
    /**
     * Restaurant
     */
    await knex.schema.withSchema('public').createTable('restaurant', (table) => {
        table.increments('id').primary().index().unique().unsigned();
        table.string('name').notNullable();
        table.integer('cash_balance').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });

    await knex.raw(`
        CREATE TRIGGER update_restaurant_timestamp BEFORE UPDATE
        ON "restaurant" FOR EACH ROW EXECUTE PROCEDURE 
        update_timestamp();
    `);

    
    /**
     * Opening Hour
     */
     await knex.schema.withSchema('public').createTable('opening_hour', (table) => {
        table.increments('id').primary().index().unique().unsigned();
        table.integer('restaurant_id').references('id').inTable('restaurant').index().unsigned();
        table.string('day').notNullable();
        table.time('start').notNullable();
        table.time('end').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });

    await knex.raw(`
        CREATE TRIGGER update_opening_hour_timestamp BEFORE UPDATE
        ON "opening_hour" FOR EACH ROW EXECUTE PROCEDURE 
        update_timestamp();
    `);
    
    
    /**
     * Menu
     */
     await knex.schema.withSchema('public').createTable('menu', (table) => {
        table.increments('id').primary().index().unique().unsigned();
        table.integer('restaurant_id').references('id').inTable('restaurant').index().unsigned();
        table.text('dish_name').notNullable();
        table.integer('price').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });

    await knex.raw(`
        CREATE TRIGGER update_menu_timestamp BEFORE UPDATE
        ON "menu" FOR EACH ROW EXECUTE PROCEDURE 
        update_timestamp();
    `);
    
    /**
     * Purchase
     */
     await knex.schema.withSchema('public').createTable('purchase', (table) => {
        table.increments('id').primary().index().unique().unsigned();
        table.integer('restaurant_id').references('id').inTable('restaurant').index().unsigned();
        table.integer('menu_id').references('id').inTable('menu').index().unsigned();
        table.integer('user_id').references('id').inTable('user').index().unsigned();
        table.integer('amount').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });

    await knex.raw(`
        CREATE TRIGGER update_purchase_timestamp BEFORE UPDATE
        ON "purchase" FOR EACH ROW EXECUTE PROCEDURE 
        update_timestamp();
    `);
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`DROP TRIGGER IF EXISTS update_purchase_timestamp ON "purchase"`);
    await knex.schema.withSchema('public').dropTable('purchase');
    await knex.raw(`DROP TRIGGER IF EXISTS update_menu_timestamp ON "menu"`);
    await knex.schema.withSchema('public').dropTable('menu');
    await knex.raw(`DROP TRIGGER IF EXISTS update_opening_hour_timestamp ON "opening_hour"`);
    await knex.schema.withSchema('public').dropTable('opening_hour');
    await knex.raw(`DROP TRIGGER IF EXISTS update_restaurant_timestamp ON "restaurant"`);
    await knex.schema.withSchema('public').dropTable('restaurant');
    await knex.raw(`DROP TRIGGER IF EXISTS update_user_timestamp ON "user"`);
    await knex.schema.withSchema('public').dropTable('user');
    await knex.raw('DROP FUNCTION IF EXISTS update_timestamp()');
}

