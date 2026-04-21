# 🚀 InterviewHub: Real-Time Technical Interview Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_Project-blue?style=for-the-badge)](https://interviewhub-frontend.vercel.app)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]()
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)]()
[![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)]()
[![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=for-the-badge&logo=webrtc&logoColor=white)]()
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)]()

A full-stack, real-time collaborative coding and video-conferencing platform designed to streamline technical interviews. Built to provide a distraction-free, zero-setup environment where candidates can write code, and interviewers can evaluate them in real-time.

## 💡 The Problem It Solves

Conducting technical interviews usually requires juggling three different tools: a video call (Zoom/Meet), a collaborative document (Google Docs), and a local IDE to actually test the code. InterviewHub centralizes this process into a single, browser-based environment with built-in A/V communication and an automated code execution engine.

## ✨ Core Features

- **🎥 Peer-to-Peer Video & Audio:** Integrated WebRTC for low-latency, high-fidelity communication without external meeting links.
- **💻 Collaborative Code Editor:** Integrated Monaco Editor (the engine behind VS Code) supporting syntax highlighting for JavaScript, Python, Java, and C++.
- **⚡ Real-Time State Sync:** Powered by Socket.io to instantly synchronize code typing, language selection, and console outputs between the interviewer and candidate.
- **🤖 Live Auto-Judge Engine:** A custom backend interceptor that injects hidden test cases into the candidate's code, executes it via the JDoodle API, and returns real-time Pass/Fail UI badges.
- **🔒 Secure Authentication:** JWT-based auth with HTTP-only cookies, password hashing (bcrypt), and defense-in-depth data validation (Express-Validator).
- **📚 Question Library & History:** Role-based dashboards allowing interviewers to manage a question bank, generate unique room links, and review saved candidate code post-interview.

## 🏗️ System Architecture

This project is structured as a **Monorepo**, separating the client and server while keeping them easily maintainable in a single repository.

### Frontend (`/interviewhub-frontend`)

- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS + Lucide Icons
- **State & Routing:** React Router DOM, React Hooks
- **Key Libraries:** `@monaco-editor/react`, `socket.io-client`, `axios`

### Backend (`/interviewhub-backend`)

- **Runtime:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Real-time:** Socket.io
- **Code Execution:** JDoodle Compiler API
- **Security:** `jsonwebtoken`, `bcrypt`, `express-validator`, `cors`

## 🧠 Technical Challenges & Solutions

Building a real-time platform introduced several complex edge cases that required architectural pivots:

1. **The "God Component" UI Refactor:**
   Initially, the Dashboard managed the sidebar, library, past interviews, and modal states simultaneously. As the project scaled, this became a bottleneck. I refactored the UI into strict Container vs. Presenter patterns, isolating state down to granular components (e.g., `CreateRoomModal`, `CandidateDashboard`) to prevent unnecessary re-renders.

2. **Auto-Judge Test Case Injection:**
   Sending raw candidate code to an execution API doesn't allow for automated testing unless the candidate manually writes `console.log()` statements. I solved this by building a Regex-based interceptor on the Node.js backend that finds the candidate's function signature, injects hidden test-case runner code, and parses the `stdout` to return clean `Pass/Fail` JSON to the React frontend.

3. **Mongoose Subdocument Data Loss:**
   When copying a `Question` document into a live `Interview` room document, Mongoose was silently stripping the embedded `testCases` array. I discovered this was due to strict schema definitions and resolved it by explicitly defining the nested `testCaseSchema` within the `Interview` model, ensuring deep-cloning of the data for live rooms.

## 🚀 Local Installation & Setup

Want to run this locally? You will need two terminal windows.

**1. Clone the repository:**

```bash
git clone [https://github.com/yourusername/InterviewHub.git](https://github.com/yourusername/InterviewHub.git)
cd InterviewHub
```

**2. Setup the Backend:**

```bash
cd interviewhub-backend
npm install
```

_Create a `.env` file in the backend directory:_

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your_jwt_secret
JDOODLE_CLIENT_ID=your_jdoodle_id
JDOODLE_CLIENT_SECRET=your_jdoodle_secret
```

_Start the server:_

```bash
npm run dev
```

**3. Setup the Frontend:**

```bash
# Open a new terminal
cd interviewhub-frontend
npm install
```

_Create a `.env` file in the frontend directory:_

```env
VITE_BACKEND_URL=http://localhost:8000
```

_Start the React app:_

```bash
npm run dev
```

### Visual Data Flow

```mermaid
graph TD
    Client[Candidate/Interviewer Browser] -->|HTTPS / React UI| Vercel(Frontend Hosted on Vercel)

    Client <-->|WebRTC Peer-to-Peer| PeerJS[Direct Video/Audio Stream]
    Client <-->|Socket.io Real-Time| Render(Backend Hosted on Render)

    Render -->|CRUD Operations| MongoDB[(MongoDB Atlas)]
    Render -->|Code Execution| JDoodle[JDoodle Compiler API]

    subgraph Backend Server
    Render
    end

    subgraph External Services
    MongoDB
    JDoodle
    end


## 🌍 Deployment
* **Frontend:** Hosted on [Vercel](https://vercel.com).
* **Backend:** Hosted on [Render](https://render.com).
* **Database:** Hosted on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
```
