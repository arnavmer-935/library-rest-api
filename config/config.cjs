const dotenv = require("dotenv");

dotenv.config();

const config = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
  },

  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWD,
    database: process.env.TEST_DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
  },

	production: {
		    username: process.env.MYSQLUSER,
		    password: process.env.MYSQLPASSWORD,
		    database: process.env.MYSQLDATABASE,
		    host: process.env.MYSQLHOST,
		    port: process.env.MYSQLPORT,
		    dialect: "postgres",
	}
};

module.exports = config;
