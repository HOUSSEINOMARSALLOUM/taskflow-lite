# TaskFlow Lite - Complete Setup Guide

## Overview

TaskFlow Lite is a full-stack task management application with role-based access control, team collaboration, and analytics features. It consists of a Node.js/Express backend with PostgreSQL database and a React frontend with Vite.

## Prerequisites

- Node.js 16+
- PostgreSQL 12+ (must be running locally or accessible)
- npm or yarn

## Database Setup

### Step 1: Verify PostgreSQL is Running

Make sure PostgreSQL is installed and running on your system:

- **Windows**: Check Services for "postgresql-x64" or use PostgreSQL installer
- **Mac**: Use Homebrew: `brew services start postgresql`
- **Linux**: `sudo service postgresql start`

### Step 2: Create the Database

Connect to PostgreSQL and create the database:

```bash
# Connect to PostgreSQL (default user is 'postgres')
psql -U postgres

# In psql, create the database:
CREATE DATABASE taskflow_lite;

# Exit psql:
\q
```

### Step 3: Configure Environment Variables

**Server (.env file already created)**
Located at: `server/.env`

```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/taskflow_lite"
JWT_SECRET="your-secret-key-change-in-production-abc123xyz"
JWT_REFRESH_SECRET="your-refresh-secret-key-change-in-production-xyz789abc"
PORT=5000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:5173"
BCRYPT_ROUNDS=10
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

**Client (.env file already created)**
Located at: `client/.env`

```
VITE_API_URL=http://localhost:5000/api
```

## Backend Setup

### Step 1: Install Dependencies

```bash
cd server
npm install
```

### Step 2: Initialize Database

Run Prisma migrations to create the database schema:

```bash
cd server

# Generate Prisma Client (if not already done)
npm run prisma:generate

# Run migrations to create tables
npm run migrate
```

### Step 3: Start the Server

```bash
cd server
npm run dev
```

The API will be available at `http://localhost:5000`

### Health Check

Visit `http://localhost:5000/api/health` - should return:

```json
{
  "status": "OK",
  "message": "TaskFlow Lite API is running"
}
```

## Frontend Setup

### Step 1: Install Dependencies

```bash
cd client
npm install
```

### Step 2: Start Development Server

```bash
cd client
npm run dev
```

The app will be available at `http://localhost:5173`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Teams

- `GET /api/teams` - Get all teams for user
- `POST /api/teams` - Create new team
- `GET /api/teams/:teamId` - Get team details
- `POST /api/teams/:teamId/members` - Add team member

### Tasks

- `GET /api/teams/:teamId/tasks` - Get team tasks (supports filtering, pagination)
- `POST /api/teams/:teamId/tasks` - Create task
- `GET /api/teams/:teamId/tasks/:taskId` - Get task details
- `PUT /api/teams/:teamId/tasks/:taskId` - Update task
- `DELETE /api/teams/:teamId/tasks/:taskId` - Delete task

### Activities

- `GET /api/teams/:teamId/activities/team` - Get team activity log
- `GET /api/teams/:teamId/activities/task/:taskId` - Get task activity log

### Analytics

- `GET /api/teams/:teamId/analytics/overview` - Get team overview stats
- `GET /api/teams/:teamId/analytics/tasks-per-user` - Get tasks per user
- `GET /api/teams/:teamId/analytics/overdue` - Get overdue tasks

## Database Schema

### Users

- **id** (CUID) - Primary key
- **email** - Unique email address
- **name** - User's name
- **password** - Hashed password
- **role** - ADMIN or MEMBER
- **createdAt** - Creation timestamp
- **updatedAt** - Last update timestamp

### Teams

- **id** (CUID) - Primary key
- **name** - Team name
- **slug** - URL-friendly slug (unique)
- **description** - Team description
- **createdAt** - Creation timestamp
- **updatedAt** - Last update timestamp

### TeamMembers

- **id** (CUID) - Primary key
- **teamId** - Foreign key to Team
- **userId** - Foreign key to User
- **role** - LEADER or MEMBER
- **joinedAt** - Join timestamp
- **Unique constraint** on (teamId, userId)

### Tasks

- **id** (CUID) - Primary key
- **title** - Task title
- **description** - Task description
- **status** - TODO, IN_PROGRESS, or DONE
- **priority** - LOW, MEDIUM, HIGH, or URGENT
- **dueDate** - Due date (optional)
- **teamId** - Foreign key to Team
- **createdById** - Foreign key to User (creator)
- **assignedToId** - Foreign key to User (assignee, optional)
- **createdAt** - Creation timestamp
- **updatedAt** - Last update timestamp
- **completedAt** - Completion timestamp

### ActivityLogs

