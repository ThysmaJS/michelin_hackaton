import * as Joi from 'joi';

/**
 * Schéma de validation des variables d'environnement.
 *
 * Appliqué au démarrage par `ConfigModule` : l'application refuse de démarrer
 * si une variable critique (URL de base, origine CORS…) est absente ou invalide,
 * ce qui évite les erreurs silencieuses en production.
 */
export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  FRONTEND_ORIGIN: Joi.string().uri().required(),
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgresql', 'postgres'] })
    .required(),
  THROTTLE_TTL: Joi.number().integer().positive().default(60000),
  THROTTLE_LIMIT: Joi.number().integer().positive().default(100),
});
