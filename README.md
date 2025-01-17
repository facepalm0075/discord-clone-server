# Discord Clone

### Short Description

This project is a server for streaming user voice and text data, built using **Node.js**, **Express**, and **Socket.IO**.

---

## Features

- Support for **multi-room** functionality.
- Retrieve a list of room names and their count via a GET request to `/get-rooms`.
- For changing rooms names and number, edit the array "Channels" in `/src/routes/getRooms.ts`
- Room and channel management through the following files:
  - `/src/routes/chat.ts` for managing Socket.IO
  - `/src/routes/getRooms.ts` for retrieving room names

---

## How to Run

1. Clone the repository:

   ```bash
   git clone https://github.com/facepalm0075/discord-clone-server.git
   cd discord-clone-server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm run start
   ```

4. The server will run on port `http://localhost:3003`.

---

## Project Structure

```
project-root
├── src
│   ├── routes
│   │   ├── chat.ts        # Manages Socket.IO
│   │   └── getRooms.ts    # Handles GET requests for retrieving room names
│   ├── app.ts             # Main application configuration
│   └── server.ts          # Main server entry point
├── package.json           # Project details and dependencies
└── README.md              # Project documentation
```

---

### Author

This project was developed by **Pouya Bahmanyar**.
