# SnapLink

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?logo=redis&logoColor=white)](https://redis.io)
[![Docker](https://img.shields.io/badge/Docker-Container-2496ED?logo=docker&logoColor=white)](https://www.docker.com)
[![GitHub Actions](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![Coverage](https://img.shields.io/badge/Coverage-100%25-brightgreen)](#)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A **production-oriented** URL shortening platform built with modern backend engineering practices. Create short links, manage URLs, track detailed analytics, and monitor performance through a clean dashboard.

---

## Live Demo

| Service | URL |
|----------|-----|
| Live Application | https://snaplink.anwarbuilds.com |
| API Documentation | https://snaplink.anwarbuilds.com/api-docs |

> **Production deployment:** AWS EC2 • Docker • Nginx • Let's Encrypt • GitHub Actions CI/CD

## User Flow Sequence

```mermaid
graph TD
    Register[Register Account] --> Login[Login Session]
    Login --> Create[Create Short URL]
    Create --> Copy[Copy Short URL]
    Copy --> Open[Open Short URL]
    Open --> Analytics[Analytics Dashboard Updated]
```

## Screenshots

### Landing Page

![Landing](docs/screenshots/landing.png)

### Dashboard

![Dashboard](docs/screenshots/dashboard.png)

### URL Management

![URLs](docs/screenshots/urls.png)

### Analytics

![Analytics](docs/screenshots/analytics.png)

### API Documentation

![Swagger](docs/screenshots/swagger.png)

---

## Highlights

- **JWT Authentication** with Access + Refresh Tokens
- **Redis-backed** URL caching for lightning-fast redirects
- **Advanced Analytics** with aggregation
- Fully **Dockerized** local development
- **CI/CD** with GitHub Actions
- **Swagger API Documentation**
- Automated Testing + Coverage Enforcement
- Clean **Layered Architecture** (Controller → Service → Repository)

---

## Tech Stack

### Backend

- Node.js + Express.js
- MongoDB
- Redis
- JWT + bcrypt
- Zod Validation
- Docker
- Vitest + Swagger

### Frontend

- React + TypeScript
- Vite
- React Query

## Production Stack

- AWS EC2 (Ubuntu)
- Docker & Docker Compose
- Nginx Reverse Proxy
- Let's Encrypt SSL
- MongoDB
- Redis
- GitHub Actions CI/CD
- GitHub Container Registry (GHCR)

---

## Features by Category

### Authentication
- [x] JWT Authentication
- [x] Refresh Tokens
- [x] RBAC (Role-Based Access Control)
- [x] Password Hashing (bcrypt)

### URL Management
- [x] Short URLs
- [x] Custom Aliases
- [x] Expiration Dates
- [x] QR Codes

### Analytics
- [x] Browser Tracking
- [x] Device Tracking
- [x] OS Tracking
- [x] Country Tracking
- [x] Referrer Tracking

### DevOps
- [x] Dockerization (Dockerfile & docker-compose)
- [x] GitHub Actions CI/CD
- [x] AWS Deployment
- [x] HTTPS via Let's Encrypt
- [x] Container Health Checks
- [x] Prometheus Metrics

---

## Architecture Overview

```mermaid
flowchart LR
Client[Client]
subgraph Backend
Routes
Controllers
Services
Repositories
end
Redis[(Redis Cache)]
Mongo[(MongoDB)]
Client --> Routes
Routes --> Controllers
Controllers --> Services
Services --> Repositories
Services --> Redis
Repositories --> Mongo
```

---

## Table of Contents

- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Features](#features)
- [Architecture](#architecture)
- [API Reference](#api-reference)
- [Database Design](#database-design)
- [Deployment](#deployment)
- [Roadmap](#roadmap)

---

## Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- MongoDB 6+ (or use the Docker setup)
- Redis 7+ (or use the Docker setup)

### Local Development (Docker)

```bash
# Clone the repository
git clone https://github.com/sayyed-anwar/url-shortener.git
cd url-shortener

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start all services
docker compose up --build
```

Frontend: http://localhost:5173
Backend API: http://localhost:5000
MongoDB: localhost:27017
Redis: localhost:6379

### Manual Setup

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable             | Description                     | Example                                   |
| -------------------- | ------------------------------- | ----------------------------------------- |
| `PORT`               | Server port                     | `5000`                                    |
| `MONGODB_URI`        | MongoDB connection string       | `mongodb://localhost:27017/url-shortener` |
| `REDIS_URL`          | Redis connection string         | `redis://localhost:6379`                  |
| `JWT_SECRET`         | JWT signing secret              | `your-super-secret-key`                   |
| `JWT_REFRESH_SECRET` | Refresh token secret            | `your-refresh-secret-key`                 |
| `JWT_EXPIRES_IN`     | JWT expiry duration             | `15m`                                     |
| `BASE_URL`           | Public base URL for short links | `http://localhost:5000`                   |
| `NODE_ENV`           | Environment                     | `development`                             |

### Frontend (`frontend/.env`)

| Variable              | Description                          | Example                        |
| --------------------- | ------------------------------------ | ------------------------------ |
| `VITE_API_URL`        | Backend API URL                      | `http://localhost:5000/api/v1` |
| `VITE_SHORT_BASE_URL` | Base URL shown in UI for short links | `http://localhost:5000`        |

---

## Features

### Core

| Feature             | Description                                           |
| ------------------- | ----------------------------------------------------- |
| URL Shortening      | Convert long URLs into compact short links via NanoID |
| URL Redirection     | Redirect users with minimal latency via Redis cache   |
| Custom Aliases      | Let users choose their own short codes                |
| URL Expiration      | Expire links after a configurable date                |
| Link Management     | Create, edit, delete, and manage URLs                 |
| Click Tracking      | Track total link visits                               |
| Analytics Dashboard | View detailed statistics                              |

### Advanced

| Feature            | Description                                         |
| ------------------ | --------------------------------------------------- |
| Authentication     | JWT-based auth with bcrypt password hashing         |
| QR Code Generation | Generate QR codes for any short link                |
| Redis Caching      | Sub-millisecond lookups for hot URLs                |
| Rate Limiting      | Per-IP rate limiting via express-rate-limit         |
| Device Analytics   | Track device type per click                         |
| Browser Analytics  | Track browser per click                             |
| Geo Analytics      | Track country and city via IP geolocation           |
| Docker Support     | Full containerized setup via Docker Compose         |
| CI/CD Pipeline     | Automated testing and deployment via GitHub Actions |

---

## Architecture

### High-Level

```mermaid
flowchart TD
  A[React Frontend] --> B[Nginx Reverse Proxy]
  B --> C[Express API Server]
  C --> D[(MongoDB)]
  C --> E[(Redis Cache)]
```

### Backend Layers

```mermaid
flowchart TD
  A[Routes] --> B[Controllers]
  B --> C[Services]
  C --> D[Repositories]
  D --> E[(MongoDB)]
```

### Authentication Flow

```mermaid
flowchart TD
    A[User Registration] --> B[User Login]
    B --> C[Generate Access Token]
    C --> D[Generate Refresh Token]
    D --> E[Access Protected Resources]

    E -->|Access Token Expired| F[Refresh Token Endpoint]
    F -->|Valid Refresh Token| G[Issue New Access Token]
    G --> E

    E --> H[User Logout]
    H --> I[Invalidate Refresh Token]
    I --> J[Session Terminated]
```

### URL Redirection Flow

```mermaid
flowchart TD
  A[User Visits Short URL] --> B[Extract Short Code]
  B --> C[Check Redis Cache]
  C -->|Hit| D[Get URL from Cache]
  D --> E[Increment Click Count]
  E --> F[Store Analytics Event]
  F --> G[Redirect User]
  C -->|Miss| H[Query MongoDB]
  H --> I[Store in Redis Cache]
  I --> J[Increment Click Count]
  J --> K[Store Analytics Event]
  K --> G
```

> **Note:** Analytics logging is handled asynchronously after the redirect response is sent. This keeps redirect latency minimal even under high traffic.

### URL Creation Flow

```mermaid
flowchart TD
  A[User Submits URL] --> B[Frontend Validation]
  B --> C[POST /api/urls]
  C --> D[Backend Validation via Zod]
  D --> E[Generate Short Code via NanoID]
  E --> F{Collision Check}
  F -->|Unique| G[Store in MongoDB]
  F -->|Collision| E
  G --> H[Return Short URL]
```

### Analytics Collection Flow

```mermaid
flowchart TD
  A[Redirect Triggered] --> B[Capture Request Metadata]
  B --> C[Browser]
  B --> D[Device]
  B --> E[Country via IP]
  B --> F[Referrer]
  C --> G[Analytics Service - Async]
  D --> G
  E --> G
  F --> G
  G --> H[(Analytics Collection)]
```

---

## Quality Metrics

| Metric             | Value          |
| ------------------ | -------------- |
| Test Suites        | 8+             |
| Total Tests        | 50+            |
| Statement Coverage | 84%            |
| Branch Coverage    | 74%            |
| Function Coverage  | 71%            |
| CI/CD              | GitHub Actions |
| Containerized      | Docker         |

---

### Observability Flow

```mermaid
flowchart TD
    A[Client]
    B[Express Server]
    C[Metrics Middleware]
    D[Prometheus]
    E[Grafana]

    A -->|HTTP Request| B
    B --> C
    C -->|Expose /metrics| D
    D -->|Visualize Metrics| E
```

---

### Deployment Flow

```mermaid
flowchart TD
    A[Developer Push] --> B[GitHub Repository]
    B --> C[GitHub Actions]
    C --> D[Run Tests]
    D --> E[Generate Coverage Report]
    E --> F[Build Docker Image]
    F --> G[Deploy Application]
```

---

## Project Structure

```text
url-shortener/
├── backend/
├── frontend/
├── docs/
├── docker/
├── .github/
├── docker-compose.yml
├── README.md
└── .gitignore
```

### Backend

```text
backend/
├── src/
│   ├── config/
│   │   ├── database.js         # MongoDB connection
│   │   ├── redis.js            # Redis client
│   │   └── env.js              # Environment variable validation
│   │
│   ├── controllers/            # Request/response handling
│   ├── services/               # Business logic
│   ├── repositories/           # Data access layer
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── url.routes.js
│   │   ├── analytics.routes.js
│   │   └── redirect.routes.js  # /r/:shortCode, kept separate for performance
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── validate.middleware.js
│   │   └── rateLimiter.middleware.js
│   │
│   ├── validators/             # Zod schemas
│   ├── models/                 # Mongoose models
│   ├── cache/
│   │   └── redisCache.js       # Cache get/set/invalidate helpers
│   │
│   ├── jobs/
│   │   ├── deleteExpiredUrls.job.js        # Cron: purge expired links
│   │   └── analyticsAggregation.job.js     # Cron: aggregate click stats
│   │
│   ├── utils/
│   │   ├── generateShortCode.js  # Short code generation
│   │   ├── extractDeviceInfo.js
│   │   ├── geoLocation.js
│   │   └── logger.js
│   │
│   ├── constants/
│   ├── app.js
│   └── server.js
│
├── tests/
│   ├── integration/
│   └── unit/
│
├── .env.example
├── .gitignore
├── package-lock.json
└── package.json
```

### Frontend

```text
frontend/
│
├── public/
│
├── src/
│   │
│   ├── api/
│   │   ├── axios.ts
│   │   └── queryClient.ts
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── logos/
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── forms/
│   │   ├── analytics/
│   │   ├── layout/
│   │   └── url/
│   │
│   ├── pages/
│   │   ├── Home/
│   │   ├── Dashboard/
│   │   ├── Analytics/
│   │   ├── Login/
│   │   ├── Register/
│   │   └── NotFound/
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useUrls.ts
│   │   └── useAnalytics.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── url.service.ts
│   │   └── analytics.service.ts
│   │
│   ├── routes/
│   │   ├── AppRoutes.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── PublicRoute.tsx
│   │
│   ├── context/
│   │   └── AuthContext.tsx
│   │
│   ├── utils/
│   │   ├── copyToClipboard.ts
│   │   ├── formatDate.ts
│   │   └── generateQrCode.ts
│   │
│   ├── constants/
│   │   ├── api.ts
│   │   └── routes.ts
│   │
│   ├── styles/
│   │   └── index.css
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── .env.example
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

---

## Database Design

### Users

```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string (unique, indexed)",
  "password": "string (bcrypt hash)",
  "createdAt": "Date",
  "updatedAt": "Date",
  "refreshTokenHash": "string (hash)"
}
```

### URLs

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users)",
  "originalUrl": "string",
  "shortCode": "string (unique index, 7 chars, NanoID)",
  "customAlias": "string | null (unique sparse index)",
  "expiresAt": "Date | null",
  "clickCount": "number (default: 0)",
  "isActive": "boolean (default: true)",
  "createdAt": "Date"
  "updatedAt": "Date",
}
```

### Analytics

```json
{
  "_id": "ObjectId",
  "urlId": "ObjectId (ref: URLs, indexed)",
  "country": "string",
  "city": "string",
  "browser": "string",
  "device": "string",
  "os": "string",
  "referrer": "string",
  "timestamp": "Date (TTL index: 90 days)"
}
```

> **Indexes:** `urlId + timestamp` compound index for analytics queries. TTL index on `timestamp` for automatic data expiry. `shortCode` unique index with partial filter for active URLs.

---

## API Reference

Interactive API documentation:
[https://snaplink.anwarbuilds.com/api-docs](https://snaplink.anwarbuilds.com/api-docs)

### Authentication

| Method | Endpoint                | Auth | Description                                       |
| ------ | ----------------------- | ---- | ------------------------------------------------- |
| POST   | `/api/v1/auth/register` | —    | Register a new user account                       |
| POST   | `/api/v1/auth/login`    | —    | Login and receive access & refresh tokens         |
| POST   | `/api/v1/auth/refresh`  | —    | Generate a new access token using a refresh token |
| POST   | `/api/v1/auth/logout`   | ✓    | Logout the authenticated user                     |
| GET    | `/api/v1/auth/profile`  | ✓    | Retrieve the current user's profile               |
| GET    | `/api/v1/auth/urls`     | ✓    | Retrieve the authenticated user's URLs            |

### URL Management

| Method | Endpoint              | Auth | Description                        |
| ------ | --------------------- | ---- | ---------------------------------- |
| POST   | `/api/v1/urls`        | ✓    | Create a new short URL             |
| GET    | `/api/v1/urls/:id`    | ✓    | Retrieve a URL by ID               |
| PATCH  | `/api/v1/urls/:id`    | ✓    | Update an existing URL             |
| DELETE | `/api/v1/urls/:id`    | ✓    | Delete a URL                       |
| GET    | `/api/v1/urls/:id/qr` | ✓    | Generate a QR code for a short URL |

### Analytics

| Method | Endpoint                      | Auth | Description                              |
| ------ | ----------------------------- | ---- | ---------------------------------------- |
| GET    | `/api/v1/analytics/dashboard` | ✓    | Retrieve aggregated dashboard statistics |
| GET    | `/api/v1/analytics/:urlId`    | ✓    | Retrieve analytics for a specific URL    |

### Redirect

| Method | Endpoint        | Auth | Description                        |
| ------ | --------------- | ---- | ---------------------------------- |
| GET    | `/r/:shortCode` | —    | Redirect + async analytics capture |

---

## Redis Caching Strategy

Cache structure — key: `url:{shortCode}`, value: original URL string.

```bash
SET url:abc123 "https://example.com" EX 86400
```

- TTL: 24 hours (refreshed on each cache hit)
- On URL delete/update: cache key is invalidated immediately
- Cache miss triggers DB lookup and re-population

**Impact:** Redirects serve from Redis in ~1–2ms vs ~15–30ms from MongoDB.

---

## Security

| Layer                  | Implementation                                        |
| ---------------------- | ----------------------------------------------------- |
| Authentication         | JWT Access & Refresh Tokens                           |
| Session Security       | Refresh Token Rotation with Hashed Token Storage      |
| Authorization          | Protected Routes via Authentication Middleware        |
| Password Storage       | bcrypt (12 Salt Rounds)                               |
| Input Validation       | Zod Schema Validation                                 |
| Rate Limiting          | express-rate-limit (100 requests / 15 min per IP)     |
| HTTP Security          | Helmet Security Headers                               |
| CORS                   | Configurable Allowlisted Origins                      |
| Request Tracking       | Correlation IDs for Request Tracing                   |
| Environment Validation | Startup Validation for Required Environment Variables |

---

## Production Deployment

```mermaid
flowchart TD

Browser --> Nginx

Nginx --> React
Nginx --> Express

Express --> Redis
Express --> MongoDB

GitHub --> GitHubActions

GitHubActions --> AWS

AWS --> DockerCompose

DockerCompose --> React
DockerCompose --> Express
```

### Docker Compose

```bash
docker compose -f docker-compose.yml up -d
```

Services: `frontend`, `backend`, `mongo`, `redis`, `nginx`

### CI/CD

GitHub Actions pipeline on push to `main`:

1. Run unit and integration tests
2. Build Docker images
3. Push to registry
4. Deploy to server via SSH

---

## Scalability Notes

| Concern                | Current Approach                          | At Scale                                 |
| ---------------------- | ----------------------------------------- | ---------------------------------------- |
| Short code collisions  | NanoID + unique index + retry             | Acceptable at current scale              |
| High redirect traffic  | Redis caching layer                       | Add read replicas; consider CDN          |
| Analytics write volume | Async post-redirect logging               | Move to queue (BullMQ/Kafka) at 10k+ rps |
| MongoDB growth         | Separate analytics collection + TTL index | Horizontal sharding on `urlId`           |

---

## Observability

✔ Prometheus

✔ Health

✔ Readiness

✔ Structured Logging

✔ Request IDs

✔ Graceful Shutdown

✔ Metrics Endpoint

---

## Roadmap

### Completed

- [x] JWT Authentication
- [x] Refresh Token Rotation
- [x] URL CRUD
- [x] Redis Cache
- [x] Analytics Dashboard
- [x] Health & Readiness Endpoints
- [x] Prometheus Metrics
- [x] Graceful Shutdown
- [x] Docker
- [x] GitHub Actions CI
- [x] Swagger Documentation
- [x] Unit & Integration Tests

### Future

- [ ] Queue-based Analytics (BullMQ)
- [ ] Distributed Rate Limiting
- [ ] OpenTelemetry Tracing
- [ ] Kubernetes Deployment
- [ ] Multi-region Cache

---

## Documentation

Detailed architecture documentation is available in:

- `docs/architecture.md`
- `docs/authentication-flow.md`
- `docs/caching-strategy.md`
- `docs/database-design.md`

## Project Statistics

| Metric | Value |
|---------|-------|
| Backend | Node.js + Express |
| Frontend | React + TypeScript |
| Database | MongoDB |
| Cache | Redis |
| Deployment | AWS EC2 |
| Reverse Proxy | Nginx |
| CI/CD | GitHub Actions |
| Containerization | Docker |
| API Documentation | Swagger |

## License

MIT

---
