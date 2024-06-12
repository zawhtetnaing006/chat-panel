import * as Joi from 'joi';

export const ValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'),
  EXPIRED_IN: Joi.string().default('7d'),
  DATABASE_URL: Joi.string().required(),
  API_SECRET: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
});
