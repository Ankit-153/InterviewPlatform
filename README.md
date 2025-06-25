IntervuDesk
Technical Interview Platform
IntervuDesk is a comprehensive platform designed to streamline technical interviews with real-time coding, video meetings, and automated assessment tools.

IntervuDesk Logo

Features
For Interviewers
User Role Management: Easily switch users between candidate and interviewer roles
Video Call Creation: Start instant meetings or schedule future interviews
Recording Management: Access, share and delete interview recordings
Real-time Code Observation: Watch candidates solve problems in real-time
Custom Problem Library: Choose from various coding challenges or add your own
For Candidates
Integrated Coding Environment: Solve problems in JavaScript, Python, Java, or C++
Multiple Question Types: Practice with a variety of algorithm and data structure problems
Live Code Execution: Run and test code directly in the browser
Interview Preparation: Access scheduled interviews and meeting links
Collaborative Features
Real-time Code Sharing: Synchronized code editing with multiple participants
Video Conferencing: High-quality video meetings with screen sharing
Interview Recording: Automatically save interviews for later review
Shared Code Execution: Everyone can run and test the code during interviews
Tech Stack
Frontend: Next.js, React, TypeScript
UI Components: Shadcn UI, Tailwind CSS
Authentication: Clerk
Database: Convex
Video/Audio: Stream.io SDK
Code Editor: Monaco Editor (VSCode's editor)
Code Execution: Judge0 API
Installation
```
# Clone the repository
git clone https://github.com/your-username/intervudesk.git

# Navigate to project directory
cd intervudesk

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev


```
Environment Setup
Create a .env.local file with the following variables:
```
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Stream.io for Video
NEXT_PUBLIC_STREAM_API_KEY=
STREAM_SECRET=

# Judge0 for Code Execution
NEXT_PUBLIC_RAPIDAPI_KEY=
NEXT_PUBLIC_RAPIDAPI_HOST=

# Convex Database
NEXT_PUBLIC_CONVEX_URL=
```

Usage
Sign Up/Login: Create an account or log in using email or SSO
Role Selection: Users start as candidates; admin can promote to interviewer status
Creating Interviews: Interviewers can schedule and start interview sessions
Joining Interviews: Candidates receive links to join scheduled interviews
Coding Environment: Solve problems in preferred language with real-time execution
Recordings: Access past interview recordings for review and feedback
Project Structure
```
├── convex/                  # Convex database functions and schema
├── public/                  # Static assets
└── src/
    ├── actions/             # Server actions
    ├── app/                 # Next.js app router pages
    │   ├── (admin)/         # Admin-only routes
    │   ├── (root)/          # Main application routes
    │   └── api/             # API routes
    ├── components/          # React components
    ├── constants/           # Application constants
    ├── hooks/               # Custom React hooks
    ├── lib/                 # Utility functions
    └── models/              # Data models


```

Acknowledgments
Clerk for authentication
Stream.io for video functionality
Convex for database
Shadcn UI for UI components
Judge0 for code execution
