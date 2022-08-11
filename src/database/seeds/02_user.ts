import { Menu, User } from '#interfaces/model';
import { Knex } from 'knex';
import usersAndPurchase from './assets/users_with_purchase_history.json';
import md5File from 'md5-file';
import fse from 'fs-extra';

export async function seed(knex: Knex): Promise<void> {
    /**
     * Check cache
     */
    const appendPath = process.env.NODE_ENV === 'testing' ? '/src/database' : '';
    const hash = await md5File(`.${appendPath}/seeds/assets/users_with_purchase_history.json`);
    let isIdenticalData, allFileAvailable: boolean = false;
    if(await fse.pathExists(`.${appendPath}/seeds/cache/user_metadata.json`)) {
        const cacheMetadata = await fse.readJSON(`.${appendPath}/seeds/cache/user_metadata.json`);
        isIdenticalData = cacheMetadata['user']['hash'] === hash;

        allFileAvailable = await fse.pathExists(`.${appendPath}/seeds/cache/user.json`) 
        && await fse.pathExists(`.${appendPath}/seeds/cache/purchase.json`);
    }

    // Deletes ALL existing entries
    await knex.raw(`TRUNCATE public."user" CASCADE;`);
    await knex.raw(`ALTER SEQUENCE user_id_seq RESTART;`)
    await knex.raw(`ALTER SEQUENCE purchase_id_seq RESTART;`)

    /**
     * Use cache if data is same
     */
     if(isIdenticalData && allFileAvailable) {
        console.log('Using cache data');
        const userData = await fse.readJSON(`.${appendPath}/seeds/cache/user.json`);
        const purchaseData = await fse.readJSON(`.${appendPath}/seeds/cache/purchase.json`);

        await knex('user').insert(userData);
        await knex('purchase').insert(purchaseData.splice(0, purchaseData.length/2)); //knex has limited capability to store thousands of data at the same time
        await knex('purchase').insert(purchaseData);
    } else {
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

        //Store to cache
        console.log('Storing cache');
        await fse.createFile(`.${appendPath}/seeds/cache/user.json`);
        await fse.createFile(`.${appendPath}/seeds/cache/purchase.json`);
        await fse.writeJson(`.${appendPath}/seeds/cache/user.json`, await knex('user').select());
        await fse.writeJson(`.${appendPath}/seeds/cache/purchase.json`, await knex('purchase').select());

    }

    
    await knex.raw(`SELECT setval('user_id_seq', max(id)) FROM "user";`);
    await knex.raw(`SELECT setval('purchase_id_seq', max(id)) FROM "purchase";`);

    /**
     * Cache data
     */
     await fse.createFile(`.${appendPath}/seeds/cache/user_metadata.json`);
     await fse.writeJson(`.${appendPath}/seeds/cache/user_metadata.json`, { user: { hash } });

    console.log('Done user');
};
