# Bookstore Application

MERN Stack Bookstore application with robust backend and responsive frontend.

## Folder Structure

- **backend/**: Express/Node.js API
- **frontend/**: React/Vite UI

## Prerequisites

- Node.js (v14+)
- MongoDB (Running locally or Atlas URI)

## Setup & Run

### 1. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Update .env with your MongoDB URI and Secret Keys

# Seed Data (Optional, populates books)
npm run data:import

# Start Server
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install

# Start Dev Server
npm run dev
```

## Features Implemented

- **Authentication**: Login, Signup, Google OAuth (Backend support).
- **Books**: Browse, Search, Sort, Detail View.
- **Cart**: Add/Remove Items, Quantity update.
- **Wishlist**: Add/Remove Favorites.
- **Profile**: Manage Personal & Address Details.
- **Orders**: View Order History, Track Status.
- **Checkout**: Mock Payment integration.

## API Endpoints (Quick Reference)

- `POST /auth/register`, `POST /auth/login`
- `GET /books`, `GET /books/:id`
- `GET /cart`, `POST /cart/add`
- `GET /wishlist`, `POST /wishlist/add`
- `POST /orders`, `GET /orders`
- `POST /addresses`, `GET /addresses`

## Tech Stack

- **Frontend**: React, Vite, Bootstrap, SCSS
- **Backend**: Express, Mongoose, JWT, Passport.js
