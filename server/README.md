# Backend Server Setup

## Prerequisites
1. PostgreSQL installed and running
2. Firebase Admin SDK service account key
3. Node.js 16+

## Setup Steps

### 1. Database Setup
```bash
# Create database
createdb teams_platform

# Run schema
psql -d teams_platform -f schema.sql
```

### 2. Environment Configuration
```bash
# Copy example env
cp .env.example .env

# Edit .env with your values
```

### 3. Firebase Admin SDK
1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate new private key
3. Save as `server/config/serviceAccountKey.json`

### 4. Install Dependencies
```bash
npm install
```

### 5. Run Server
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Auth
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Profile
- POST `/api/profile/complete` - Complete user profile
- GET `/api/profile/:userId` - Get profile

### Teams
- GET `/api/teams` - List teams
- POST `/api/teams` - Create team
- POST `/api/teams/:id/join` - Join team
- GET `/api/teams/:id` - Get team details

### Notifications
- GET `/api/notifications` - Get user notifications
- PUT `/api/notifications/:id/read` - Mark as read
- POST `/api/admin/notifications` - Send admin notification

## Database Schema
See `schema.sql` for complete schema.

## FCM Integration
FCM tokens are stored in `users.firebase_token` field.
Notifications sent via Firebase Admin SDK.
