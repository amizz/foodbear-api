import { Ctx, Done, Fastify, Req, Res, RouteOptions } from '../interfaces/fastify'

export const mainRoute = (route: Fastify, options: RouteOptions, done: Done): any => {

  route.get('/', (req: Req, res: Res) => {
    const date = new Date()
    res.send({
      message: 'FoodBear',
      date
    })
  });

  done()
}
