# 🎓 Faculty Performance Analysis System

A full-stack web application to manage and analyze faculty performance data.

**Tech Stack**: React (Vite) + Django REST Framework + SQLite + Chart.js

---

## 📁 Project Structure

```
project/
├── backend/           ← Django REST API
│   ├── manage.py
│   ├── requirements.txt
│   ├── backend/       ← Django config package
│   └── faculty/       ← Main app (models, views, serializers)
└── frontend/          ← React Vite app
    ├── package.json
    └── src/
        ├── pages/     ← Login, Dashboard, FacultyManagement, Reports
        ├── components/← Navbar, Table, Form, Charts
        ├── api/       ← Axios config
        └── context/   ← Auth context
```

---

## ⚙️ Backend Setup (Django)

### 1. Create & activate a virtual environment
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Apply database migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Create admin superuser
```bash
python manage.py createsuperuser
# Username: admin
# Password: admin123 (or your choice)
```

### 5. Seed sample data (optional)
```bash
python manage.py seed_faculty
```

### 6. Run the backend server
```bash
python manage.py runserver
```
Backend runs at: **http://localhost:8000**

---

##  Frontend Setup (React + Vite)

### 1. Install Node.js dependencies
```bash
cd frontend
npm install
```

### 2. Run the development server
```bash
npm run dev
```
Frontend runs at: **http://localhost:5173**

---

##  Default Login Credentials

| Field    | Value    |
|----------|----------|
| Username | admin    |
| Password | admin123 |

> Change these after first login via Django admin at **http://localhost:8000/admin**

---

## 📡 API Endpoints

| Method | Endpoint                              | Description                  |
|--------|---------------------------------------|------------------------------|
| POST   | `/api/auth/login/`                    | Login (returns JWT token)    |
| POST   | `/api/auth/logout/`                   | Logout                       |
| GET    | `/api/faculty/`                       | List all faculty              |
| POST   | `/api/faculty/`                       | Add new faculty               |
| GET    | `/api/faculty/{id}/`                  | Get faculty by ID             |
| PUT    | `/api/faculty/{id}/`                  | Update faculty                |
| DELETE | `/api/faculty/{id}/`                  | Delete faculty                |
| GET    | `/api/faculty/stats/`                 | Dashboard statistics          |
| GET    | `/api/faculty/department_analysis/`   | Department-wise analysis      |

---

##  Features

- ✅ JWT-based admin login/logout
- ✅ Add / Edit / Delete faculty records
- ✅ Real-time search by name or department
- ✅ Dashboard with summary cards
- ✅ Bar chart — average scores by department
- ✅ Radar/Doughnut chart — performance distribution
- ✅ Reports page with department analytics table
- ✅ Protected routes (redirects to login if unauthenticated)
- ✅ CORS configured for local development

---

## 🛠 Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Frontend  | React 18, Vite, React Router  |
| Charts    | Chart.js, react-chartjs-2     |
| HTTP      | Axios                         |
| Backend   | Django 4.2, DRF 3.14          |
| Auth      | SimpleJWT                     |
| Database  | SQLite (built-in)             |
| CORS      | django-cors-headers           |
