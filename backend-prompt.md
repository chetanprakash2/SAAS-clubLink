## Prompt for AI Backend Generation: ClubLink Application

### High-Level Goal

Your task is to create a complete backend for a "ClubLink" web application. The frontend is built with Next.js and React. The backend must handle user authentication, provide data for club subdivisions (like members and notices), and facilitate real-time chat and virtual meetings.

### Core Technology Stack

*   **Framework:** Node.js with Express.js.
*   **Database:** MongoDB with Mongoose for data modeling.
*   **Authentication:** JSON Web Tokens (JWT) for securing API endpoints. Use `bcrypt` for password hashing.
*   **Real-time Communication:**
    *   **Chat:** Use `Socket.IO` for the real-time chat functionality.
    *   **Virtual Meetings:** Implement a WebRTC signaling server using `Socket.IO` to exchange session descriptions (SDP) and ICE candidates between clients.
*   **Middleware:** Use `cors` to handle cross-origin requests from the Next.js frontend.

### Project Context

ClubLink is a platform for managing club activities. The application is structured around "subdivisions" (e.g., Music, Dance, Tech). Users select a subdivision and then access features like a member directory, a notice board, a chat room, and virtual meetings specific to that subdivision. The frontend already has UI components for all these features.

### Detailed Feature Requirements & API Endpoints

#### 1. Authentication

Create the following API endpoints for user account management:

*   `POST /api/auth/register`
    *   **Request Body:** `{ "name": "string", "email": "string", "password": "string" }`
    *   **Functionality:** Hash the password using `bcrypt`. Create a new user in the database. Return the created user object (without the password) and a JWT.
*   `POST /api/auth/login`
    *   **Request Body:** `{ "email": "string", "password": "string" }`
    *   **Functionality:** Find the user by email. Compare the provided password with the stored hash using `bcrypt`. If they match, return a JWT. Otherwise, return an error.
*   `GET /api/auth/me`
    *   **Functionality:** This should be a protected route. A JWT must be provided in the `Authorization` header (`Bearer <token>`). It should verify the token and return the currently logged-in user's data (without the password).

#### 2. Data Models (Mongoose Schemas)

Define the following Mongoose schemas:

*   **User:**
    *   `name`: { type: String, required: true }
    *   `email`: { type: String, required: true, unique: true }
    *   `password`: { type: String, required: true }
    *   `avatar`: { type: String, default: "https://placehold.co/40x40.png" }
*   **Member:**
    *   `name`: { type: String, required: true }
    *   `email`: { type: String, required: true }
    *   `role`: { type: String, enum: ["Admin", "Member"], default: "Member" }
    *   `joined`: { type: Date, default: Date.now }
    *   `subdivision`: { type: String, required: true } // e.g., 'music', 'tech'
*   **Notice:**
    *   `title`: { type: String, required: true }
    *   `content`: { type: String, required: true }
    *   `author`: { type: String, required: true }
    *   `date`: { type: Date, default: Date.now }
    *   `subdivision`: { type: String, required: true }

#### 3. Subdivision Data API

Create protected API endpoints to fetch data based on the subdivision. The subdivision name (e.g., 'music') will be a URL parameter.

*   `GET /api/subdivisions/:subdivision/members`
    *   **Functionality:** Fetch all members belonging to the specified `subdivision`.
*   `GET /api/subdivisions/:subdivision/notices`
    *   **Functionality:** Fetch all notices for the specified `subdivision`.

#### 4. Real-time Chat (Socket.IO)

Set up a Socket.IO server integrated with the Express app.

*   **Namespaces/Rooms:** Use Socket.IO rooms to isolate chats by `subdivision`. When a user connects to the chat, they should join a room based on their current subdivision (e.g., `socket.join('tech-chat')`).
*   **Events to Handle:**
    *   `connection`: When a user connects.
    *   `join_room`: A client-emitted event to join a specific subdivision's chat room.
    *   `send_message`: A client-emitted event with a message payload: `{ room: string, message: { user: object, text: string, timestamp: string } }`.
    *   `receive_message`: A server-emitted event to broadcast the new message to all clients in the corresponding room.

#### 5. Virtual Meetings (WebRTC Signaling with Socket.IO)

Use Socket.IO for the signaling layer required by WebRTC. This allows peers to find each other and establish a direct connection.

*   **Room Management:**
    *   When a user joins a meeting for a subdivision, they should join a specific Socket.IO room (e.g., `meeting-tech`).
*   **Signaling Events to Implement:**
    *   `join_meeting`: Client sends this to join a meeting room. The server should notify other clients in the room that a new user has joined.
    *   `offer`: A client sends a WebRTC offer to another client (or all clients) in the room. The server's job is to forward this message to the intended recipient(s). Payload: `{ targetSocketId: string, sdp: object }`.
    *   `answer`: A client sends a WebRTC answer back to the offering client. The server forwards this. Payload: `{ targetSocketId: string, sdp: object }`.
    *   `ice_candidate`: Clients will exchange ICE candidates to establish the peer-to-peer connection. The server must forward these messages between the relevant clients. Payload: `{ targetSocketId: string, candidate: object }`.
    *   `leave_meeting`: When a user leaves, notify all other participants in the room so they can remove the user's video stream.

This prompt provides the necessary structure and detail for an AI to generate a functional backend that will integrate smoothly with your existing frontend.
