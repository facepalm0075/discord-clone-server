import express from "express";
import cors from "cors";
import { getRooms } from "./routes/getRooms";

const app = express();
app.use(cors());
app.use("/get-rooms", getRooms);

export default app;
