import Joi from 'joi';
import db from '#database/db'
import { schemaValidator } from '#utils/validator'
import { Req, Res } from '#interfaces/fastify'
import { FoodBearError } from '#interfaces/common';
import knex from 'knex';
import { Restaurant } from '#interfaces/model';
import { parseISO } from 'date-fns';
import { format, utcToZonedTime } from "date-fns-tz";

export async function allRestaurant(req: Req, res: Res): Promise<Record<string, any>> {
    try {
        let { open, limit } = req.query;
        let restaurantsQuery = db<Restaurant>('restaurant')
            .select('restaurant.*', db.raw(`opening_hour.json_data as opening_hour`));

        if(limit) {
            restaurantsQuery.limit(limit)
        }

        if(open) {
            const parsedDate = parseISO(open);
            const formatInTimeZone = (date, fmt, tz) =>
                format(utcToZonedTime(date, tz), 
                        fmt, 
                        { timeZone: tz });
            let day = formatInTimeZone(parsedDate, 'EEEE', 'UTC');
            let time = formatInTimeZone(parsedDate, 'HH:mm:ss', 'UTC');
            restaurantsQuery.innerJoin(db.raw(`
                (
                    select opening_hour.restaurant_id, json_agg(opening_hour.*) as json_data
                    from opening_hour
                    where day = ? and 
                    (
                        (("start" < "end") AND (? BETWEEN "start" and "end"))
                        OR
                        (("start" > "end") AND NOT (? BETWEEN SYMMETRIC "start" and "end"))
                    )
                    group by opening_hour.restaurant_id
                ) opening_hour
            `, [day, time, time]), 'opening_hour.restaurant_id', 'restaurant.id')
        } else {
            restaurantsQuery.innerJoin(db.raw(`
                (
                    select opening_hour.restaurant_id, json_agg(opening_hour.*) as json_data
                    from opening_hour
                    group by opening_hour.restaurant_id
                ) opening_hour
            `), 'opening_hour.restaurant_id', 'restaurant.id')
        }
        

        return res.status(200).send(await restaurantsQuery);
    } catch (error: any) {
        return res.status(400).send({ code: 'K9EU53LY', message: 'Failed' });
    }
}


export const allRestaurantSchema = schemaValidator({
    querystring: Joi.object().keys({
        open: Joi.string().optional(),
        limit: Joi.number().optional()
    })
});