import { Router } from "express"
import { protect } from "../middlewares/auth.js";
import * as chatControllers from "../controllers/chat.controller.js";

const chatRoutes = Router();

chatRoutes.route("/create").get(protect, chatControllers.createChat);
chatRoutes.route("/get").get(protect, chatControllers.getChats);
chatRoutes.route("/delete").post(protect, chatControllers.deleteChat);

export default chatRoutes;