import { createPurchase, createPurchaseSchema } from '#controllers/purchase/create-purchase';
import { Ctx, Done, Fastify, Req, Res, RouteOptions } from '../interfaces/fastify'

export const purchaseRoute = (route: Fastify, options: RouteOptions, done: Done): any => {

  route.post('/purchases', {...createPurchaseSchema}, createPurchase);

  done()
}
