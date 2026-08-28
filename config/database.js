import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import config from "./config.cjs";

dotenv.config();
const env = process.env.NODE_ENV || "development";
const { database, username, password, host, port, dialect } = config[env];

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

const sequelize = new Sequelize(database, username, password, options);

export default sequelize;
