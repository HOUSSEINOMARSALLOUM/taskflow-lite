# TaskFlow Lite – A Role-Based Team Task & Progress Management System

## 🎯 Problem It Solves

Small teams, student groups, NGOs, and early-stage startups often rely on informal tools (WhatsApp, spreadsheets, emails) to assign tasks and track progress. These methods break down quickly:

- ❌ No accountability
- ❌ No clear ownership
- ❌ No centralized status view

**TaskFlow Lite** solves this with a lightweight, role-based task management platform that allows team leads to assign tasks, track progress, and review completion history—without the complexity of enterprise tools like Jira or Asana.

## ✨ Core Features

### 1. **Authentication & Authorization**

- Email/password authentication with JWT tokens
- Role-based access control (Admin / Member)
- Protected routes on frontend and backend

### 2. **Team & Task Management**

- Create and manage teams
- Assign tasks to users
- Task statuses: Todo → In Progress → Done
- Due dates and priority levels (Low, Medium, High, Urgent)

### 3. **REST API with Proper Data Modeling**

- Well-structured REST endpoints
- Relational data: Users ↔ Teams ↔ Tasks
- Pagination and filtering by status, assignee, priority
- Type-safe with TypeScript

### 4. **Activity Log / Audit Trail**

- Track task updates (status changes, reassignments, priority changes)
- Demonstrates real-world backend thinking
- Complete history visibility

### 5. **Basic Analytics Dashboard**

- Tasks completed per user
- Overdue tasks tracking
- Simple charts for visualization

### 6. **Testing**

- Backend unit tests with Jest
- API integration tests for critical flows
- Frontend component tests with React Testing Library

### 7. **Deployment & Environment Configuration**

- Production deployment with environment variables
- Live demo ready
- Database migrations with Prisma

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library with Hooks
- **Vite** - Fast development build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Simple charting library

### Backend

- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Database

- **PostgreSQL** - Relational database
- **Prisma ORM** - Database access and migrations

### Testing

- **Jest** - Unit testing framework
- **Supertest** - API testing
- **React Testing Library** - Component testing
- **Vitest** - Frontend test runner

### Deployment

- **Frontend**: Vercel
- **Backend**: Render or Railway
- **Database**: Supabase or Railway PostgreSQL

## 📁 Project Structure

```
taskflow-lite/
├── server/                    # Express backend
│   ├── src/
│   │   ├── index.ts          # Entry point
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Auth & error handling
│   │   └── utils/            # Helpers
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── tests/
│   │   ├── unit/             # Unit tests
│   │   └── integration/      # API tests
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── client/                    # React frontend
│   ├── src/
│   │   ├── main.tsx          # Entry point
│   │   ├── App.tsx           # Root component
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable components
│   │   ├── services/         # API calls
│   │   ├── hooks/            # Custom hooks
│   │   ├── utils/            # Helpers
│   │   └── __tests__/        # Component tests
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── package.json
│   └── .env.example
│
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 12+ (or use Supabase cloud)
- Git

### Backend Setup

1. **Clone and navigate to server directory**

   ```bash
   cd server
   npm install
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env
   # Edit .env with your database URL and JWT secret
   ```

3. **Set up database**

   ```bash
   npm run migrate
   ```

4. **Start development server**

   ```bash
   npm run dev
   # API runs on http://localhost:5000
   ```

5. **Run tests**
   ```bash
   npm test                  # Run all tests with coverage
   npm run test:integration  # Run API tests only
   ```

### Frontend Setup

1. **Navigate to client directory**

   ```bash
   cd client
   npm install
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env
   # Update VITE_API_URL if backend runs on different port
   ```

3. **Start development server**

   ```bash
   npm run dev
   # App runs on http://localhost:5173
   ```

4. **Run tests**
   ```bash
   npm test       # Run tests in watch mode
   npm run coverage # Generate coverage report
   ```

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register      - Create new user account
POST   /api/auth/login         - Login and get JWT token
POST   /api/auth/refresh       - Refresh access token
GET    /api/auth/me            - Get current user (protected)
POST   /api/auth/logout        - Logout (protected)
```

### Team Endpoints

