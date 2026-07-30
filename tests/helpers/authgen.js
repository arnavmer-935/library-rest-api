import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (user) => {
    return jwt.sign(
        { user_id: user.user_id, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "24h" }
    );
};

const authHeader = (user) => {
    return { Authorization: `Bearer ${generateToken(user)}` };
};

export default authHeader;