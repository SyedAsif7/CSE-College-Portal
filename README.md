# GradeFlow System

A comprehensive academic examination evaluation platform that digitizes and streamlines the traditional paper-based examination process.

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [User Roles](#user-roles)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Overview

GradeFlow System is a full-stack web application designed to revolutionize how educational institutions manage student assessments. By digitizing the examination evaluation process, it reduces administrative overhead, improves data accuracy, and provides real-time insights into student performance.

The system provides role-based dashboards for administrators, teachers, and students, enabling efficient management of academic data from enrollment to result generation.

## Key Features

### For Administrators
- 🔧 Manage students, teachers, and subjects
- 📅 Create and schedule examinations
- 📊 Monitor evaluation progress with real-time statistics
- 📈 Generate institutional reports
- 👥 User account management

### For Teachers
- 📄 Upload and evaluate answer sheets with PDF annotation
- ✏️ Use visual tools for detailed marking (correct, incorrect, partial marks)
- 📤 Export marksheets to Excel format
- 📈 Track class performance analytics
- 🔄 Re-upload answer sheets when needed

### For Students
- 📋 View personal academic information
- 📅 Access examination schedules
- 📊 View results when published
- 👤 Manage personal profile

## Technology Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Motor](https://motor.readthedocs.io/en/stable/) driver
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: GridFS for PDF storage
- **Excel Processing**: [openpyxl](https://openpyxl.readthedocs.io/)

### Frontend
- **Framework**: [React](https://reactjs.org/) with [React Router](https://reactrouter.com/)
- **UI Library**: [TailwindCSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) components
- **State Management**: React Hooks
- **HTTP Client**: [Axios](https://axios-http.com/)
- **PDF Rendering**: [react-pdf](https://projects.wojtekmaj.pl/react-pdf/)

### Infrastructure
- **Containerization**: [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- **Deployment**: [Vercel](https://vercel.com/)-ready configuration
- **Environment Management**: [dotenv](https://github.com/motdotla/dotenv)

## System Architecture

```
┌─────────────────┐    REST API    ┌──────────────────┐
│   Frontend      │◄──────────────►│    Backend       │
│   (React)       │               │   (FastAPI)      │
└─────────────────┘               └──────────────────┘
                                            │
                                    ┌───────▼────────┐
                                    │  MongoDB       │
                                    │  (with GridFS) │
                                    └────────────────┘
```

## User Roles

### Administrator
Full system access including user management, exam creation, and report generation.
- **Default Login**: `hod@ssiems.org.in` / `hod123`

### Teacher
Access to evaluate assigned answer sheets, upload documents, and export grades.
- **Example Login**: `caa@ssiems.org.in` / `caa123` (Teacher initials + 123)

### Student
Read-only access to personal information, exam schedules, and results.
- **Example Login**: `cs225201@ssiems.org.in` / `CS225201` (Roll number format)

## Prerequisites

Ensure you have the following installed:
- Python 3.11+
- Node.js 14+
- Yarn package manager
- MongoDB Atlas account or local MongoDB instance
- Git (for version control)

## Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

### Environment Configuration

#### Backend (.env)
Create a `.env` file in the `backend` directory:
```env
MONGO_URL=mongodb+srv://username:password@cluster.example.mongodb.net/
DB_NAME=gradeflow
JWT_SECRET=your-super-secret-jwt-key-change-this
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

#### Frontend (.env)
Create a `.env` file in the `frontend` directory:
```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

## Usage

### Starting the Backend Server

From the `backend` directory:
```bash
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

### Starting the Frontend Server

From the `frontend` directory:
```bash
yarn start
```

### Automated Startup

Use the provided PowerShell script from the root directory:
```powershell
.\start-system.ps1
```

After starting both servers:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## API Documentation

The FastAPI backend provides interactive API documentation:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Authenticate user

#### Students
- `POST /api/students` - Create student
- `GET /api/students` - List students
- `GET /api/students/{id}` - Get student details

#### Teachers
- `POST /api/teachers` - Create teacher
- `GET /api/teachers` - List teachers
- `GET /api/teachers/{id}` - Get teacher details

#### Exams
- `POST /api/exams` - Create exam
- `GET /api/exams` - List exams
- `GET /api/exams/{id}` - Get exam details

#### Answer Sheets
- `POST /api/answer-sheets/upload` - Upload answer sheet
- `GET /api/answer-sheets` - List answer sheets
- `PUT /api/answer-sheets/{id}/grade` - Grade answer sheet

## Deployment

### Docker Deployment

Use the provided `docker-compose.yml`:
```bash
docker-compose up -d
```

Services will be available at:
- Frontend: http://localhost:8080
- Backend API: http://localhost:8000
- MongoDB: mongodb://localhost:27017

### Manual Deployment

1. Deploy MongoDB (Atlas or self-hosted)
2. Deploy backend to any Python-compatible hosting service
3. Deploy frontend to any static site hosting service
4. Configure environment variables appropriately

### Vercel Deployment

The frontend is configured for Vercel deployment:
1. Install Vercel CLI: `npm install -g vercel`
2. Navigate to frontend directory
3. Deploy: `vercel`

## Project Structure

```
gradeflow_system/
├── backend/                   # FastAPI Server & Database Logic
├── frontend/                  # React GradeFlow Application & Landing Page
│   ├── public/                # Public assets (includes static Timetable)
│   │   └── timetable/         # SSIEMS Academic Timetable System (Static)
│   ├── src/                   # React source code (GradeFlow & Faculty)
│   └── package.json           # Frontend dependencies
├── .gitignore                 # Global version control exclusions
├── docker-compose.yml         # Docker orchestration
├── README.md                  # Unified project guide
├── start-system.ps1           # Automated startup script
└── vercel.json                # Vercel deployment configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
