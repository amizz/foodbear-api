import Joi from 'joi';
import db from '#database/db'
import { schemaValidator } from '#utils/validator'
import { Req, Res } from '#interfaces/fastify'
import { FoodBearError } from '#interfaces/common';
import { Menu, Purchase, Restaurant, User } from '#interfaces/model';

export async function userById(req: Req, res: Res): Promise<Record<string, any>> {
    try {
        let { id } = req.params;

        /**
         * Get user to check account balance
         */
        let user = await db<User>('user')
            .select()
            .where('id', '=', id)
            .first();

        if(!user) {
            throw new FoodBearError({ httpStatus: 404, message: 'User not found', code: 'GIEQPIMH' });
        }

        return res.status(200).send(user);
    } catch (error: any) {
        if(error instanceof FoodBearError) {
            return res.status(error.httpStatus).send({ code: error.code, message: error.message });
        }
        console.error(error);
        return res.status(400).send({ code: 'K9EU53LY', message: 'Failed' });
    }
}

export const userByIdSchema = schemaValidator({
    params: Joi.object().keys({
        id: Joi.number().required()
    }).required()
});