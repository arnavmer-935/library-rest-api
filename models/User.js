import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Users = sequelize.define("Users", {

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    username: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [3, 30],
          is: /^[A-Za-z0-9_]+$/i,
        }
    },

    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            isEmail: true,
        },
        set(value) {
            this.setDataValue("email", value.trim().toLowerCase());
        }
    },

    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "password_hash",
        validate: {
            notEmpty: true,
        }
    },

    role: {
        type: DataTypes.ENUM("USER", "ADMIN"),
        allowNull: false,
        defaultValue: "USER"
    }
},  {
      tableName: "users",
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    });



export default Users;