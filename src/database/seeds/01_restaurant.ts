import { Menu, OpeningHour, Restaurant } from '#interfaces/model';
import { format, isValid, parse } from 'date-fns';
import { RequestQuerystringDefault } from 'fastify';
import { Knex } from 'knex';
import restaurantWithMenu from './assets/restaurant_with_menu.json';
import md5File from 'md5-file';
import fse from 'fs-extra';

export async function seed(knex: Knex): Promise<void> {
    /**
     * Check cache
     */
    const appendPath = process.env.NODE_ENV === 'testing' ? '/src/database' : '';
    const filePathAsset = `.${appendPath}/seeds/assets/restaurant_with_menu.json`;
    const filePathMetadata = `.${appendPath}/seeds/cache/restaurant_metadata.json`;
    const hash = await md5File(filePathAsset);
    let isIdenticalData, allFileAvailable: boolean = false;
    if(await fse.pathExists(filePathMetadata)) {
        const cacheMetadata = await fse.readJSON(filePathMetadata);
        isIdenticalData = cacheMetadata['restaurant']['hash'] === hash;

        allFileAvailable = await fse.pathExists(`.${appendPath}/seeds/cache/restaurant.json`) 
        && await fse.pathExists(`.${process.env.NODE_ENV === 'testing' ? '/database' : ''}/seeds/cache/menu.json`)
        && await fse.pathExists(`.${process.env.NODE_ENV === 'testing' ? '/database' : ''}/seeds/cache/opening_hour.json`);
    }

    // Deletes ALL existing entries
    await knex.raw(`TRUNCATE public."restaurant" CASCADE;`);
    await knex.raw(`ALTER SEQUENCE restaurant_id_seq RESTART;`);
    await knex.raw(`ALTER SEQUENCE menu_id_seq RESTART;`);
    await knex.raw(`ALTER SEQUENCE opening_hour_id_seq RESTART;`);

    /**
     * Use cache if data is same
     */
    if(isIdenticalData && allFileAvailable) {
        console.log('Using cache data');
        const restaurantData = await fse.readJSON('./seeds/cache/restaurant.json');
        const menuData = await fse.readJSON('./seeds/cache/menu.json');
        const openingHourData = await fse.readJSON('./seeds/cache/opening_hour.json');

        await knex('restaurant').insert(restaurantData);
        await knex('menu').insert(menuData.splice(0, menuData.length/2)); //knex has limited capability to store thousands of data at the same time
        await knex('menu').insert(menuData);
        await knex('opening_hour').insert(openingHourData.splice(0, openingHourData.length/2));
        await knex('opening_hour').insert(openingHourData);
    } else {
        for (let i = 0; i < restaurantWithMenu.length; i++) {
            const resto = restaurantWithMenu[i];
            try {
                await knex.transaction(async trx => {
                    let restoInsert = await knex<Restaurant>('restaurant').insert({
                        name: resto.restaurantName.trim(),
                        cash_balance: ~~(resto.cashBalance*100)
                    }).returning('id');
        
                    const menu = restaurantWithMenu[i].menu.map(x => {
                        return {
                            restaurant_id: restoInsert[0].id,
                            dish_name: x.dishName.trim(),
                            price: ~~(x.price*100)
                        }
                    });
        
                    const openingHour = processOpeningHour(restaurantWithMenu[i].openingHours).map(x => {
                        x['restaurant_id'] = restoInsert[0].id;
                        return x;
                    });
        
                    await knex<Menu>('menu').insert(menu);
                    await knex<OpeningHour>('opening_hour').insert(openingHour);
                });
            } catch (error) {
                console.error(error);
                console.log(resto);
            }
        }

        //Store to cache
        console.log('Storing cache');
        await fse.createFile(`.${appendPath}/seeds/cache/restaurant.json`);
        await fse.createFile(`.${appendPath}/seeds/cache/menu.json`);
        await fse.createFile(`.${appendPath}/seeds/cache/opening_hour.json`);
        await fse.writeJson(`.${appendPath}/seeds/cache/restaurant.json`, await knex('restaurant').select('id', 'name', 'cash_balance', 'created_at', 'updated_at'));
        await fse.writeJson(`.${appendPath}/seeds/cache/menu.json`, await knex('menu').select());
        await fse.writeJson(`.${appendPath}/seeds/cache/opening_hour.json`, await knex('opening_hour').select());
    }

    await knex.raw(`SELECT setval('restaurant_id_seq', max(id)) FROM restaurant;`);
    await knex.raw(`SELECT setval('menu_id_seq', max(id)) FROM menu;`);
    await knex.raw(`SELECT setval('opening_hour_id_seq', max(id)) FROM opening_hour;`);

    /**
     * Cache data
     */
    await fse.createFile(`.${appendPath}/seeds/cache/restaurant_metadata.json`);
    await fse.writeJson(`.${appendPath}/seeds/cache/restaurant_metadata.json`, { restaurant: { hash } });

    console.log('Done restaurant');
}

function processOpeningHour(openingHour: string) : Array<{ day: string, start: string, end: string }> {
    const day = {'Mon': 'Monday', 'Tues': 'Tuesday', 'Weds': 'Wednesday', 'Wed': 'Wednesday', 'Fri': 'Friday', 'Thurs': 'Thursday', 'Thu': 'Thursday', 'Sat': 'Saturday', 'Sun': 'Sunday'}
    const splitDay = openingHour.split('/');
    let process: Array<{ day: string, start: string, end: string }> = [];

    for (let i = 0; i < splitDay.length; i++) {
        const dayAndTime = splitDay[i].match(/[Mon|Tues|Weds|Wed|Thurs|Thu|Fri|Sat|Sun]+|([\d+:\d+]|\d+)+\s[a/p]m/g);

        if(dayAndTime && dayAndTime.length > 3) {
            for (let x = 0; x < dayAndTime.length-2; x++) {
                const el = dayAndTime[x];
                process.push({
                    day: day[el],
                    start: format(parseMultiple(dayAndTime[dayAndTime.length-2], ['hh a', 'hh:mm a'], new Date(), null), 'hh:mm a'),
                    end: format(parseMultiple(dayAndTime[dayAndTime.length-1], ['hh a', 'hh:mm a'], new Date(), null), 'hh:mm a')
                });
            }
        } else if(dayAndTime && dayAndTime.length === 3) {
            process.push({
                day: day[dayAndTime[0]],
                start: format(parseMultiple(dayAndTime[1], ['hh a', 'hh:mm a'], new Date(), null), 'hh:mm a'),
                end: format(parseMultiple(dayAndTime[2], ['hh a', 'hh:mm a'], new Date(), null), 'hh:mm a')
            });
        }
    }

    return process;

}

export const parseMultiple = (
    dateString,
    formatString,
    referenceDate,
    options
  ) => {
    let result;
  
    if (Array.isArray(formatString)) {
      for (let i = 0; i < formatString.length; i++) {
        result = parse(dateString, formatString[i], referenceDate, options);
        if (isValid(result)) { break; }
      }
    } else {
      result = parse(dateString, formatString, referenceDate, options);
    }
  
    return result;
  };