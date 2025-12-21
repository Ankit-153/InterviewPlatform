# Interview Platform
A comprehensive technical interview platform built with Next.js, enabling real-time video calls, collaborative coding, and AI-powered code reviews.
## 🚀 Features

-   **Real-time Video & Audio Calls**: High-quality video conferencing powered by Stream.
-   **Collaborative Code Editor**: Real-time code sharing and execution environment using Monaco Editor.
-   **AI Code Review**: Instant code analysis and feedback powered by Google Gemini AI.
-   **Role-Based Access**: Distinct interfaces and capabilities for Candidates and Interviewers.
-   **Interview Scheduling**: Easy-to-use scheduling system for setting up interview sessions.
-   **Session Recording**: Automatic recording of interview sessions for later review.
-   **Feedback System**: Structured feedback and rating system for interviewers.
-   **Secure Authentication**: Robust user authentication and management via Clerk.
-   **Real-time Database**: Instant data synchronization using Convex.
-   **Code Execution**: Run code in multiple languages using Judge0.
# Project Workflow

This document outlines the detailed workflow for the Interview Platform, covering both the **Interviewer** and **Interviewee/Candidate** roles.

## 1. Onboarding & Authentication

**Both Roles:**
1.  **Sign Up / Login**: Users authenticate using Clerk (Google, GitHub, etc.).
2.  **Role Selection**:
    -   Upon first login, users are redirected to the `/select-role` page.
    -   Users must choose between **"Candidate"** or **"Interviewer"**.
    -   This role is permanently stored in the database and determines access permissions.

---

## 2. Interviewer Workflow

### A. Dashboard & Home
-   **Home Page**: Displays quick actions ("New Call", "Join Interview") and a list of upcoming interviews.
-   **Dashboard**: A dedicated admin view to manage all interviews.
    -   View interviews grouped by status: Upcoming, Completed, Succeeded, Failed.
    -   Access to past interview recordings and details.

### B. Scheduling an Interview
1.  Navigate to the **Schedule** page (via "New Call" or "Schedule New Interview").
2.  Fill in interview details:
    -   **Title & Description**: Topic of the interview.
    -   **Date & Time**: When the interview will take place.
    -   **Candidate**: Select a candidate from the registered users list.
    -   **Interviewers**: Select additional interviewers (if any).
3.  **Confirm**: Clicking "Schedule Meeting" creates the interview record and generates a unique meeting link.

### C. Conducting the Interview
1.  **Join Meeting**:
    -   When the scheduled time arrives, the "Join Meeting" button becomes active on the Home or Dashboard card.
    -   Clicking it enters the video call room.
2.  **In-Meeting Features**:
    -   **Video/Audio**: Real-time communication via Stream.
    -   **Code Editor**: A shared, real-time collaborative code editor (Monaco Editor).
    -   **Question Selection**: Select coding problems from a predefined list to present to the candidate.
    -   **Code Execution**: Run the candidate's code against test cases (supports multiple languages like JavaScript, Python, Java, C++).
    -   **AI Review**: Generate an AI-powered review of the code quality, potential bugs, and optimizations.
3.  **End Meeting**: The interviewer can end the call for everyone.

### D. Post-Interview Actions
1.  **Rate & Review**:
    -   After the interview is marked "Completed", go to the **Dashboard**.
    -   Click **"Rate Interview"** (or "Add Comment") on the interview card.
    -   Provide a **Rating (1-5 stars)** and written feedback.
    -   Mark the interview status as **"Pass"** or **"Fail"**.
2.  **Recordings**: Access full video recordings of the session in the **Recordings** section.

---

## 3. Interviewee / Candidate Workflow

### A. Home Page
-   **Upcoming Interviews**: View a list of scheduled interviews.
-   **Status**: See the status of interviews (Upcoming, Live, Completed).
-   **Join**: When an interview is "Live", the **"Join Meeting"** button becomes available.

### B. The Interview
1.  **Join Meeting**: Enter the video call room at the scheduled time.
2.  **Collaboration**:
    -   **Video/Audio**: Communicate with the interviewer.
    -   **Coding**: Write code in the shared editor. Changes are synced in real-time.
    -   **Execution**: Run code to check output and debug.
    -   **Questions**: View the problem statement selected by the interviewer.