```
GET    /api/teams              - List user's teams (protected)
POST   /api/teams              - Create new team (protected)
GET    /api/teams/:id          - Get team details (protected)
PUT    /api/teams/:id          - Update team (protected, leader only)
DELETE /api/teams/:id          - Delete team (protected, leader only)
POST   /api/teams/:id/members  - Add team member (protected, leader only)
```

### Task Endpoints

```
GET    /api/teams/:teamId/tasks          - List team tasks with filters
POST   /api/teams/:teamId/tasks          - Create task (protected)
GET    /api/tasks/:id                    - Get task details (protected)
PUT    /api/tasks/:id                    - Update task (protected)
PUT    /api/tasks/:id/status             - Change task status (protected)
PUT    /api/tasks/:id/assign             - Reassign task (protected)
DELETE /api/tasks/:id                    - Delete task (protected)
```

### Activity Log Endpoints

```
GET    /api/teams/:teamId/activities     - Get team activity log
GET    /api/tasks/:taskId/activities     - Get task history
```

### Analytics Endpoints

```
GET    /api/analytics/overview           - Dashboard overview stats
GET    /api/analytics/tasks-per-user     - Tasks completed per user
GET    /api/analytics/overdue            - List of overdue tasks
GET    /api/analytics/completion-rate    - Task completion statistics
```

## 🔐 Authentication Flow

1. User registers with email/password
2. Password is hashed with bcrypt
3. Login returns JWT access token + refresh token
4. Protected routes require Authorization header
5. Token refresh keeps session alive without re-login
6. Logout invalidates tokens (server-side)

## 🧪 Testing Strategy

### Backend Testing

```bash
# Unit tests for services
npm test -- services

# Integration tests for API endpoints
npm run test:integration

# Coverage report
npm test -- --coverage
```

### Frontend Testing

```bash
# Run tests in watch mode
npm test

# Generate coverage
npm run coverage

# Test UI with dashboard
npm run test:ui
```

## 📊 Database Schema

### Users

- `id`, `email` (unique), `name`, `password` (hashed), `role`, timestamps

### Teams

- `id`, `name`, `slug` (unique), `description`, timestamps

### TeamMembers

- `id`, `teamId`, `userId`, `role`, `joinedAt`
- Composite unique index: `(teamId, userId)`

### Tasks

- `id`, `title`, `description`, `status`, `priority`, `dueDate`, `completedAt`, timestamps
- Foreign keys: `teamId`, `createdById`, `assignedToId`
- Indexes on `teamId`, `assignedToId`, `status` for performance

### ActivityLogs

- `id`, `action`, `details` (JSON), timestamps
- Foreign keys: `userId`, `taskId`, `teamId`
- Used for audit trail and task history

## 🌐 Deployment

### Environment Variables

**Backend (.env)**

```
DATABASE_URL=postgresql://user:pass@host:5432/taskflow_lite
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRE_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRE_IN=7d
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
BCRYPT_ROUNDS=10
```

**Frontend (.env)**

```
VITE_API_URL=https://your-backend-api.com/api
```

### Deploy to Vercel (Frontend)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically on push

### Deploy to Render (Backend)

1. Create Render account and PostgreSQL database
2. Connect GitHub repository to Render
3. Set environment variables
4. Deploy from main branch

## 🤝 Contributing

1. Clone the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes with clear messages
4. Push to branch and create Pull Request

## 📝 Git Workflow

```bash
# Clone
git clone https://github.com/HOUSSEINOMARSALLOUM/taskflow-lite.git

# Create feature branch
git checkout -b feat/authentication

# Make changes and commit
git add .
git commit -m "feat: add JWT authentication"

# Push
git push origin feat/authentication
```

## 📋 Checklist for Production

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Error logging configured
- [ ] Tests passing with coverage >80%
- [ ] README and API docs updated
- [ ] Database backups configured

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check if port 5000 is in use
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows
```

### Database connection fails

```bash
# Verify DATABASE_URL format
# PostgreSQL: postgresql://user:password@localhost:5432/dbname
# Check if PostgreSQL is running
```

### Frontend API calls fail

```bash
# Verify VITE_API_URL matches backend URL
# Check CORS_ORIGIN in backend .env
# Check browser console for errors
```

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 💬 Support

For issues or questions:

1. Check existing GitHub issues
2. Create a detailed bug report with steps to reproduce
3. Include error messages and environment info

---

Built with ❤️ for small teams, students, and startups. Let's make task management simple again! 🚀
