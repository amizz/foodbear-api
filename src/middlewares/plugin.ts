import { Fastify } from '../interfaces/fastify'
import fastifyCors from '@fastify/cors'
import fastifyFormBody from '@fastify/formbody'

export const pluginMiddleware = (app: Fastify): void => {
	/**
	 * @description all plugin initialize here
	 */
	app.addContentTypeParser(
		'application/json',
		{ parseAs: 'string' },
		(req, body: string, done) => {
			try {
				var json = JSON.parse(body);
				done(null, json);
			} catch (error) {
				done(null, null);
			}			
		}
	);

	app.register(fastifyCors, {
		origin: '*',
		methods: ['OPTIONS', 'GET', 'PUT', 'POST', 'DELETE'],
		allowedHeaders: 'x-www-form-urlencoded, Origin, X-Requested-With, Content-Type, Accept, Authorization',
		credentials: true
	});

	app.register(fastifyFormBody);
}
