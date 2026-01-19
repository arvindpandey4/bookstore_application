# 📚 BridgeLabz Bookstore App

> A full-stack, feature-rich bookstore application built with the MERN stack, designed for performance, scalability, and a premium user experience.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Author](https://img.shields.io/badge/Author-Arvind%20Pandey-orange)

## 📖 Overview

The **BridgeLabz Bookstore App** is a comprehensive e-commerce platform that allows users to browse books, manage their cart/wishlist, and place orders seamlessly. Under the hood, it leverages modern backend architecture including **Redis caching** for high-speed data retrieval and **RabbitMQ** for asynchronous email processing.

## ✨ Key Features

### 🔐 User Authentication & Security
- **Secure Login/Signup**: JWT-based authentication with bcrypt password hashing.
- **Google OAuth**: Seamless one-click login using Google accounts.
- **Password Recovery**: Secure "Forgot Password" flow with email reset links.

### 🛍️ Shopping Experience
- **Interactive Book Catalog**: Search and browse a dynamic collection of books.
- **Shopping Cart**: Add/remove items and adjust quantities.
- **Wishlist**: Save books for later.
- **Order Management**: Streamlined checkout process and order history tracking.
- **Reviews & Ratings**: Users can leave feedback on books.

### 🚀 Performance & Architecture
- **Redis Caching**: Implements a "Cache-Aside" strategy to serve product listings instantly, reducing database load.
- **RabbitMQ Message Queue**: Offloads email sending (Welcome mails, Order Confirmations) to a background worker to ensure the API remains lightning fast.
- **Dockerized Services**: Redis and RabbitMQ are containerized for easy setup and isolation.

### 🎨 Frontend
- **Modern UI**: Built with React.js 19 and Vite.
- **Responsive Design**: Custom Bootstrap 5 + SCSS styling for a professional look across mobile and desktop.
- **State Management**: React Context API used for managing Global Auth and Cart state.

---

## 🛠️ Technology Stack

### Frontend
- **Library**: React.js (Vite)
- **Styling**: Bootstrap 5, SCSS
- **Routing**: React Router Dom v7
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Caching**: Redis
- **Message Queue**: RabbitMQ
- **Authentication**: Passport.js (Google Strategy), JWT
- **Email Service**: Nodemailer

### DevOps & Tools
- **Containerization**: Docker & Docker Compose
- **Version Control**: Git

---

## 🏗️ Architecture

```mermaid
graph TD
    Client[React Client] <-->|REST API| Server[Express Server]
    Server <-->|Read/Write| DB[(MongoDB)]
    Server <-->|Cache Hit/Miss| Cache[(Redis)]
    Server -->|Publish Event| Queue[RabbitMQ]
    
    subgraph Background Worker
    Queue -->|Consume| EmailWorker[Email Service]
    EmailWorker -->|SMTP| Email[User Inbox]
    end
```

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- Node.js (v18+)
- Docker Desktop (for Redis and RabbitMQ)
- MongoDB Connection URI (Local or Atlas)
- Google Cloud Console Credentials (Client ID & Secret)

### 1. Clone the Repository
```bash
git clone https://github.com/arvindpandey4/bookstore_application.git
cd bookstore_application
```

### 2. Infrastructure Setup
Start the required services using Docker:
```bash
docker-compose up -d
```
*This handles Redis and RabbitMQ automatically.*

### 3. Backend Setup
```bash
cd backend
npm install
```

**Configure Environment Variables:**
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

# Redis & RabbitMQ
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://guest:guest@localhost:5672

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

# Email (SMTP)
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_specific_password

# Client URL
FRONTEND_URL=http://localhost:5173
```

Start the Server:
```bash
npm run dev
```

### 4. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

### 5. Access the App
Open your browser and navigate to: `http://localhost:5173`

---

## 📂 Project Structure

```
BridgeLabz_Bookstore_App/
├── backend/
│   ├── config/         # DB, Redis, RabbitMQ, Passport configs
│   ├── controllers/    # Request handlers
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Helper functions
│   ├── workers/        # Background workers (Email)
│   └── server.js       # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── assets/     # Images & Styles
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # Global State (Auth, Cart)
│   │   ├── pages/      # Page views
│   │   ├── services/   # API calls
│   │   └── App.jsx     # Main Component
│   └── vite.config.js
│
└── docker-compose.yml  # Infrastructure Config
```

---

## 👨‍💻 Author

**Arvind Pandey**

---

*Verified & Tested on Windows Environment (Powershell).*
