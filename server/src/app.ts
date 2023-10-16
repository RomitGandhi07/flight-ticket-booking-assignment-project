import express from "express";
import { travelersRouter } from "./routers/travelers";
const app = express();

app.use(express.json());

// Travelers Router
app.use("/travelers", travelersRouter);

export default app;