# 🚀 TaskFlow Lite - Demo Quickstart

## 5-Minute Setup

### Terminal Window 1: Backend

```bash
cd server
npm install
npm run migrate
# Wait for "Connected to PostgreSQL" message
npm run dev
# Should show "✓ Server running on :5000"
```

### Terminal Window 2: Frontend

```bash
cd client
npm install
npm run dev
# Should show "Local: http://localhost:5173"
```

### Browser

```
Navigate to: http://localhost:5173
```

---

## Pre-Loaded Demo Data

Run this after migrations to get instant demo:

```bash
cd server
npm run seed
```

**Demo Accounts:**

```
Email: alice@taskflow.demo  | Password: Demo@123
Email: bob@taskflow.demo    | Password: Demo@123
Email: charlie@taskflow.demo| Password: Demo@123
Email: diana@taskflow.demo  | Password: Demo@123
Email: eve@taskflow.demo    | Password: Demo@123
```

---

## What's Pre-Loaded

✅ **5 User Accounts** - Ready to login  
✅ **3 Teams** - With predefined roles  
✅ **11 Tasks** - With various statuses  
✅ **13 Activity Logs** - Showing task history  
✅ **Team Relationships** - Already configured

---

## Live Demo Flow (3 minutes)

```
1. [30s] Show Registration
   → Register: testuser@demo.local
   → Name: Demo User
   → Password: Test123!@

2. [30s] Show Dashboard
   → "Welcome" message
   → "Create Team" button
   → Navigation menu

3. [1m] Create & Manage
   → Click "Create Team"
   → Name: Demo Project
   → Create task: "Build API"
   → Change status: TODO → IN_PROGRESS

4. [1m] Show Analytics
   → Click Analytics tab
   → Show: 1 in progress, 0 completed
   → Show team productivity chart

5. [Final] Show Activity
   → Click Activity Log
   → Show all changes tracked
```

---

## Features to Demonstrate

| Feature       | Demo Path                            | Time |
| ------------- | ------------------------------------ | ---- |
| **Auth**      | Register → Login                     | 1m   |
| **Teams**     | Create Team → Add Members            | 1m   |
| **Tasks**     | Create Task → Assign → Update Status | 2m   |
| **Analytics** | Tasks Dashboard → View Stats         | 1m   |
| **Activity**  | Activity Log → See Audit Trail       | 30s  |

---

## Keyboard Shortcuts

```
ESC       → Close dialogs
Enter     → Submit forms
Tab       → Navigate form fields
Ctrl+K    → Quick search (if implemented)
```

---

## Demo Data Overview

### Pre-Loaded Teams

1. **Engineering Team**

   - Members: Alice (LEADER), Bob, Charlie
   - 4 Tasks: API, Frontend, Database, Testing
   - Status Mix: 1 TODO, 2 IN_PROGRESS, 1 DONE

2. **Product Team**

   - Members: Diana (LEADER), Eve
   - 4 Tasks: Requirements, Design, UX Review, Feedback
   - Status Mix: 2 TODO, 1 IN_PROGRESS, 1 DONE

3. **Operations Team**
   - Members: Charlie (LEADER), Diana
   - 3 Tasks: Deployment, Monitoring, Documentation
   - Status Mix: 1 TODO, 1 IN_PROGRESS, 1 DONE

---

## API Endpoints (For Technical Demos)

```bash
# Authentication
POST   /api/auth/register      → Create account
POST   /api/auth/login         → Login
POST   /api/auth/refresh       → Refresh token
GET    /api/auth/me            → Current user

# Teams
GET    /api/teams              → List teams
POST   /api/teams              → Create team
GET    /api/teams/:id          → Team details
PUT    /api/teams/:id          → Update team
DELETE /api/teams/:id          → Delete team
POST   /api/teams/:id/members  → Add member

# Tasks
GET    /api/tasks              → List tasks
POST   /api/tasks              → Create task
GET    /api/tasks/:id          → Task details
PUT    /api/tasks/:id          → Update task
DELETE /api/tasks/:id          → Delete task

# Analytics
GET    /api/analytics/overview → Stats
GET    /api/analytics/per-user → User metrics

# Activity
GET    /api/activity/team/:teamId   → Team activities
GET    /api/activity/task/:taskId   → Task activities
```

---

## Troubleshooting Quick Ref

| Problem                      | Fix                                                          |
| ---------------------------- | ------------------------------------------------------------ |
| "Cannot connect to database" | Check `.env` has correct DATABASE_URL                        |
| "Port 5000 already in use"   | Kill process: `lsof -i :5000`                                |
| "Port 5173 already in use"   | Kill process: `lsof -i :5173`                                |
| "ENOENT migrations"          | Run: `npm run migrate` in server folder                      |
| "Module not found"           | Run: `npm install` in respective folder                      |
| "Blank page"                 | Hard refresh: `Ctrl+Shift+R` (Chrome) or `Cmd+Shift+R` (Mac) |
| "CORS error"                 | Check .env has correct API_URL in client                     |

---

## Pro Demo Tips

✨ **Tip 1:** Pre-load demo data before showing  
✨ **Tip 2:** Use incognito window for "fresh user" demo  
✨ **Tip 3:** Open DevTools to show API calls  
✨ **Tip 4:** Record screen during live demo for replay  
✨ **Tip 5:** Have talking points written down  
✨ **Tip 6:** Practice 3x before real demo  
✨ **Tip 7:** Use realistic company names in examples

---

## Architecture Quick Look

```
┌─────────────────────────────────────────┐
│         FRONTEND (React + Vite)         │
│  Components → Services → API Client     │
└────────────────┬────────────────────────┘
                 │ HTTP/REST
                 ↓
┌─────────────────────────────────────────┐
│      BACKEND (Express + TypeScript)     │
│  Routes → Controllers → Services        │
└────────────────┬────────────────────────┘
                 │ SQL
                 ↓
┌─────────────────────────────────────────┐
│     DATABASE (PostgreSQL + Prisma)      │
│  Users, Teams, Tasks, Activities        │
└─────────────────────────────────────────┘
```

---

## Security Features (Mention in Demo)

🔒 **JWT Authentication** - Secure token-based auth  
🔒 **Password Hashing** - Bcrypt with salt  
🔒 **Role-Based Access** - LEADER, MEMBER, ADMIN  
🔒 **Team Isolation** - Users can't see others' teams  
🔒 **Activity Audit Trail** - All changes logged  
🔒 **CORS Protection** - Only allowed origins  
🔒 **Input Validation** - All data validated

---

## Performance Notes

⚡ **Response Time:** Most endpoints < 100ms  
⚡ **Database Indexes:** On commonly queried fields  
⚡ **API Pagination:** Large lists are paginated  
⚡ **Token Refresh:** Automatic, no manual action  
⚡ **Lazy Loading:** Frontend loads data on demand

---

## Post-Demo Checklist

- [ ] Collected feedback
- [ ] Answered all questions
- [ ] Got contact info if interested
- [ ] Sent follow-up materials
- [ ] Noted requested features
- [ ] Thanked attendees
- [ ] Cleaned up accounts/data

---

## For Deployment Later

```bash
# Build for production
npm run build

# Environment variables needed
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
REFRESH_SECRET=your-refresh-secret
API_URL=https://your-domain.com/api

# Run production
npm start
```

---

**Last Updated:** 2024  
**Version:** 1.0.0  
**Status:** ✅ Ready for Demo

Good luck! Questions? Check the full documentation in:

- START_HERE.md
- SETUP_GUIDE.md
- README_IMPLEMENTATION.md
- LIVE_DEMO_GUIDE.md
