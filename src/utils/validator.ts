import Joi from 'joi'
import { Schema } from '../interfaces/fastify'

interface Payload {
  body?: any | null
  querystring?: any | null
  params?: any | null
  headers?: any | null
}

export const schemaValidator = (payload: Payload): Schema => {
	const validation: Schema = {
		schema: payload,
		validatorCompiler: ({ schema, method, url, httpPart }) => {
			return data => schema.validate(data, { abortEarly: false, errors: {wrap: 'array'} })
		}
	}

	return validation
}
