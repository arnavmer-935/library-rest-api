import { Sequelize } from "sequelize";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import Users from "../models/User.js";
import ApiError from "../services/apiError.js";

dotenv.config();
export const registerUser = async (req, res, next) => {

    const { username, email, password } = req.validated.body;
    try {

        const passwdHash = await bcrypt.hash(password, 10);
        const registeredUser = await Users.create({
            username, email, passwordHash: passwdHash
        });

        const { passwordHash, ...user } = registeredUser.get({ plain: true });

        return res.status(201).send({
            "success": true,
            "message": "User registered successfully",
            user
        });
    }

    catch (err) {
        next(err);
    }
};

export const loginUser = async (req, res, next) => {

    const { identifier, password } = req.validated.body;

    try {

        const user = await Users.findOne({
            where: {
                [Op.or]: {
                    username: identifier,
                    email: identifier
                }
            },

            raw: true
        });

        const isPasswdMatch = await bcrypt.compare(password, user ? user.passwordHash : process.env.DUMMY_HASH);
    
        if (!user || !isPasswdMatch) {
            throw ApiError.unauthorized("Invalid login credentials");
        }

        const { user_id, role, passwordHash, ...userInfo } = user;

        const token = jwt.sign({ user_id, role }, process.env.JWT_SECRET_KEY, {
            expiresIn: "24h"
        });

        return res.status(200).json({
            "success": true,
            token,
            "user": { user_id, ...userInfo }
        });

    }

    catch (err) {
        next(err);
    }

}