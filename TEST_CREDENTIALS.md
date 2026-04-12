# SSIEMS CSE Academic Portal - Test Login Credentials

## 📋 Available Test Accounts

### Admin Account
- **Email**: admin@ssiems.org.in
- **Password**: admin123
- **Role**: Admin
- **Access**: Full system management (Students, Teachers, Subjects, Exams, Assignments, Answer Sheets)

### Teacher Accounts
- **Email**: bpg@ssiems.org.in
- **Password**: teacher123
- **Role**: Teacher
- **Name**: Bais P. G.
- **Access**: Paper checking, Assignment grading, Upload answer sheets

- **Email**: drs@ssiems.org.in
- **Password**: teacher123
- **Role**: Teacher
- **Name**: Devkar R. S.
- **Access**: Paper checking, Assignment grading

- **Email:** pkj@ssiems.org.in
- **Password**: teacher123
- **Role**: Teacher
- **Name**: Jadhav P.K.
- **Access**: Paper checking, Assignment grading

### Student Accounts
- **Email**: student1@ssiems.org.in
- **Password**: student123
- **Role**: Student
- **Name**: Test Student 1
- **Class**: SY-CSE
- **Access**: View exam results, Submit assignments

- **Email**: student2@ssiems.org.in
- **Password**: student123
- **Role**: Student
- **Name**: Test Student 2
- **Class**: TY-CSE
- **Access**: View exam results, Submit assignments

---

## 🚀 How to Test

### 1. Access the Application
- **URL**: http://localhost:3000
- **Login Page**: http://localhost:3000/login

### 2. Test as Admin
1. Go to http://localhost:3000/login
2. Login with: admin@ssiems.org.in / admin123
3. You'll see the Admin Dashboard with all management tabs
4. Test: Add students, teachers, create exams, manage assignments

### 3. Test as Teacher
1. Go to http://localhost:3000/login
2. Login with: bpg@ssiems.org.in / teacher123
3. You'll see the Teacher Dashboard with two tabs:
   - **Exam Answer Sheets**: Check and grade exam papers
   - **Assignments**: Review and grade student assignments
4. Test: Upload answer sheets, grade papers, review assignments

### 4. Test as Student
1. Go to http://localhost:3000/login
2. Login with: student1@ssiems.org.in / student123
3. You'll see the Student Dashboard with two tabs:
   - **Exam Results**: View your exam marks
   - **Assignments**: Upload and track assignments
4. Test: Upload PDF assignments, view grades

---

## 📝 Assignment Feature Testing

### Test Assignment Submission (Student)
1. Login as student (student1@ssiems.org.in / student123)
2. Click "Assignments" tab
3. Select class (e.g., SY)
4. Select subject
5. Upload a PDF file
6. Click "Submit Assignment"
7. View your submission in "My Submissions" table

### Test Assignment Grading (Teacher)
1. Login as teacher (bpg@ssiems.org.in / teacher123)
2. Click "Assignments" tab
3. Filter by class and subject
4. Click "View" to see the PDF
5. Click "Grade" to add grade and remarks
6. Submit the grade
7. Student will see the grade in their dashboard

### Test Assignment Management (Admin)
1. Login as admin (admin@ssiems.org.in / admin123)
2. Go to "Assignments" tab
3. View all submissions across all students
4. Filter by class/subject
5. Export to Excel

---

## 🔧 Troubleshooting

### If login fails:
- Check if backend is running: http://localhost:8000
- Check MongoDB connection in backend/.env
- Verify user exists in database
- **IMPORTANT**: If you see "bad auth" errors, your MongoDB connection string in `backend/.env` needs to be updated

### MongoDB Connection Issue:
The current MongoDB connection string may have incorrect credentials. To fix:
1. Open `backend/.env`
2. Update the `MONGO_URL` with your correct MongoDB Atlas credentials
3. Restart the backend server
4. Run: `python scripts/seed_test_users.py` to create test users

### If assignments don't upload:
- Ensure file is PDF format
- Check backend logs for errors
- Verify GridFS is initialized

### Common Issues:
- **CORS errors**: Make sure backend CORS_ORIGINS includes http://localhost:3000
- **Database errors**: Check MongoDB connection string in backend/.env
- **File upload errors**: Ensure MongoDB GridFS is working

---

## 📌 Quick Links
- **Landing Page**: http://localhost:3000
- **Faculty Page**: http://localhost:3000/faculty
- **Login Page**: http://localhost:3000/login
- **API Docs**: http://localhost:8000/docs
- **Backend Health**: http://localhost:8000/

---

## 🎨 Navigation Structure
```
Navbar:
├── Home (scrolls to top)
├── Portals (scrolls to modules section)
├── Faculty (opens faculty page)
└── Secure Login (opens login page)

Landing Page Modules:
├── Academic Portal (Exams + Assignments)
└── Academic Resources
```

---

**Note**: If the test accounts don't work, you may need to create them first using the seed scripts in backend/scripts/
