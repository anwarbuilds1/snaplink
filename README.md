# URL Shortener

A production-oriented URL Shortener built using React, Node.js, Express, MongoDB, and Redis.

The system allows users to generate short URLs, redirect users to original URLs, track analytics, and manage URLs through a dashboard.

---

# Features

## Core Features

- Create Short URL
- Redirect to Original URL
- Custom Alias Support
- URL Expiration
- URL Management Dashboard
- Click Tracking
- Analytics

## Advanced Features

- User Authentication
- QR Code Generation
- Redis Caching
- Rate Limiting
- Geo Analytics
- Device Analytics
- Browser Analytics
- Docker Support
- CI/CD Pipeline

---

# High Level Architecture

Frontend (React)

↓

API Gateway (Express)

↓

Application Layer

↓

MongoDB

↓

Redis Cache

---

# System Design

## URL Creation Flow

User enters URL

↓

Frontend sends request

↓

Backend validates URL

↓

Generate unique shortcode

↓

Store in Database

↓

Return shortened URL

---

## URL Redirect Flow

User visits short URL

↓

Backend receives shortcode

↓

Check Redis Cache

↓

If found

    Redirect immediately

Else

    Query MongoDB

↓

Increment Click Count

↓

Store in Cache

↓

Redirect User

---

## Analytics Flow

User clicks short URL

↓

Capture

- IP Address
- Browser
- Device
- Country
- Referrer

↓

Store Analytics Event

↓

Update Aggregated Statistics

---

# Folder Structure

## Root

project/

├── backend/

├── frontend/

├── docs/

├── docker/

├── .github/

├── README.md

└── docker-compose.yml

---

# Backend Structure

backend/

src/

├── config/

├── controllers/

├── services/

├── repositories/

├── routes/

├── middlewares/

├── models/

├── validators/

├── utils/

├── jobs/

├── cache/

├── constants/

├── docs/

├── app.js

└── server.js

---

# Frontend Structure

frontend/

src/

├── api/

├── pages/

├── components/

├── layouts/

├── hooks/

├── store/

├── services/

├── routes/

├── utils/

├── constants/

├── styles/

├── App.jsx

└── main.jsx

---

# Database Design

## Users Collection

{
"\_id": "",
"name": "",
"email": "",
"password": "",
"createdAt": ""
}

---

## URLs Collection

{
"\_id": "",
"userId": "",
"originalUrl": "",
"shortCode": "",
"customAlias": "",
"expiresAt": "",
"clickCount": 0,
"createdAt": ""
}

---

## Analytics Collection

{
"\_id": "",
"urlId": "",
"country": "",
"city": "",
"browser": "",
"device": "",
"os": "",
"referrer": "",
"timestamp": ""
}

---

# API Design

## Authentication

POST /api/auth/register

POST /api/auth/login

GET /api/auth/profile

---

## URL APIs

POST /api/urls

GET /api/urls

GET /api/urls/:id

PUT /api/urls/:id

DELETE /api/urls/:id

---

## Analytics APIs

GET /api/analytics/:urlId

GET /api/analytics/dashboard

---

## Redirect API

GET /:shortCode

---

# Backend Layers

Controller Layer

Responsible for handling requests.

↓

Service Layer

Business Logic.

↓

Repository Layer

Database Interaction.

↓

MongoDB

Persistent Storage.

---

# Redis Usage

## Cached Data

ShortCode → Original URL

Example

{
"abc123": "https://google.com"
}

---

# Security

## Implement

- Helmet
- CORS
- Rate Limiting
- JWT Authentication
- Password Hashing
- Input Validation
- XSS Protection
- CSRF Protection

---

# Frontend Pages

## Public

- Home
- Login
- Register

## Protected

- Dashboard
- Analytics
- Profile
- Settings

---

# State Management

Recommended:

- React Query
- Context API

or

- Redux Toolkit

---

# Tech Stack

## Frontend

- React
- Vite
- TailwindCSS
- Axios
- React Query

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Redis
- JWT
- NanoID

## DevOps

- Docker
- GitHub Actions
- Nginx

---

# Scalability Considerations

## Challenges

### URL Collision

Solution:

- NanoID
- Unique Index

### High Traffic Redirects

Solution:

- Redis Cache

### Analytics Growth

Solution:

- Separate Analytics Collection

### Database Load

Solution:

- Read Replicas

---

# Deployment Architecture

Client

↓

Nginx

↓

Backend API

↓

Redis

↓

MongoDB

---

# Future Enhancements

- Team Workspaces
- URL Password Protection
- Link Scheduling
- Deep Link Support
- UTM Builder
- Bulk URL Import
- Public Analytics
- Graph Dashboard
- Event Streaming with Kafka

---

# Development Phases

Phase 1

- URL Shortening
- Redirects
- CRUD APIs

Phase 2

- Authentication
- Dashboard

Phase 3

- Analytics

Phase 4

- Redis Caching

Phase 5

- Docker Deployment

Phase 6

- CI/CD

Phase 7

- Scalability Improvements
