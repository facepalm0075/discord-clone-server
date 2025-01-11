import { Server } from "http";
import { Server as ioServer, Socket } from "socket.io";

export const channels = ["Room-1", "Room-2", "Room-3"];

type statusType = {
	muted: boolean;
	deafen: boolean;
};

type nameType = {
	userName: string;
	clientId: string;
};

type userInRoomType = {
	id: string;
	name: nameType;
	status: statusType;
};

type usersRoomsType = {
	[key: string]: userInRoomType[];
};

let usersRoom: usersRoomsType = {};

channels.forEach((item) => {
	usersRoom[item] = [];
});

export const socketServer = (server: Server) => {
	// socket io server
	const io = new ioServer(server, {
		cors: {
			origin: true,
		},
	});

	const leaveJoinedRooms = (socket: Socket) => {
		const temp = socket.rooms;
		temp.forEach((item) => {
			if (item && channels.includes(item)) {
				console.log(`removing user ${socket.id} from room ${item}`);
				socket.leave(item);
				usersRoom[item] = usersRoom[item].filter((i) => i.id !== socket.id);
			}
		});
	};

	const chatNameSpace = io.of("/chat");

	chatNameSpace.on("connection", (socket) => {
		socket.emit("get-all-rooms", channels);

		console.log(`user ${socket.id} connected`);

		socket.on("audio-input", (data: any, room: string | null, name: nameType) => {
			if (room && name) {
				socket.to(room).emit("audio-data", data, name);
			}
		});

		socket.on("audio-input-cancel", (room: string | null, name: nameType) => {
			if (room && name) {
				socket.to(room).emit("audio-input-canceled", name);
			}
		});

		socket.on("send-message", (name: nameType, message: string, room: string | null) => {
			if (room) {
				socket.to(room).emit("get-message", name, message);
				console.log(`user ${socket.id} emited 'from:${name.userName} text:${message}' to room ${room}`);
			}
		});

		socket.on("join-to", (room: string | null, name: nameType, status: statusType) => {
			if (room) {
				leaveJoinedRooms(socket);
				socket.join(room);
				usersRoom[room] = usersRoom[room]
					? [...usersRoom[room], { id: socket.id, name, status }]
					: [{ id: socket.id, name, status }];
				console.log(`user ${socket.id} joined to room ${room}`);
				chatNameSpace.emit("rooms-status-changed", usersRoom);
			}
		});

		socket.on("get-rooms-status", () => {
			socket.emit("rooms-status", usersRoom);
		});

		socket.on("leave-joined-rooms", () => {
			leaveJoinedRooms(socket);
			chatNameSpace.emit("rooms-status-changed", usersRoom);
		});

		socket.on("user-status", (data: statusType) => {
			channels.forEach((room) => {
				usersRoom[room] = usersRoom[room].map((item) => {
					return item.id === socket.id ? { ...item, status: data } : item;
				});
			});
			chatNameSpace.emit("user-status-changed", usersRoom);
		});

		socket.on("disconnect", () => {
			console.log("user dced " + socket.id);
			leaveJoinedRooms(socket);
			channels.forEach((item) => {
				usersRoom[item] = usersRoom[item]?.filter((i) => i.id !== socket.id);
			});
			chatNameSpace.emit("rooms-status-changed", usersRoom);
		});
	});
};
