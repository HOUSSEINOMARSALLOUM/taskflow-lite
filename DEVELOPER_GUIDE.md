# TaskFlow Lite Developer Quick Reference

## 🎯 Project Status: Phase 1 Complete ✅

**Created:** 70+ files across backend, frontend, and config
**Implemented:** Full authentication, all API endpoints, responsive UI foundation
**Next:** Dashboard pages, analytics UI, testing suite, deployment

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────┐
│   React Frontend (Vite + React Router)          │
│   ├─ Auth Pages (Login/Register)                │
│   ├─ Dashboard (Home)                           │
│   └─ API Client (Axios with interceptors)       │
└────────────────────┬────────────────────────────┘
                     │ HTTP/JSON
                     │
┌────────────────────▼────────────────────────────┐
│   Express.js API (Node.js + TypeScript)         │
│   ├─ Controllers (Request handlers)             │
│   ├─ Services (Business logic)                  │
│   ├─ Middleware (Auth, errors)                  │
│   └─ Routes (API endpoints)                     │
└────────────────────┬────────────────────────────┘
                     │ SQL
                     │
┌────────────────────▼────────────────────────────┐
│   PostgreSQL Database (Prisma ORM)              │
│   ├─ Users (auth, roles)                        │
│   ├─ Teams (team data)                          │
│   ├─ Tasks (task management)                    │
│   ├─ ActivityLogs (audit trail)                 │
│   └─ TeamMembers (relationships)                │
└─────────────────────────────────────────────────┘
```

---

## 📁 Key Files to Know

### Backend Essentials

| File                          | Purpose                            |
| ----------------------------- | ---------------------------------- |
| `server/src/index.ts`         | Express app setup & route mounting |
| `server/prisma/schema.prisma` | Database schema definition         |
| `server/src/utils/jwt.ts`     | JWT tokens & auth middleware       |
| `server/src/services/*`       | Business logic for each feature    |
| `server/src/controllers/*`    | Request handlers                   |
| `server/src/routes/*`         | API route definitions              |

### Frontend Essentials

| File                                  | Purpose                     |
| ------------------------------------- | --------------------------- |
| `client/src/App.tsx`                  | Router & main app component |
| `client/src/services/api.ts`          | Axios API client            |
| `client/src/services/authContext.tsx` | Auth state management       |
| `client/src/pages/*`                  | Page components             |
| `client/tailwind.config.js`           | Tailwind customization      |

---

## 🔌 API Endpoints Quick Reference

### Auth

```bash
POST   /api/auth/register        # { email, name, password }
POST   /api/auth/login           # { email, password }
POST   /api/auth/refresh         # { refreshToken }
GET    /api/auth/me              # Requires auth header
POST   /api/auth/logout          # Requires auth header
```

### Teams

```bash
GET    /api/teams                # List user's teams
POST   /api/teams                # { name, description? }
GET    /api/teams/:id            # Get team details
POST   /api/teams/:id/members    # { userId }
```

### Tasks

```bash
GET    /api/teams/:teamId/tasks?status=TODO&assignedToId=x&page=1
POST   /api/teams/:teamId/tasks  # { title, description, priority, dueDate, assignedToId }
GET    /api/tasks/:id            # Get task details
PUT    /api/tasks/:id            # Update task fields
DELETE /api/tasks/:id            # Delete task
```

### Activities & Analytics

```bash
GET    /api/teams/:teamId/activities/team
GET    /api/teams/:teamId/activities/task/:taskId
GET    /api/teams/:teamId/analytics/overview
GET    /api/teams/:teamId/analytics/tasks-per-user
GET    /api/teams/:teamId/analytics/overdue
```

---

## 🔐 Authentication Flow

```mermaid
graph LR
    A[User] -->|Email + Password| B[/api/auth/register]
    B -->|Create user| C[Database]
    C -->|Return tokens| D[Frontend]
    D -->|Store in localStorage| E[Browser]

    F[User] -->|Email + Password| G[/api/auth/login]
    G -->|Validate & return tokens| H[Frontend]
    H -->|Store in localStorage| I[Browser]

    J[Frontend] -->|accessToken in header| K[Protected Endpoint]
    K -->|Verify JWT| L{Valid?}
    L -->|Yes| M[Execute]
    L -->|No - 401| N[Try refresh]
    N -->|POST refreshToken| O[/api/auth/refresh]
    O -->|New accessToken| J
```

---

## 💻 Common Commands

### Backend

```bash
# Development
npm run dev                 # Start with nodemon

# Database
npm run migrate            # Create migrations & run
npm run prisma:studio     # Open Prisma Studio GUI
npm run prisma:generate   # Regenerate Prisma client

# Testing
npm test                  # Run all tests with coverage
npm test -- --watch      # Watch mode
npm run test:integration # API tests only

# Build
npm run build             # Compile TypeScript
npm start                 # Run compiled code
```

### Frontend

```bash
# Development
npm run dev               # Start Vite dev server

# Testing
npm test                  # Run in watch mode
npm run coverage          # Coverage report
npm run test:ui          # Test UI dashboard

# Build
npm run build             # Production build
npm run preview           # Preview build locally

# Linting
npm run lint              # Check code
```

---

## 🗂️ File Organization Guide

### Adding a New Feature

**Backend Example: New "Notes" feature**

1. **Update schema** (`prisma/schema.prisma`)

   ```prisma
   model Note {
     id     String  @id @default(cuid())
     content String
     taskId String
     task   Task    @relation(fields: [taskId], references: [id])
     @@map("notes")
   }
   ```

2. **Create migration**

   ```bash
   npm run migrate -- --name add_notes
   ```

3. **Create service** (`src/services/noteService.ts`)

   ```typescript
   export class NoteService {
     async createNote(taskId: string, content: string) { ... }
   }
   ```

4. **Create controller** (`src/controllers/noteController.ts`)

   ```typescript
   export const createNote = asyncHandler(async (req, res) => { ... })
   ```

5. **Create routes** (`src/routes/noteRoutes.ts`)

   ```typescript
   router.post("/:taskId/notes", createNote);
   ```

6. **Mount routes** (`src/index.ts`)
   ```typescript
   app.use("/api/notes", noteRoutes);
   ```

---

## 🧪 Testing Quick Start

### Backend Unit Test Example

```typescript
import authService from "../services/authService";

describe("AuthService", () => {
  it("should hash password correctly", async () => {
    const hash = await hashPassword("test123");
    const isValid = await comparePasswords("test123", hash);
    expect(isValid).toBe(true);
  });
});
```

Run: `npm test -- authService.test.ts`

### Frontend Component Test Example

```typescript
import { render, screen } from "@testing-library/react";
import { LoginPage } from "../pages/LoginPage";

test("renders login form", () => {
  render(<LoginPage />);
  expect(screen.getByPlaceholderText("your@email.com")).toBeInTheDocument();
});
```

Run: `npm test`

---

## 🚨 Common Issues & Fixes

### "Cannot find module '@prisma/client'"

```bash
npm run prisma:generate
npm install
```

### "JWT token expired"

- Frontend auto-refreshes on 401
- Check `src/services/api.ts` interceptor

### "CORS error"

- Check `CORS_ORIGIN` in backend `.env`
- Default: `http://localhost:5173` (Vite port)

### "Database connection fails"

```bash
# Check DATABASE_URL format
postgresql://user:password@localhost:5432/taskflow_lite

# Ensure PostgreSQL is running
# Windows: pgAdmin or Services
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

### "Port already in use"

```bash
# Backend (5000)
lsof -i :5000

# Frontend (5173)
lsof -i :5173
```

---

## 📈 Performance Tips

1. **Database Queries** - Use `select` in Prisma to limit fields

   ```typescript
   prisma.user.findMany({
     select: { id: true, name: true }, // Don't fetch password!
   });
   ```

2. **API Pagination** - Always paginate large lists

   ```typescript
   GET /api/teams/:teamId/tasks?page=1&limit=20
   ```

3. **Frontend Loading** - Show spinners during async operations

   ```typescript
   const { isLoading } = useAuth();
   if (isLoading) return <Spinner />;
   ```

4. **Caching** - Cache team/user data in frontend
   ```typescript
   const [teams, setTeams] = useState(null);
   ```

---

## 🔒 Security Checklist

- ✅ Passwords hashed with bcrypt (rounds: 10)
- ✅ JWT tokens with expiration (24h)
- ✅ Refresh tokens (7d)
- ✅ CORS configured
- ✅ SQL injection prevention (Prisma)
- ✅ XSS prevention (React auto-escapes)
- ✅ Role-based access control
- ✅ Activity logging

**Before Production:**

- [ ] Change JWT_SECRET & JWT_REFRESH_SECRET
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Enable rate limiting
- [ ] Set up monitoring/logging
- [ ] Backup database regularly

---

## 📚 Documentation Links

- [Prisma Docs](https://www.prisma.io/docs)
- [Express.js](https://expressjs.com)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Axios](https://axios-http.com)

---

## 🎯 Next Milestones

**Week 1:** ✅ Core API + Auth  
**Week 2:** ⏳ Dashboard pages + Analytics UI  
**Week 3:** ⏳ Testing suite  
**Week 4:** ⏳ Deployment

---

Last Updated: January 3, 2026  
Version: 1.0.0-alpha
