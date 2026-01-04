# TaskFlow Lite - Quick Commands Reference

## 🚀 Start Here

### First Time Setup

```bash
# 1. Create PostgreSQL database
createdb taskflow_lite

# 2. Setup Server
cd server
npm install
# Edit .env with your PostgreSQL password
npm run migrate

# 3. Setup Client
cd ../client
npm install
```

## 📺 Running the Application

### Terminal 1 - Start Backend Server

```bash
cd server
npm run dev
```

✅ Runs on `http://localhost:5000`

### Terminal 2 - Start Frontend

```bash
cd client
npm run dev
```

✅ Runs on `http://localhost:5173`

## 🛠️ Common Commands

### Server Commands

```bash
cd server

npm run dev              # Start development server
npm run build           # Compile TypeScript
npm start               # Run production build
npm test                # Run tests
npm run lint            # Lint code
npm run migrate         # Run database migrations
npm run migrate:dev     # Create new migration
npm run prisma:studio   # Open Prisma Studio (database viewer)
npm run prisma:generate # Generate Prisma Client
```

### Client Commands

```bash
cd client

npm run dev             # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
npm test                # Run tests
npm run test:ui         # Run tests with UI
npm run coverage        # Generate coverage report
npm run lint            # Lint code
```

## 🔧 Configuration

### Update Database Credentials

```bash
# Edit server/.env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/taskflow_lite"
```

### Update API URL (if not localhost)

```bash
# Edit client/.env
VITE_API_URL=http://your-api-url:5000/api
```

## 🧪 Testing

### Backend

```bash
cd server

npm test                    # All tests
npm run test:watch         # Watch mode
npm run test:integration   # Integration tests only
npm test -- --coverage     # With coverage report
```

### Frontend

```bash
cd client

npm test                    # All tests
npm run test:ui            # UI mode
npm run coverage           # Coverage report
npm test -- --watch       # Watch mode
```

## 📊 Database Management

### View Database (Prisma Studio)

```bash
cd server
npm run prisma:studio
# Opens http://localhost:5555
```

### Connect to Database Directly

```bash
# Using psql
psql -U postgres -d taskflow_lite

# Useful queries:
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM teams;
SELECT COUNT(*) FROM tasks;
SELECT COUNT(*) FROM activity_logs;
```

### Reset Database

```bash
cd server
npx prisma migrate reset
# Warning: This deletes all data!
```

## 🔐 Environment Variables

### Server (.env)

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/taskflow_lite
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
BCRYPT_ROUNDS=10
```

### Client (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## 🚨 Troubleshooting

### PostgreSQL Connection Failed

```bash
# Check PostgreSQL is running
psql -U postgres

# Check database exists
psql -U postgres -l | grep taskflow_lite

# Create database if missing
createdb taskflow_lite
```

### Port Already in Use

```bash
# Find process using port 5000 (server)
lsof -i :5000                    # Mac/Linux
netstat -ano | findstr :5000     # Windows

# Kill process
kill -9 PID                       # Mac/Linux
taskkill /PID PID /F             # Windows
```

### Prisma Issues

```bash
cd server

# Clear cache
rm -rf node_modules/.prisma

# Regenerate
npm run prisma:generate

# Reset migrations
npx prisma migrate reset
```

### CORS Errors

```bash
# Check CORS_ORIGIN in server/.env matches client URL
# Default should be: http://localhost:5173

# Restart server after changing
```

## 📋 API Testing

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get Teams (with token)
curl -X GET http://localhost:5000/api/teams \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman

1. Create new collection
2. Set base URL: `http://localhost:5000/api`
3. Import endpoints from this guide
4. Use "Bearer Token" for auth

## 📈 Monitoring & Logs

### Server Logs

```bash
cd server
npm run dev
# Logs appear in terminal

# For production:
npm start 2>&1 | tee app.log
```

### Browser Console

- Open DevTools (F12)
- Check Console tab for client errors
- Check Network tab for API calls

## 🔄 Development Workflow

### Making Changes

```bash
# 1. Make code changes
# 2. Changes auto-compile (hot reload enabled)
# 3. Test in browser or API client
# 4. Commit changes when ready

git add .
git commit -m "Feature: description"
git push
```

### Database Changes

```bash
# 1. Edit server/prisma/schema.prisma
# 2. Create migration
cd server
npm run migrate:dev
# 3. Name your migration
# 4. Commit both schema and migration files
```

## 📦 Build for Production

### Backend

```bash
cd server
npm run build
# Creates dist/ folder

# Test production build
npm start
```

### Frontend

```bash
cd client
npm run build
# Creates dist/ folder

# Test production build
npm run preview
```

### Deploy

```bash
# Backend: Deploy dist/ folder to hosting
# Frontend: Deploy dist/ folder to static hosting (Vercel, Netlify, etc.)

# Update environment variables on hosting platform
```

## 🆘 Getting Help

### Check Documentation

1. [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Detailed setup
2. [README_IMPLEMENTATION.md](./README_IMPLEMENTATION.md) - Features
3. [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Summary

### Check Code

- Server: `server/src/` directory
- Client: `client/src/` directory
- Database: `server/prisma/schema.prisma`

### Debug Tips

```bash
# Enable verbose logging
DEBUG=* npm run dev

# Check types
cd server && npx tsc --noEmit

# Lint code
npm run lint

# Check dependencies
npm list
npm audit
```

---

## 📞 Common Issues & Solutions

| Issue                     | Solution                                               |
| ------------------------- | ------------------------------------------------------ |
| Can't connect to database | Check PostgreSQL is running, verify .env credentials   |
| Port already in use       | Kill process using the port or change PORT in .env     |
| Prisma errors             | Run `npm run prisma:generate` and migrations           |
| CORS errors               | Update CORS_ORIGIN in server/.env                      |
| API calls fail            | Check server is running, verify API URL in client/.env |
| Module not found          | Run `npm install` in the affected directory            |
| Hot reload not working    | Restart dev server                                     |
| Token expired             | App automatically refreshes tokens                     |

---

**Tip**: Keep these commands handy in a terminal tab for quick reference! 🚀
