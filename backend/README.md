# ClubLink Backend

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your MongoDB URI, JWT secret, and frontend URL.
3. **Start MongoDB:**
   - Make sure MongoDB is running locally or use a cloud provider.
4. **Run the backend server:**
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000` by default.

## API Endpoints
- **Auth:** `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- **Subdivision Data:** `/api/subdivisions/:subdivision/members`, `/api/subdivisions/:subdivision/notices`
- **Socket.IO Namespaces:** `/chat` (real-time chat), `/meeting` (WebRTC signaling)

## Integration
- Set `CLIENT_URL` in `.env` to your frontend (e.g., `http://localhost:3000`).
- Frontend should use these endpoints for authentication, data, and real-time features.

## Production
- Use a production MongoDB URI and a strong JWT secret.
- Deploy backend and frontend to cloud platforms (e.g., Vercel for frontend, Render/Heroku for backend).
