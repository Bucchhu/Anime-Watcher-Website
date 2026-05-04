# Anime Watcher Website
# 🎬 Anime-Watcher-Website

A modern full-stack web application to **track, organize, and discover anime & TV series** — built with a focus on clean architecture, secure authentication, and scalable design.

---

## 🚀 Overview

Anime-Watcher-Website helps users manage their entertainment journey by providing tools to:

* 📌 Create and manage a personal watchlist
* 📊 Track progress (Watching / Completed / Plan to Watch)
* 🔍 Discover new anime and series
* 🔐 Maintain secure user sessions

> ⚠️ Note: This platform does **not host or stream copyrighted content**. It is designed for tracking and discovery purposes only.

---

## 🧠 Key Features

* 🔐 Secure Authentication (JWT + httpOnly Cookies)
* 📺 Watchlist Management
* 📊 Status Tracking System
* 🔎 Search & Filter Functionality
* 🔄 Persistent Login Sessions
* 💻 Responsive UI

---

## 🏗️ Tech Stack

### Frontend

* React.js
* CSS / Tailwind (if applicable)
* Fetch / Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB (Mongoose)

### Authentication

* JSON Web Tokens (JWT)
* httpOnly Cookies

---

## 📁 Project Structure

```id="1kz8fh"
Anime-Watcher-Website/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── App.js
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```id="p0wqmx"
git clone https://github.com/your-username/anime-watcher-website.git
cd anime-watcher-website
```

---

### 2️⃣ Backend Setup

```id="s7xv2q"
cd backend
npm install
npm start
```

---

### 3️⃣ Frontend Setup

```id="9dkl2n"
cd frontend
npm install
npm start
```

---

## 🔐 Authentication Flow

* User logs in → server generates JWT
* JWT stored in **httpOnly cookie**
* Cookie sent automatically with requests
* Middleware verifies user access
* No token stored in localStorage (improved security)

---

## 🌐 API Endpoints (Sample)

| Method | Endpoint   | Description     |
| ------ | ---------- | --------------- |
| POST   | /login     | User login      |
| POST   | /register  | User signup     |
| GET    | /dashboard | Protected route |
| POST   | /logout    | Logout user     |

---

## ⚖️ Legal & Usage Disclaimer

This project is developed for **educational and demonstration purposes**.

* ❌ Does not host or distribute copyrighted media
* ❌ Does not provide unauthorized streaming
* ✅ Focuses on tracking, discovery, and user experience

Users are encouraged to access content through **official and licensed platforms**.

---

## 📈 Future Enhancements

* ⭐ Ratings & Reviews System
* 🤝 Community Discussions
* 🔔 Episode Notifications
* 🌍 Integration with external anime APIs
* 📱 Enhanced mobile responsiveness

---

## 🧪 Learning Outcomes

* Full-stack architecture design
* Secure authentication implementation
* REST API development
* State management & UI optimization

---

## 👨‍💻 Author

Ritu Raj Singh
B.Tech IT Graduate | Full Stack Developer

---

## 📄 License

This project is licensed under the MIT License.

