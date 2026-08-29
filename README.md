# 🚀 HireFlow AI

### AI-Powered Smart Recruitment & Hiring Management Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://hireflow-ai-xj9l.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend_API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://hireflow-ai-1-s8sy.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Akashjigjeni/hireflow-ai)

---

## 📌 Project Links & Live URLs

- 🌐 **Live Web Application (Vercel)**: [https://hireflow-ai-xj9l.vercel.app](https://hireflow-ai-xj9l.vercel.app)
- ⚙️ **Live Backend API (Render)**: [https://hireflow-ai-1-s8sy.onrender.com](https://hireflow-ai-1-s8sy.onrender.com)
- 🔗 **GitHub Repository**: [https://github.com/Akashjigjeni/hireflow-ai](https://github.com/Akashjigjeni/hireflow-ai)

---

## 📖 Overview

**HireFlow AI** is a modern, full-stack recruitment platform designed to connect job seekers and employers with an intelligent, AI-assisted hiring workflow.

- **For Job Seekers**: Discover opportunities, apply with PDF resumes and cover letters, get AI skill recommendations, and track application outcomes with real-time status updates and email notifications.
- **For Employers**: Post and manage jobs, review candidate resumes online, utilize AI to automatically match applicant skills against job requirements, generate tailored interview questions, and manage applications with instant acceptance/rejection emails.

---

## ✨ Key Features

### 👤 Candidate Experience
- 🔐 Secure JWT authentication & profile management
- 📄 PDF resume upload, permanent database storage & live browser viewing
- 💼 Job search with real-time keyword and location filtering
- ↕️ Sorting by newest/oldest job postings
- ❤️ Save and manage favorite jobs
- 📋 Interactive application tracking (Pending, Accepted, Rejected)
- 📧 Instant email updates on hiring decisions

### 🏢 Employer Experience
- 🏢 Dedicated recruiter dashboard with analytics and recruitment stats
- ➕ Create, edit, and delete job postings
- 👥 Comprehensive applicant review cards
- 📄 View candidate resumes directly in the browser
- 📊 Interactive hiring status charts with Chart.js
- 📧 Automated email dispatch via Nodemailer for acceptances & rejections

### 🤖 AI-Powered Capabilities
- 🤖 **Smart AI Resume Analysis**: Extracts skills from resumes and matches against job requirements with synonym detection (e.g. React, JS, HTML5, CSS3, Node.js, MongoDB).
- 📊 **Match Score & Gap Breakdown**: Instant percentage score with clear matched vs. missing skills insights.
- 🎯 **AI Interview Question Generator**: Generates customized technical interview questions tailored to the candidate's skill set.
- ✨ **AI Cover Letter Generator & PDF Export**: Creates professional candidate cover letters with one-click PDF download.
- ⭐ **AI Job Recommendations**: Suggests matching jobs based on candidate skills.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router DOM, Axios, Chart.js, React-ChartJS-2, jsPDF |
| **Backend** | Node.js, Express.js, Multer, PDF-Parse, PDFKit, Nodemailer |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens), Bcrypt.js |
| **Hosting & CI/CD** | Vercel (Frontend), Render (Backend), GitHub |

---

## 🏗️ Project Architecture

```text
hireflow-ai/
├── frontend/                     # React + Vite Client
│   ├── src/
│   │   ├── api/axios.js          # Configured Axios with JWT interceptors
│   │   ├── components/           # Navbar, Charts, UI components
│   │   ├── pages/                # Home, Jobs, Apply, EmployerDashboard, ViewApplicants, etc.
│   │   └── App.jsx               # Routes and app entry
│   └── package.json
│
├── backend/                      # Express + Node.js Server
│   ├── src/
│   │   ├── ai/                   # AI Resume Analyzer, Interview & Cover Letter generators
│   │   ├── controllers/          # Job, Application, User, Auth, Dashboard controllers
│   │   ├── models/               # MongoDB Schemas (User, Job, Application)
│   │   ├── middleware/           # Auth guard & Multer file upload
│   │   ├── utils/                # PDF Generation & Email utilities
│   │   └── index.js              # Express app & static route configuration
│   ├── server.js                 # Server entrypoint
│   └── package.json
│
└── README.md
```

---

## 🚀 Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Akashjigjeni/hireflow-ai.git
cd hireflow-ai
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```
Run the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
Run the frontend development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 👨‍💻 Author & Submission Info

- **Developer**: Akash Jigjeni
- **GitHub**: [@Akashjigjeni](https://github.com/Akashjigjeni)
- **Project**: HireFlow AI — Full-Stack AI Recruitment Platform
