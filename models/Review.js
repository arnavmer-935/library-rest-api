import sequelize from "../config/database.js";
import Users from "./User.js";
import Books from "./Book.js";

import { DataTypes } from "sequelize";

const Reviews = sequelize.define("Reviews", {

    review_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    rating: {
        type: DataTypes.DECIMAL(2,1),
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        }
    },

    comment: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 255]
        }
    },

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Users,
            key: "user_id"
        },
        onDelete: "CASCADE"
    },

    book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Books,
            key: "book_id"
        },
        onDelete: "CASCADE"
    }
  
},  
{
    tableName: "reviews",
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

export default Reviews;