- **id** (CUID) - Primary key
- **action** - Action type (e.g., "task_created", "status_changed")
- **details** - JSON data with additional info
- **userId** - Foreign key to User
- **taskId** - Foreign key to Task (optional)
- **teamId** - Foreign key to Team (optional)
- **createdAt** - Creation timestamp

## Features

### Authentication

- User registration and login
- JWT-based authentication with access and refresh tokens
- Password hashing with bcrypt
- Automatic token refresh on 401 responses

### Team Management

- Create teams
- Add members to teams
- Role-based access (LEADER, MEMBER)
- Track team activities

### Task Management

- Create tasks with title, description, priority, and due date
- Assign tasks to team members
- Update task status (TODO → IN_PROGRESS → DONE)
- Delete tasks (creator or team leader only)
- Filter tasks by status, priority, and assignee
- Pagination support
- Activity logging on task changes

### Analytics & Reporting

- Team overview: total, completed, in-progress, and todo tasks
- Completion rate calculation
- Tasks per user breakdown
- Overdue task tracking

### Activity Logging

- Track all task-related activities
- Team-wide activity feed
- Task-specific activity history

## Testing

### Backend Tests

```bash
cd server
npm test                    # Run all tests
npm run test:watch        # Watch mode
npm run test:integration  # Integration tests only
```

### Frontend Tests

```bash
cd client
npm test                   # Run all tests
npm run test:ui           # UI mode
npm run coverage          # Coverage report
```

## Building for Production

### Backend

```bash
cd server
npm run build              # Compile TypeScript
npm run start              # Run compiled JavaScript
```

### Frontend

```bash
cd client
npm run build              # Build for production
# Output will be in dist/ directory
```

## Troubleshooting

### Database Connection Failed

- Verify PostgreSQL is running: `psql -U postgres`
- Check DATABASE_URL in `.env` file
- Ensure database `taskflow_lite` exists
- Verify username and password are correct

### Port Already in Use

- Server (5000): `lsof -i :5000` (Mac/Linux) or `netstat -ano | findstr :5000` (Windows)
- Client (5173): Vite will automatically use next available port

### Prisma Errors

- Clear cache: `rm -rf node_modules/.prisma` (or `rmdir node_modules\.prisma` on Windows)
- Regenerate client: `npm run prisma:generate`
- Re-run migrations: `npm run migrate`

### CORS Errors

- Check CORS_ORIGIN in server `.env` matches client URL
- Default: `http://localhost:5173`

## Environment Variables

### Server (.env)

| Variable              | Default               | Description                                |
| --------------------- | --------------------- | ------------------------------------------ |
| DATABASE_URL          | -                     | PostgreSQL connection string               |
| JWT_SECRET            | secret                | JWT signing secret (change in production!) |
| JWT_EXPIRE_IN         | 24h                   | Access token expiration time               |
| JWT_REFRESH_SECRET    | refresh-secret        | Refresh token secret                       |
| JWT_REFRESH_EXPIRE_IN | 7d                    | Refresh token expiration time              |
| PORT                  | 5000                  | Server port                                |
| NODE_ENV              | development           | Environment (development/production)       |
| CORS_ORIGIN           | http://localhost:5173 | CORS allowed origin                        |
| BCRYPT_ROUNDS         | 10                    | Bcrypt hashing rounds                      |

### Client (.env)

| Variable     | Default                   | Description     |
| ------------ | ------------------------- | --------------- |
| VITE_API_URL | http://localhost:5000/api | Backend API URL |

## Project Structure

```
taskflow-lite/
├── server/
│   ├── src/
│   │   ├── controllers/    # API request handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── utils/          # Utilities (JWT, password, errors, types)
│   │   └── index.ts        # Server entry point
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   ├── tests/              # Test files
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                # Environment variables
│
└── client/
    ├── src/
    │   ├── components/     # React components
    │   ├── pages/          # Page components
    │   ├── services/       # API client and auth context
    │   ├── hooks/          # Custom React hooks
    │   ├── utils/          # Utility functions
    │   ├── styles/         # CSS/Tailwind styles
    │   ├── App.tsx         # Main app component
    │   └── main.tsx        # Entry point
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── .env                # Environment variables
```

## Next Steps

1. **Configure PostgreSQL** - Ensure database is created and connection string is correct
2. **Run Migrations** - Execute `npm run migrate` in the server directory
3. **Start Server** - Run `npm run dev` in the server directory
4. **Start Client** - Run `npm run dev` in the client directory
5. **Test the App** - Open `http://localhost:5173` and create an account
6. **Explore Features** - Create teams, add members, and create tasks

## Support & Documentation

- **Prisma Docs**: https://www.prisma.io/docs/
- **Express Docs**: https://expressjs.com/
- **React Docs**: https://react.dev/
- **Vite Docs**: https://vitejs.dev/

---

**Happy task managing!** 🚀
