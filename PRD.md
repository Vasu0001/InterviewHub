# Product Requirements Document (PRD)

**Project Name:** InterviewHub – Real-Time Technical Interview Platform
**Version:** 1.0
**Tech Stack:** MERN (MongoDB, Express.js, React.js, Node.js), Socket.io, WebRTC

## 1. Product Overview

InterviewHub is a web-based, real-time technical interview platform designed to streamline the remote hiring process. It provides a centralized environment for interviewers and candidates to conduct technical assessments using secure authentication, live collaborative coding, real-time chat, and peer-to-peer video communication.

## 2. Problem Statement

Technical interviews currently require multiple disconnected tools (e.g., Zoom for video, Google Docs or generic IDEs for coding, and spreadsheets for tracking). This creates a fragmented, unprofessional experience and makes it difficult to maintain centralized records of a candidate's performance.

## 3. Goals & Objectives

- **Primary Goal:** Build a full-stack, real-time web application that handles live data synchronization and peer-to-peer networking.
- **Technical Objective:** Demonstrate advanced backend architecture, state management, and real-time socket communication.
- **Business Objective:** Provide a seamless, all-in-one technical interview experience with integrated feedback tracking.

## 4. Target Users

- **Interviewer (HR / Technical Lead):** Needs to generate secure interview links, monitor candidate coding in real-time, communicate via video/chat, and leave structured post-interview feedback.
- **Candidate (Job Seeker):** Needs a frictionless, no-download required interface to write code, communicate with the interviewer, and demonstrate their technical skills.

## 5. Phased Execution Strategy

To ensure steady progress and manageable learning curves (specifically for React state management and WebRTC), the project will be built in four distinct milestones:

### Milestone 1: The Core Foundation (Authentication & CRUD)

- User registration and secure login using JWT and bcrypt.
- Role-based access (Interviewer vs. Candidate).
- Dashboard for Interviewers to generate unique, shareable Interview Room links.
- MongoDB schema setup for `Users` and `Interviews`.

### Milestone 2: Real-Time Data (Sockets & State)

- Integration of `Socket.io` for bi-directional communication.
- **Live Chat:** Real-time text messaging within the interview room.
- **Collaborative Code Editor (Key Feature):** A shared text area where keystrokes from the candidate are instantly reflected on the interviewer's screen, and vice versa.

### Milestone 3: Audio/Video Communication (WebRTC)

- Implementation of peer-to-peer video and audio streaming using WebRTC.
- Using the existing Socket.io server as a signaling mechanism to connect peers.
- UI controls for muting audio and toggling the camera.

### Milestone 4: Polish, History & Deployment

- Post-interview feedback forms (Ratings and Notes).
- Dashboard view of "Past Interviews" and their associated feedback.
- Full production deployment (Frontend on Vercel, Backend on Render, DB on MongoDB Atlas).

## 6. Database Schema (High-Level)

**User Collection**

- `_id`: ObjectId
- `name`: String
- `email`: String (Unique)
- `password`: String (Hashed)
- `role`: String (Enum: 'Interviewer', 'Candidate')
- `createdAt`: Timestamp

**Interview Collection**

- `_id`: ObjectId
- `roomId`: String (Unique UUID)
- `interviewerId`: ObjectId (Ref: User)
- `candidateName`: String (Temporary identifier for guests)
- `status`: String (Enum: 'Scheduled', 'Completed')
- `feedback`: Object (Rating 1-5, Notes)
- `createdAt`: Timestamp

## 7. Non-Functional Requirements

- **Security:** Passwords must be hashed. API routes protecting interview data must require a valid JWT.
- **Performance:** Code editor synchronization must have sub-200ms latency. Video connections should initialize within 3 seconds.
- **Scalability:** The backend must be structured modularly (separate files for routes, controllers, and socket handlers) to allow for future expansion.

## 8. Future Enhancements (Post-V1)

- Code execution engine (compiling and running the written code via a third-party API like Judge0).
- Screen sharing capabilities.
- Interview recording.

## 9. Success Metrics

- **Technical:** Real-time code synchronization occurs with less than 200ms latency.
- **Technical:** WebRTC video connections initialize within 3 seconds of joining the room.
- **User:** A user can successfully register, log in, and generate an interview link in under 60 seconds.
- **Deployment:** Both frontend and backend are successfully deployed with 99% uptime during testing phases.

## 10. User Flow

**Interviewer Flow**

1. Register / Log in to the platform.
2. Land on the Dashboard and click "Create New Interview."
3. Copy the generated unique Room URL.
4. Send the URL to the candidate.
5. Join the room, conduct the interview (video + collaborative coding).
6. Click "End Interview" and submit the feedback form.

**Candidate Flow**

1. Receive the Interview Room URL from the interviewer.
2. Click the link (No login required for guests/candidates).
3. Enter their name to join the room.
4. Write code collaboratively and communicate with the interviewer.
5. Leave the room when finished.

## 11. API & Socket Requirements (V1)

**REST APIs (Express/MongoDB)**

- `POST /api/auth/register` - Create a new Interviewer account.
- `POST /api/auth/login` - Authenticate and return JWT.
- `POST /api/interview/create` - Generate a new interview room (Requires JWT).
- `GET /api/interview/history` - Fetch past interviews for the dashboard (Requires JWT).
- `POST /api/interview/:id/feedback` - Save post-interview notes.

**WebSocket Events (Socket.io)**

- `join-room` - Triggered when a user enters the interview URL.
- `code-change` - Emits the current state of the text editor to the other peer.
- `chat-message` - Broadcasts a text message to the room.
- `leave-room` - Triggers cleanup when a user disconnects.

## 12. UI Pages List

1. **Landing / Login Page:** Simple entry point with email/password forms.
2. **Interviewer Dashboard:** Lists past interviews and holds the "Create Room" button.
3. **The Interview Room:** The core interface. Split screen: Code editor on the left, Video feeds and chat panel on the right.
4. **Feedback Modal:** A popup that appears for the interviewer when they end the call.

## 13. Acceptance Criteria

- **Milestone 1:** A user can create an account, log in, and a JWT is securely stored in the browser.
- **Milestone 2:** Two different browsers can open the same Interview Room URL and see each other's text in the chat and code editor instantly.
- **Milestone 3:** Two different browsers can connect via WebRTC and transmit clear audio and video.
- **Milestone 4:** The interviewer can submit a rating and notes, which successfully save to the MongoDB database and appear on their dashboard.
- **Final:** The application is publicly accessible via Vercel and Render URLs.
