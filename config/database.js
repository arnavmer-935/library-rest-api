import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import config from "./config.cjs";

dotenv.config();

const env = process.env.NODE_ENV || "development";

const options = {
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

let sequelize;

if (env === "production" && process.env.PUBLIC_URL) {
    sequelize = new Sequelize(process.env.PUBLIC_URL, {
        dialect: "postgres",
        dialectOptions: { 
            ssl: { 
                require: true, 
                rejectUnauthorized: false
            } 
        },
        ...options,
    });
} else {
    const { database, username, password, host, port, dialect } = config[env];
    sequelize = new Sequelize(database, username, password, {
        host,
        dialect,
        port,
        ...options,
    });
}

export default sequelize;
