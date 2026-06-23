import express from "express";
import { startServer } from "./server.js";
import AuthRouter from "./routes/auth.route.js";

const app = express();
app.use(express.json());


app.use("/api/v1", AuthRouter);


app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

startServer(app);

export default app;