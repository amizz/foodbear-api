import { Fastify, Req, Res } from '#interfaces/fastify'
import { mainRoute } from '#routes/main';

export const routeMiddleware = (app: Fastify): void => {
  /**
   * @description all route initialize here
   */
  app.register(mainRoute, { prefix: '/' });
}