### C. Post-Interview
-   **History**: View a list of past interviews.
-   **Note**: Candidates typically do not see the specific ratings or internal comments left by the interviewer.

---

## 4. Technical Flow Summary

1.  **Scheduling**: Creates a record in Convex DB (`interviews` table) and a Stream Call ID.
2.  **Meeting**:
    -   **Video**: Handled by Stream Video SDK.
    -   **Code Sync**: Handled by Convex (`codeSessions` table) for real-time updates.
    -   **Execution**: Code is sent to an execution engine (e.g., Judge0) via API.
3.  **AI Review**: Code is sent to an AI endpoint (`/api/ai/review`) which returns analysis.
4.  **Completion**: Status updates and comments are stored in Convex (`interviews` and `comments` tables)

## 🛠️ Tech Stack

### Frontend
-   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [Shadcn/ui](https://ui.shadcn.com/) (Radix UI)
-   **Icons**: [Lucide React](https://lucide.dev/)

### Backend & Services
-   **Database**: 
    - [Convex](https://www.convex.dev/) (Real-time synchronization)
    - [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/) (Data persistence)
-   **Authentication**: [Clerk](https://clerk.com/)
-   **Video/Audio**: [Stream](https://getstream.io/)
-   **AI**: [Google Gemini](https://deepmind.google/technologies/gemini/) (`@google/genai`)
-   **Code Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
-   **Code Execution**: [Judge0](https://judge0.com/) (via RapidAPI)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
-   Node.js (v18 or higher)
-   npm or yarn

You will also need accounts and API keys for:
-   [Clerk](https://clerk.com/)
-   [Convex](https://www.convex.dev/)
-   [Stream](https://getstream.io/)
-   [Google AI Studio](https://aistudio.google.com/) (Gemini API)
-   [MongoDB Atlas](https://www.mongodb.com/atlas/database) (or a local MongoDB instance)
-   [RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce) (Judge0)

## ⚡ Getting Started

### 1. Clone the Repository

```bash
git clone [https://github.com/yourusername/interview-platform.git](https://github.com/yourusername/interview-platform.git)
cd interview-platform

```

### 2. Install Dependencies

```bash
npm install
# or
yarn install

```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add the following environment variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Convex Database
CONVEX_DEPLOYMENT=dev:...
NEXT_PUBLIC_CONVEX_URL=https://...

# Stream Video/Audio
NEXT_PUBLIC_STREAM_API_KEY=...
STREAM_SECRET_KEY=...

# Google Gemini AI
GOOGLE_API_KEY=...

# MongoDB
MONGODB_URI=mongodb+srv://...

# Judge0 (RapidAPI)
NEXT_PUBLIC_RAPIDAPI_KEY=...
NEXT_PUBLIC_RAPIDAPI_HOST=judge0-ce.p.rapidapi.com

```

### 4. Setup Convex

Initialize and configure the Convex database:

```bash
npx convex dev

```

This command will start the Convex development server and sync your schema.

### 5. Run the Application

Start the Next.js development server:

```bash
npm run dev
# or
yarn dev

```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser to see the application.

## 📂 Project Structure

```
├── convex/                 # Backend API and Database Schema
│   ├── schema.ts          # Database schema definition
│   ├── users.ts           # User related queries/mutations
│   ├── interviews.ts      # Interview management logic
│   └── ...
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── (root)/        # Main application routes
│   │   ├── (admin)/       # Admin dashboard routes
│   │   └── api/           # API routes (AI review, etc.)
│   ├── components/        # React components
│   │   ├── ui/            # Reusable UI components (buttons, inputs)
│   │   ├── providers/     # Context providers (Clerk, Stream, Theme)
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   └── constants/         # App constants
├── public/                # Static assets
└── ...

```

## 🔑 Key Components

* **`MeetingRoom.tsx`**: Handles the main video interface and layout.
* **`CodeEditor.tsx`**: Manages the Monaco editor instance and code execution.
* **`AIReviewDisplay.tsx`**: Displays the AI-generated code review feedback.
* **`InterviewScheduleUI.tsx`**: Interface for scheduling new interviews.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

* [Next.js](https://nextjs.org/) for the amazing framework.
* [Convex](https://www.convex.dev/) for simplifying backend development.
* [Clerk](https://clerk.com/) for seamless authentication.
* [Stream](https://getstream.io/) for robust video calling capabilities.

```

```
