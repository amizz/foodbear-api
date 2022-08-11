import { userById, userByIdSchema } from '#controllers/user/user-by-id';
import Joi from 'joi';
import { Ctx, Done, Fastify, Req, Res, RouteOptions } from '../interfaces/fastify'

export const userRoute = (route: Fastify, options: RouteOptions, done: Done): any => {

  route.get('/users/:id', {...userByIdSchema}, userById);

  done()
}
