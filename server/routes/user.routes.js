import { Router } from "express"
import * as userControllers from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.js";

const userRoutes = Router();

userRoutes.route("/register").post(userControllers.registerUser);
userRoutes.route("/login").post(userControllers.loginUser);
userRoutes.route("/data").get(protect, userControllers.getUser);
userRoutes.route("/published-images").get(protect, userControllers.getPublishedImages);

export default userRoutes;