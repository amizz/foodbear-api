import Joi from 'joi';
import db from '#database/db'
import { schemaValidator } from '#utils/validator'
import { Req, Res } from '#interfaces/fastify'
import { FoodBearError } from '#interfaces/common';
import { Menu, Purchase, Restaurant, User } from '#interfaces/model';

export async function createPurchase(req: Req, res: Res): Promise<Record<string, any>> {
    try {
        let { user_id, menu_id } = req.body;

        /**
         * Get user to check account balance
         */
        let user = await db<User>('user').select().where('id', '=', user_id).first();

        if(!user) {
            throw new FoodBearError({ httpStatus: 400, message: 'User not found', code: 'GIEQPIMH' });
        }

        /**
         * Get menu
         */
        let menu = await db<Menu>('menu').select().where('id', '=', menu_id).first();

        if(!menu) {
            throw new FoodBearError({ httpStatus: 400, message: 'Menu not found', code: 'UHWJ0G90' });
        }

        /**
         * Check for balance base on dish price
         */
        if(user.cash_balance < menu.price) {
            throw new FoodBearError({ httpStatus: 400, message: 'Cash balance is not sufficient', code: 'F5DP1WEJ' });
        }
        

        await db.transaction(async trx => {
            //Insert into purchase
            await trx<Purchase>('purchase').insert({
                restaurant_id: menu?.restaurant_id,
                user_id: user?.id,
                menu_id: menu?.id,
                amount: menu?.price
            });

            //Update user cash balance
            await trx<User>('user').decrement('cash_balance', menu?.price);

            //Update restaurant cash balance
            await trx<Restaurant>('restaurant').increment('cash_balance', menu?.price);
        });

        return res.status(200).send({ message: 'Success' });
    } catch (error: any) {
        if(error instanceof FoodBearError) {
            return res.status(error.httpStatus).send({ code: error.code, message: error.message });
        }
        console.error(error);
        return res.status(400).send({ code: 'K9EU53LY', message: 'Failed' });
    }
}

export const createPurchaseSchema = schemaValidator({
    body: Joi.object().keys({
        user_id: Joi.number().required(),
        menu_id: Joi.number().required()
    }).required()
});