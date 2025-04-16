var param_dot_env = '';
process.argv.forEach(function(val, index, array) {
    console.log("config.js " + val);
    if (val.indexOf('NODE_ENV') >= 0) {
        param_dot_env = val.split('=')[1];
    }
});
console.log('param_dot_env : ' +(param_dot_env === '' ? '' : (param_dot_env)))

const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

console.log('env path : '+'../../.env'+(param_dot_env===''?'':('.'+param_dot_env)));

dotenv.config({ path: path.join(__dirname, '../../.env'+(param_dot_env===''?'':('.'+param_dot_env))) });

const envVarsSchema = Joi.object()
  .keys({
    // NODE_ENV: Joi.string().valid('production', 'dev' , 'test').required(),
    NODE_ENV: Joi.string().valid('prod', 'dev', 'local').required(),
    PORT: Joi.number().default(3000),
    QDC_MSSQL_DBUSER: Joi.string().required().description('Database user'),
    QDC_MSSQL_DBPASSWORD: Joi.string().required().description('Database password'),
    QDC_MSSQL_DBNAME: Joi.string().required().description('Database name'),
    QDC_MSSQL_DBHOST: Joi.string().required().description('Database host'),
    QDC_MSSQL_DBPORT: Joi.number().default(5432).required().description('Database host'),
    QDC_MSSQL_DBDIALECT: Joi.string().default('postgres').required().description('Database dialect'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,

  scApi: envVars.VUE_APP_SC_API_URL,
  cmnApi: envVars.VUE_APP_CMN_NODE_API_URL,
  commonApi: envVars.VUE_APP_COMMON_API_URL,
  qdc_db: {
    username: envVars.QDC_MSSQL_DBUSER,
    password: envVars.QDC_MSSQL_DBPASSWORD,
    database: envVars.QDC_MSSQL_DBNAME,

    host: envVars.QDC_MSSQL_DBHOST,
    dialect: envVars.QDC_MSSQL_DBDIALECT,
    dialectOptions: {
      options:{requestTimeout: 450000}
    },
    port: envVars.QDC_MSSQL_DBPORT,
    pool: {
      max: 500,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    // instanceName: envVars.QDC_MSSQL_DBINSTANCE
  },
  platform_db: {
    username: envVars.PLATFORM_DB_USER ,
    password: envVars.PLATFORM_DB_PASSWORD,
    database: envVars.PLATFORM_DB_NAME,
    host: envVars.PLATFORM_DB_HOST,
    port: envVars.PLATFORM_DB_PORT,
  },
  
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
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
