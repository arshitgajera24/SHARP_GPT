import { Router } from "express"
import { protect } from "../middlewares/auth.js";
import * as messageController from "../controllers/message.controller.js";

const messageRoutes = Router();

messageRoutes.route("/text").post(protect, messageController.textMessageController);
messageRoutes.route("/image").post(protect, messageController.imageMessageController);

export default messageRoutes;