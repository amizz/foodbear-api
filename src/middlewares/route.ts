import { Fastify, Req, Res } from '#interfaces/fastify'
import { mainRoute } from '#routes/main';
import { restaurantRoute } from '#routes/restaurant';

export const routeMiddleware = (app: Fastify): void => {
  /**
   * @description all route initialize here
   */
  app.register(mainRoute, { prefix: '/' });
  app.register(restaurantRoute);
}
