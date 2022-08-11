import Joi from 'joi';
import db from '#database/db'
import { schemaValidator } from '#utils/validator'
import { Req, Res } from '#interfaces/fastify'
import { FoodBearError } from '#interfaces/common';
import { Restaurant } from '#interfaces/model';

export async function topRestaurant(req: Req, res: Res): Promise<Record<string, any>> {
    try {
        let { min_price, max_price } = req.query;
        let restaurantsQuery = db<Restaurant>('restaurant')
            .select('restaurant.*', db.raw('min(menu.price) as min_price'), db.raw('max(menu.price) as max_price'), db.raw('count(menu.id) as num_dishes'))
            .innerJoin('menu', 'menu.restaurant_id', 'restaurant.id')
            .groupBy('restaurant.id')
            .orderBy('num_dishes', 'desc');

        
        if(min_price && max_price) {
            restaurantsQuery.having(db.raw('min(menu.price)'), '>=', parseInt(min_price)).andHaving(db.raw('max(menu.price)'), '<=', parseInt(max_price));
        } else if(min_price) {
            restaurantsQuery.having(db.raw('min(menu.price)'), '>=', parseInt(min_price));
        } else if(max_price) {
            restaurantsQuery.having(db.raw('max(menu.price)'), '>=', parseInt(max_price));
        }

        return res.status(200).send(await restaurantsQuery);
    } catch (error: any) {
        return res.status(400).send({ code: 'K9EU53LY', message: 'Failed' });
    }
}

export const topRestaurantSchema = schemaValidator({
    querystring: Joi.object().keys({
        min_price: Joi.number().optional(),
        max_price: Joi.number().optional()
    })
});