import { Fastify, Req, Res } from '#interfaces/fastify'
import { mainRoute } from '#routes/main';
import { purchaseRoute } from '#routes/purchase';
import { restaurantRoute } from '#routes/restaurant';
import { userRoute } from '#routes/user';

export const routeMiddleware = (app: Fastify): void => {
  /**
   * @description all route initialize here
   */
  app.register(mainRoute, { prefix: '/' });
  app.register(restaurantRoute);
  app.register(purchaseRoute);
  app.register(userRoute);
}
