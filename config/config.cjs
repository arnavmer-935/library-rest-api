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
		    username: process.env.PROD_DB_USER,
		    password: process.env.PROD_DB_PASSWD,
		    database: process.env.PROD_DB_NAME,
		    host: process.env.PROD_DB_HOST,
		    port: process.env.PROD_DB_PORT,
		    dialect: "postgres",
        dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        },
        migrationStorage: "sequelize"
    }
	}
};

module.exports = config;
