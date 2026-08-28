const dotenv = require("dotenv");

dotenv.config();

const config = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
  },

  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWD,
    database: process.env.TEST_DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
  },

	production: {
		    username: process.env.MYSQLUSER,
		    password: process.env.MYSQLPASSWORD,
		    database: process.env.MYSQLDATABASE,
		    host: process.env.MYSQLHOST,
		    port: process.env.MYSQLPORT,
		    dialect: "mysql",
	}
};

module.exports = config;
