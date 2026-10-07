# CSE-College-Portal
# 🎓 SSIEMS CSE Academic Portal

A comprehensive academic management system designed for the Department of Computer Science & Engineering at SSIEMS. This platform streamlines academic workflows, student tracking, and institutional data management.

## 🚀 Live Demo
- **Frontend**: [gradeflow-system-h4ne.vercel.app](https://gradeflow-system-h4ne.vercel.app)
- **Backend API**: [cse-college-portal-api.onrender.com](https://cse-college-portal-api.onrender.com)

## ✨ Key Features
- **Modern UI/UX**: Fully responsive dashboard for Students, Teachers, and Admins.
- **Academic Tracking**: Manage results, placements, and toppers' data.
- **Photo Gallery**: Visual documentation of campus life and infrastructure.
- **Faculty Directory**: Detailed profiles and accomplishments of department staff.
- **Secure Authentication**: Role-based access control with JWT integration.
- **Data Analytics**: Real-time visualization of academic performance and placement trends.

## 🛠️ Tech Stack
- **Frontend**: React.js, Tailwind CSS, Lucide Icons, Axios.
- **Backend**: FastAPI (Python), MongoDB Motor (Async Driver).
- **Database**: MongoDB Atlas (Cloud Cluster).
- **Deployment**: Vercel (Frontend) & Render (Backend).
- **DevOps**: Docker, Docker Compose for containerized development.

## 📦 Project Structure
```text
gradeflow_system/
├── frontend/          # React application
│   ├── src/           # UI Components & Logic
│   └── public/        # Static assets (Images, Icons)
├── backend/           # FastAPI server
│   ├── server.py      # Main API logic
│   └── requirements.txt
├── vercel.json        # Vercel proxy configuration
└── docker-compose.yml # Container orchestration
```

## ⚙️ Local Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/SyedAsif7/CSE-College-Portal.git
   cd CSE-College-Portal
   ```

2. **Backend Configuration**
   - Create `backend/.env`
   - Add `MONGO_URL`, `DB_NAME`, and `JWT_SECRET`.

3. **Frontend Configuration**
   - Create `frontend/.env`
   - Add `REACT_APP_BACKEND_URL=http://localhost:8000`.

4. **Run with Docker**
   ```bash
   docker-compose up -d --build
   ```

## 👨‍💻 Developer

**Syed Asif**
*Developer & Technical Architect*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/the-syed-asif)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/SyedAsif7)

---
© 2025 GradeFlow System. All rights reserved.
