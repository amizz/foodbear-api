import Joi from 'joi';
import db from '#database/db'
import { schemaValidator } from '#utils/validator'
import { Req, Res } from '#interfaces/fastify'
import { FoodBearError } from '#interfaces/common';
import knex from 'knex';
import { Restaurant } from '#interfaces/model';

export async function searchRestaurant(req: Req, res: Res): Promise<Record<string, any>> {
    try {
        let restaurants = await db<Restaurant>('restaurant')
            .select('*', db.raw(`ts_rank_cd(ts_name, concat(?::varchar,':*')::tsquery) AS rank`, [req.query.q]))
            .where(db.raw(`ts_name @@ to_tsquery('english', concat(?::varchar,':*'))`, [req.query.q]))
            .orderBy('rank', 'desc');
        return res.status(200).send(restaurants);
    } catch (error: any) {
        if(error instanceof FoodBearError) {
            return res.status(error.httpStatus).send({ code: error.code, message: error.message });
        }
        console.error(error);
        return res.status(400).send({ code: 'K9EU53LY', message: 'Failed' });
    }
}

export const searchRestaurantSchema = schemaValidator({
    query: Joi.object().keys({
        q: Joi.string().required()
    })
});