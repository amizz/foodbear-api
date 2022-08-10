import Joi from 'joi';
import db from '#database/db'
import { schemaValidator } from '#utils/validator'
import { Req, Res } from '#interfaces/fastify'
import { FoodBearError } from '#interfaces/common';
import knex from 'knex';
import { Restaurant } from '#interfaces/model';

export async function topRestaurant(req: Req, res: Res): Promise<Record<string, any>> {
    try {
        let { min_price, max_price } = req.query;
        let restaurants = await db<Restaurant>('restaurant')
            .select('restaurant.*', db.raw('min(menu.price) as min_price'), db.raw('max(menu.price) as max_price'), db.raw('count(menu.id) as num_dishes'))
            .innerJoin('menu', 'menu.restaurant_id', 'restaurant.id')
            .having(function () {
                if(min_price && max_price) {
                    this.having(db.raw('min(menu.price)'), '<=', min_price).andHaving(db.raw('max(menu.price)'), '>=', max_price);
                } else if(min_price) {
                    this.having(db.raw('min(menu.price)'), '<=', min_price);
                } else if(max_price) {
                    this.having(db.raw('max(menu.price)'), '>=', max_price);
                }
            })
            .groupBy('restaurant.id')
            .orderBy('num_dishes', 'desc');
        return res.status(200).send(restaurants);
    } catch (error: any) {
        if(error instanceof FoodBearError) {
            return res.status(error.httpStatus).send({ code: error.code, message: error.message });
        }
        console.error(error);
        return res.status(400).send({ code: 'K9EU53LY', message: 'Failed' });
    }
}

export const topRestaurantSchema = schemaValidator({
    query: Joi.object().keys({
        q: Joi.string().required()
    })
});