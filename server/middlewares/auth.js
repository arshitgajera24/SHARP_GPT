import jwt from "jsonwebtoken"
import { User } from "../models/User.js";

export const protect = async (req, res, next) => {
    let token = req.headers.authorization;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decoded.id;

        const user = await User.findById(userId).select("-password");
        if(!user)
        {
            return res.json({ success: false, message: "Not Authorized, User not Found"});
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({ success: false, message: "Token failed, Not Authorized" });
    }
}