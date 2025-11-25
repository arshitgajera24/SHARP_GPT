import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import messageRoutes from "./routes/message.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import { stripeWebhooks } from "./controllers/webhooks.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 2505;

await connectDB();

app.post("/api/stripe", express.raw({ type: "application/json"}), stripeWebhooks);

//* Middleware
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET, POST, PUT, DELETE, PUT, PATCH"],
    credentials: true,
  })
);
app.use(express.json());

//* Routes
app.get("/", (req, res) => {
    res.send("Server is 🏃‍♂️‍➡️");
})

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/transaction", transactionRoutes);

app.listen(PORT, () => {
    console.log(`💸 Server is Running at http://localhost:${PORT}`);
})
