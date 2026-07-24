import { Sequelize } from "sequelize";
import { Op } from Sequelize;
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import Users from "../models/User";
import ApiError from "../services/apiError";

dotenv.config();
export const registerUser = async (req, res, next) => {

    const { username, email, password } = req.body;
    try {

        const passwordHash = await bcrypt.hash(password, 10);
        const registeredUser = await Users.create({
            username, email, passwordHash
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

    const { identifier, password } = req.body;

    try {

        const user = await Users.findOne({
            where: {
                [Op.or]: {
                    username: identifier,
                    email: identifier
                }
            }
        });
    
        if (!user) {
            throw ApiError.unauthorized("Invalid login credentials");
        }

        const isPasswdMatch = await bcrypt.compare(password, user.get(passwordHash));

        if (!isPasswdMatch) {
            throw ApiError.unauthorized("Invalid login credentials");
        }

        const { user_id, role, passwordHash, ...userInfo } = user.get({ plain: true });

        const token = jwt.sign({ user_id, role }, process.env.JWT_SECRET_KEY, {
            expiresIn: "24h"
        });

        return res.status(200).json({
            "success": true,
            token,
            "user": userInfo
        });

    }

    catch (err) {
        next(err);
    }

}