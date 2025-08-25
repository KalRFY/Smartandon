// src/config/config.js
const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

// Tentukan environment, default dev
const env = process.env.NODE_ENV || 'dev';

// Load .env sesuai NODE_ENV → contoh: .env.dev, .env.prod, .env.local
dotenv.config({
  path: path.resolve(process.cwd(), `.env.${env}`),
});

// Validasi semua environment variables
const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('prod', 'dev', 'local').default('dev'),
    PORT: Joi.number().default(3000),

    // QDC DB MySQL
    USER_DB_NEW: Joi.string().required(),
    PASSWORD_DB_NEW: Joi.string().required(),
    NAME_DB_NEW: Joi.string().required(),
    HOST_DB_NEW: Joi.string().required(),
    DB_PORT: Joi.number().default(3306),
    QDC_MSSQL_DBDIALECT: Joi.string().default('mysql'),

    // QDC PostgreSQL
    QDC_PG_USER: Joi.string(),
    QDC_PG_PASSWORD: Joi.string(),
    QDC_PG_NAME: Joi.string(),
    QDC_PG_HOST: Joi.string(),
    QDC_PG_PORT: Joi.number().default(5432),

    // Platform DB
    PLATFORM_DB_USER: Joi.string(),
    PLATFORM_DB_PASSWORD: Joi.string(),
    PLATFORM_DB_NAME: Joi.string(),
    PLATFORM_DB_HOST: Joi.string(),
    PLATFORM_DB_PORT: Joi.number(),

    // JWT
    JWT_SECRET: Joi.string().required(),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().default(10),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number().default(10),

    // Email / SMTP
    SMTP_HOST: Joi.string(),
    SMTP_PORT: Joi.number(),
    SMTP_USERNAME: Joi.string(),
    SMTP_PASSWORD: Joi.string(),
    EMAIL_FROM: Joi.string(),

    // Optional APIs (buat Vue app kalau perlu)
    VUE_APP_SC_API_URL: Joi.string().allow(''),
    VUE_APP_CMN_NODE_API_URL: Joi.string().allow(''),
    VUE_APP_COMMON_API_URL: Joi.string().allow(''),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Konstruksi object config final
const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,

  // APIs
  scApi: envVars.VUE_APP_SC_API_URL,
  cmnApi: envVars.VUE_APP_CMN_NODE_API_URL,
  commonApi: envVars.VUE_APP_COMMON_API_URL,

  // Databases
  qdc_db: {
    username: envVars.USER_DB_NEW,
    password: envVars.PASSWORD_DB_NEW,
    database: envVars.NAME_DB_NEW,
    host: envVars.HOST_DB_NEW,
    dialect: envVars.QDC_MSSQL_DBDIALECT,
    port: envVars.DB_PORT,
    dialectOptions: {
      connectTimeout: 60000,
      acquireTimeout: 60000,
      timeout: 60000,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  qdc_pg_db: {
    username: envVars.QDC_PG_USER || 'tpm_user',
    password: envVars.QDC_PG_PASSWORD || 'postgres',
    database: envVars.QDC_PG_NAME || 'tpm_system',
    host: envVars.QDC_PG_HOST || '10.65.12.22',
    dialect: 'postgres',
    port: envVars.QDC_PG_PORT,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    searchPath: 'mt_sys',
  },
  platform_db: {
    username: envVars.PLATFORM_DB_USER,
    password: envVars.PLATFORM_DB_PASSWORD,
    database: envVars.PLATFORM_DB_NAME,
    host: envVars.PLATFORM_DB_HOST,
    port: envVars.PLATFORM_DB_PORT,
  },

  // JWT
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },

  // Email
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
};

module.exports = config;
