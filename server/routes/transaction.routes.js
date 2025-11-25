import { Router } from "express"
import { protect } from "../middlewares/auth.js";
import * as transactionControllers from "../controllers/transaction.controller.js";

const transactionRoutes = Router();

transactionRoutes.route("/plans").get(transactionControllers.getPlans);
transactionRoutes.route("/purchase").post(protect, transactionControllers.purchasePlan);

export default transactionRoutes;