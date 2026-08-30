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

const { database, username, password, host, port, dialect } = config[env];
let sequelize;

if (env === "production") {
    sequelize = new Sequelize(database, username, password, {
        host,
        port,
        dialect,
        dialectOptions: { 
            ssl: { 
                require: true, 
                rejectUnauthorized: false
            } 
        },
        ...options,
    });
    
} else {
    sequelize = new Sequelize(database, username, password, {
        host,
        dialect,
        port,
        ...options,
    });
}

export default sequelize;
