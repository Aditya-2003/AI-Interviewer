# 🤖 AI Interviewer — Full Stack Interview Simulation Platform

An AI-powered interview simulation platform that allows users to practice technical interviews with dynamic question flow, real-time response evaluation, and structured performance feedback.

---

## 🚀 Features

* 🎯 **Dynamic Interview Flow**
  Simulates real interview scenarios with multiple questions and structured progression

* 🧠 **AI-Based Answer Evaluation**
  Evaluates user responses and generates:

  * Score (0–10)
  * Strengths & weaknesses
  * Improvement suggestions

* 📊 **Performance Report Dashboard**
  Displays:

  * Overall score
  * Per-question analysis
  * Feedback summary

* 🔐 **Authentication & Session Management**
  Secure login system using JWT with protected routes

* ☁️ **Production Deployment**
  Hosted on AWS EC2 with Nginx reverse proxy and PM2 process management

---

## 🛠️ Tech Stack

**Frontend**

* React.js (Vite)
* Tailwind CSS

**Backend**

* Node.js
* Express.js

**Database**

* MongoDB (Mongoose)

**Authentication**

* JWT (JSON Web Tokens)

**AI Integration**

* API-based response evaluation (LLM-powered)

**DevOps & Deployment**

* AWS EC2
* Nginx
* PM2

---

## 🧩 System Architecture

```
Client (React)
      ↓
Backend API (Express)
      ↓
Interview Service Layer
 ├── Question Flow Controller
 ├── Answer Evaluation Engine
 ├── Feedback Generator
      ↓
Database (MongoDB)
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/your-username/ai-interviewer.git
cd ai-interviewer
```

### 2. Setup Backend

```
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
AI_API_KEY=your_api_key
```

Run server:

```
npm run dev
```

---

### 3. Setup Frontend

```
cd frontend
npm install
npm run dev
```

---

## 🌐 Deployment

* Backend deployed on **AWS EC2**
* Reverse proxy configured using **Nginx**
* Process managed with **PM2**
* HTTPS enabled via **Certbot**

---

## 📈 Future Improvements

* Voice-based interview (Speech-to-Text / Text-to-Speech)
* Advanced answer scoring using embeddings
* Real-time interview mode
* Interview analytics dashboard

---

## 📬 Contact

* GitHub: https://github.com/Aditya-2003
* LinkedIn: https://www.linkedin.com/in/aditya-shrivas-29b111256

---

## ⚠️ Disclaimer

This project uses AI-based APIs for response evaluation and does not train custom machine learning models.
