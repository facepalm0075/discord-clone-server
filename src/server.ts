import app from "./app";
import { socketServer } from "./routes/chat";

const server = app.listen(3003, () => {
	console.log("listening to port 3003...");
});

socketServer(server);
