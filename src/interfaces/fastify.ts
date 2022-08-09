import * as fastify from 'fastify'

export interface Fastify extends fastify.FastifyInstance {}
export interface Req<B = any, P = any, Q = any> extends fastify.FastifyRequest {
	body: B
	params: P
	query: Q
}
export interface Res extends fastify.FastifyReply {}
export interface Ctx extends fastify.FastifyContext {}
export interface RouteOptions extends fastify.RegisterOptions {}
export interface Schema extends fastify.FastifySchema {
	schema: fastify.FastifySchema
	validatorCompiler(schema: any): any
}

export type Done = any
