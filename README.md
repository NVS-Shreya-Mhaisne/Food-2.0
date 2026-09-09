# Food 2.0 - Full Stack Food Delivery Application

A modern, full-stack food delivery web application built with React, Node.js, Express, and MongoDB, featuring a customer-facing frontend, an administrative panel, and a robust REST API backend.

---

## Project Structure

```
Food-2.0/
├── Admin/        # Admin dashboard (React + Vite)
├── Backend/      # REST API server (Node.js + Express + MongoDB)
└── Frontend/     # Customer-facing storefront (React + Vite)
```

---

## Tech Stack

- **Frontend & Admin**: React.js, Vite, Axios, React Router, CSS3 / Modern UI
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Stripe, Multer, Google Gemini API
- **Deployment**: Vercel / Render

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/NVS-Shreya-Mhaisne/Food-2.0.git
cd Food-2.0
```

### 2. Backend Setup
```bash
cd Backend
npm install
# Create a .env file from .env.example and fill in your credentials
npm run dev # or npm start
```

### 3. Frontend Setup
```bash
cd ../Frontend
npm install
npm run dev
```

### 4. Admin Panel Setup
```bash
cd ../Admin
npm install
npm run dev
```

---

## Environment Variables

### Backend (`Backend/.env`)
- `PORT` - Port number (e.g. 5000)
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for token authentication
- `STRIPE_SECRET_KEY` - Stripe secret key for payment processing
- `GEMINI_API_KEY` - Google Gemini AI API key
- `FRONTEND_URL` - Frontend origin URL
- `ADMIN_URL` - Admin panel origin URL

---