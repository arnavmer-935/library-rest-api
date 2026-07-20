import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const name = process.env.DB_NAME;
const username = process.env.DB_USER;
const passwd = process.env.DB_PASSWD;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const dialect = process.env.DB_DIALECT;

const options = {
    host,
    dialect,
    port,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

const sequelize = new Sequelize(name, username, passwd, options);

export default sequelize;