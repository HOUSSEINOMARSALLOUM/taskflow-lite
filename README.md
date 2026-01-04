# TaskFlow Lite 🎯

> A complete, production-ready task management application with full-stack implementation.

## 🚀 Quick Start (5 Minutes)

```bash
# Terminal 1: Backend
cd server && npm install && npm run migrate && npm run seed && npm run dev

# Terminal 2: Frontend
cd client && npm install && npm run dev

# Browser: http://localhost:5173
# Login: alice@taskflow.demo / Demo@123
```

**[See detailed setup →](SETUP_GUIDE.md)**

## 🎯 What It Solves

TaskFlow Lite is a lightweight task management platform for teams that need:

- ✅ Clear task ownership and accountability
- ✅ Centralized progress tracking
- ✅ Team collaboration without complexity
- ✅ Complete audit trail of changes
- ✅ Real-time productivity insights

Perfect for small teams, student groups, NGOs, and early-stage startups.

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

## ✨ Core Features

### User Management

- Registration with email/password
- Login with JWT authentication
- Secure sessions with token refresh
- Role-based access (ADMIN, MEMBER)

### Team Management

- Create and manage unlimited teams
- Add/remove team members with roles (LEADER, MEMBER)
- Team descriptions and metadata
- Member isolation and visibility

### Task Management

- Create tasks with title, description, priority
- Assign to team members
- Track status: TODO → IN_PROGRESS → DONE
- Set due dates and deadlines
- Full CRUD operations
- Filter, search, and sort

### Analytics & Insights

- Team productivity dashboard
- Task status distribution
- Completion rates and metrics
- Per-user workload tracking
- Priority distribution
- Real-time statistics

### Activity & Audit Trail

- Complete activity log of all changes
- User attribution for each action
- Timestamp tracking
- Change history
- Team and task activity filtering

### Security

- JWT token-based authentication
- Bcrypt password hashing
- Role-based authorization
- Team data isolation
- CORS protection
- Input validation

## 🛠️ Tech Stack

### Frontend

- **React 18** + TypeScript - UI framework
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Tailwind CSS** - Responsive styling
- **Framer Motion** - Smooth animations

### Backend

- **Node.js** + Express.js - REST API
- **TypeScript** - Type safety throughout
- **JWT (jsonwebtoken)** - Authentication
- **Bcrypt** - Password hashing

### Database

- **PostgreSQL** - Production relational DB
- **Prisma ORM** - Type-safe database access
- **Migrations** - Automatic schema management

## 📊 What's Included

✅ **Backend:** 20 API endpoints, 5 controllers, 5 services  
✅ **Frontend:** 7+ pages, 15+ components, responsive design  
✅ **Database:** 5 models, 4 enums, proper relationships  
✅ **Documentation:** 11 guides, 2000+ lines  
✅ **Demo Data:** 5 users, 3 teams, 11 tasks, 13 activities  
✅ **Security:** JWT, bcrypt, role-based access control  
✅ **Testing:** Manual test scenarios and checklists
│
└── README.md # This file

````

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
````

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
