import { Router, Request, Response } from "express";
import { channels } from "./chat";

const router = Router();

router.get("/", (req: Request, res: Response) => {
	res.status(200).json(JSON.stringify({ message: channels }));
});

export { router as getRooms };
