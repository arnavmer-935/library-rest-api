const dotenv = require("dotenv");

dotenv.config();

const config = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
  },

  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWD,
    database: process.env.TEST_DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
  },

  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWD,
    database: process.env.PROD_DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
  },
};

module.exports = config;