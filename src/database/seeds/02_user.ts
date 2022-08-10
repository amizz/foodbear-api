import { Menu, User } from '#interfaces/model';
import { Knex } from 'knex';
import usersAndPurchase from './assets/users_with_purchase_history.json';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex.raw(`TRUNCATE public."user" CASCADE;`);
    await knex.raw(`ALTER SEQUENCE user_id_seq RESTART;`)
    await knex.raw(`ALTER SEQUENCE purchase_id_seq RESTART;`)

    let resto: Array<{ id: number, name: string, menu: Array<Menu> }> = await knex('restaurant')
        .select(['id', 'name', knex.raw('menu.json_data as menu')])
        .joinRaw(`left join (
            select 
            :table:.:refTableKey:,
            json_agg(:table:.*) as json_data
            from :table:
            group by :table:.:refTableKey:
        ) :table: on :table:.:refTableKey: = :fromTable:.:refFromKey:`, {
            table: 'menu',
            fromTable: 'restaurant',
            refTableKey: 'restaurant_id',
            refFromKey: 'id'
        });

    for (let i = 0; i < usersAndPurchase.length; i++) {
        const user = usersAndPurchase[i];
        let userInsert = await knex<User>('user').insert({
            id: user.id,
            name: user.name,
            cash_balance: ~~(user.cashBalance*100)
        }).returning('id');

        let purchase = user.purchaseHistory.map(ph => {
            let findResto = resto.findIndex(r => r.name.trim() === ph.restaurantName.trim());
            if (findResto != -1) {
                let menu = resto[findResto].menu.find(m => m.dish_name.trim() === ph.dishName.trim());

                return {
                    user_id: userInsert[0].id,
                    restaurant_id: resto[findResto].id,
                    menu_id: menu?.id,
                    amount: menu?.price
                }
            }
        });
        
        if(purchase.length > 0) {
            await knex('purchase').insert(purchase);
        }
    }
    console.log('Done user');
};
