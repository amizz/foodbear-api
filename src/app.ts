import 'dotenv/config';
import fastify from 'fastify';
import { Fastify } from './interfaces/fastify';
import { pluginMiddleware } from './middlewares/plugin';
import { routeMiddleware } from './middlewares/route';
import dotenv from 'dotenv';

dotenv.config();

export default function main() : Fastify {
	
	/**
	 * @description initialize instance app
	 */

	const app = fastify() as Fastify;

	/**
	 * @description initialize all middleware here
	 */

	pluginMiddleware(app);
	routeMiddleware(app);

	app.setErrorHandler((error: any, request, reply) => {
		if (error.name == 'ValidationError') {
			reply.status(422).send({
				httpStatus: 422,
				error: 'Validation Error',
				message: error.message,
				details: error.details.map((val) => { return { 'message': val.message, 'path': val.path } })
			});
		}
		else {
			throw error;
		}
	})

	return app;
}
