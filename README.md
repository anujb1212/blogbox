# BlogBox 📝

A minimal full-stack blog platform where users can read, write, edit, and delete blogs.  
Built with a clean, scalable architecture using modern technologies.

---

## ✨ Features

- 📰 View all published blogs (public)
- 🔐 Login/signup with email and password
- ✍️ Authenticated users can:
  - Create blogs
  - Edit their own blogs
  - Delete their own blogs
  - View their own blogs
- 🧾 Responsive frontend with skeleton loaders
- 🚫 Protected routes using JWT
- ✅ Middleware-authenticated APIs

---

## 🧱 Tech Stack

### Frontend:
- React + TypeScript
- Tailwind CSS
- React Router DOM
- Axios
- Tiptap editor

### Backend:
- Hono.js (Edge-compatible framework)
- Prisma (Edge Client)
- Neon PostgreSQL
- JWT (Hono/jwt)
- bcryptjs

### Common:
- Zod + blogbox-common for input validation
- Shared types between frontend and backend

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/blogbox.git
cd blogbox
```

### 2. Install Dependencies
Backend
```bash
cd backend
npm install
```

Frontend
```bash
cd frontend
npm install
```

Common (shared types and validators)
```bash
cd common
npm install
```

### 3. Set environment variables
Create a .env file:
```ini
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Run the app locally
Backend
```bash
cd backend
npx wrangler dev
```
Frontend
```bash
cd frontend
npm run dev
```
