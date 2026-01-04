# TaskFlow Lite - Demo & Testing Guide

## 🎯 Quick Demo Setup

### Option 1: Register Through the App (Recommended for First Time)

1. **Start the application**

   ```bash
   cd server && npm run dev
   cd client && npm run dev
   ```

2. **Navigate to registration**

   - Open http://localhost:5173/register

3. **Create first demo account**

   ```
   Email:    alice@demo.local
   Name:     Alice Johnson
   Password: TestPassword123!
   ```

4. **Login and explore**
   - Create teams
   - Add members
   - Create tasks
   - View analytics

### Option 2: Populate with Pre-Made Demo Data

If you want to have data already in the database:

1. **Run the database migrations**

   ```bash
   cd server
   npm run migrate
   ```

2. **Load demo data into PostgreSQL**

   ```bash
   psql -U postgres -d taskflow_lite -f task-flow-lite.session.sql
   ```

3. **Note about demo users**
   - The SQL file creates users with placeholder passwords
   - You still need to register through the app to get proper JWT tokens
   - OR manually insert bcrypt hashed passwords into the users table

## 👥 Demo Test Accounts

Use these credentials to test the application:

### Account 1: Product Manager (Team Leader)

```
Email:    alice@taskflow.demo
Password: Demo@123
Role:     MEMBER (becomes LEADER of teams they create)
```

### Account 2: Developer

```
Email:    bob@taskflow.demo
Password: Demo@123
Role:     MEMBER
```

### Account 3: Developer

```
Email:    charlie@taskflow.demo
Password: Demo@123
Role:     MEMBER
```

### Account 4: Marketing Manager (Team Leader)

```
Email:    diana@taskflow.demo
Password: Demo@123
Role:     MEMBER (becomes LEADER of teams they create)
```

### Account 5: Admin

```
Email:    eve@taskflow.demo
Password: Demo@123
Role:     ADMIN
```

## 📊 Demo Data Overview

### Teams in Demo

1. **Product Development**

   - Members: Alice (LEADER), Bob, Charlie
   - Tasks: API docs, authentication, dashboard design
   - Status: Mix of TODO, IN_PROGRESS, DONE

2. **Marketing**

   - Members: Diana (LEADER), Bob
   - Tasks: Social campaign, blog post
   - Status: Mix of TODO, IN_PROGRESS

3. **Design**
   - Members: Eve (LEADER), Alice
   - Tasks: UI redesign, color palette
   - Status: Mix of TODO, IN_PROGRESS, DONE

### Tasks in Demo

- **11 total tasks** across all teams
- **Status distribution:**
  - TODO: 4 tasks
  - IN_PROGRESS: 4 tasks
  - DONE: 3 tasks
- **Priority distribution:**
  - URGENT: 1 task
  - HIGH: 4 tasks
  - MEDIUM: 5 tasks
  - LOW: 1 task

### Activities in Demo

- **13 activity log entries**
- Includes task creation and status changes
- Shows realistic workflow progression

## 🎬 Suggested Demo Walkthrough

### Walk-Through 1: Complete Account Setup (5 minutes)

1. **Register new account**

   - Click "Sign Up"
   - Fill in: alice@taskflow.demo, Alice Johnson, password
   - Submit registration
   - Auto-login should occur

2. **View dashboard**

   - See "Welcome, Alice" message
   - Notice no teams yet

3. **Create first team**
   - Click "Create Team"
   - Name: "Product Development"
   - Description: "Building amazing features"
   - Submit

### Walk-Through 2: Team Management (5 minutes)

1. **View team details**

   - Click on "Product Development"
   - See team members section
   - Currently only you (Alice)

2. **Add team members**

   - Click "Add Member"
   - Get Bob's user ID (need him to register first OR use demo IDs)
   - Click Add
   - See Bob added to team

3. **Check member roles**
   - You are LEADER (created the team)
   - Bob is MEMBER

### Walk-Through 3: Task Management (10 minutes)

1. **Create tasks**

   - Click "Create Task"
   - Title: "Design Dashboard"
   - Description: "Create wireframes and mockups"
   - Priority: HIGH
   - Due Date: 5 days from now
   - Assign to: Bob
   - Submit

2. **Create more tasks**

   - Title: "Setup Database"
   - Priority: URGENT
   - Assign to: Yourself

   - Title: "API Documentation"
   - Priority: MEDIUM
   - Assign to: Bob

3. **View task list**

   - See all 3 tasks
   - Filter by status
   - Filter by assignee

4. **Update task status**

   - Click "Setup Database" task
   - Change status to "IN_PROGRESS"
   - Notice activity log updated

5. **Update task again**
   - Change status to "DONE"
   - See completion timestamp

### Walk-Through 4: Analytics (5 minutes)

1. **View team analytics**

   - Click Analytics button
   - See overview stats:
     - Total: 3 tasks
     - Completed: 1 task
     - In Progress: 1 task
     - Todo: 1 task
     - Completion Rate: 33%

2. **View tasks per user**

   - See Alice: 1 completed, 0 in progress, 0 todo
   - See Bob: 0 completed, 0 in progress, 2 todo

3. **View overdue tasks**
   - See which tasks are past due
   - Shows assignee and creator info

### Walk-Through 5: Activity Log (3 minutes)

1. **View team activities**

   - Click "Activity Log"
   - See all task creations
   - See status changes
   - Newest first

2. **View task activities**
   - Click on a task
   - See only that task's activities
   - Shows full change history

## 🧪 Testing Scenarios

### Scenario 1: Multi-User Collaboration

1. Register Alice (Create Product team)
2. Register Bob
3. Alice adds Bob to team
4. Alice creates tasks, assigns to Bob
5. Bob logs in, sees assigned tasks
6. Bob updates task status
7. Alice sees changes in real-time

### Scenario 2: Team Leadership

1. Alice creates "Product" team (becomes LEADER)
2. Alice can add/remove members
3. Bob is added as MEMBER
4. Bob tries to delete Alice's task (should fail)
5. Alice can delete tasks
6. Alice can delete Bob from team

### Scenario 3: Task Workflow

1. Create task (TODO)
2. Assign to team member
3. Member updates to IN_PROGRESS
4. Member marks as DONE
5. Check activity log shows all transitions
6. Analytics updates in real-time

### Scenario 4: Analytics Accuracy

1. Create 10 tasks with different statuses
2. Set various priorities and due dates
3. Check overview calculations are correct
4. Verify per-user breakdown matches assignments
5. Check overdue list accuracy

## 🔍 Data Inspection

### View Users via Database

```sql
SELECT id, email, name, role FROM users WHERE id LIKE '%_demo' ORDER BY email;
```

### View Teams via Database

```sql
SELECT t.id, t.name, COUNT(tm.id) as members, COUNT(task.id) as tasks
FROM teams t
LEFT JOIN team_members tm ON t.id = tm."teamId"
LEFT JOIN tasks task ON t.id = task."teamId"
WHERE t.id LIKE '%_demo'
GROUP BY t.id, t.name;
```

### View Tasks via Database

```sql
SELECT
  t.id, t.title, t.status, t.priority,
  u.name as created_by, a.name as assigned_to
FROM tasks t
LEFT JOIN users u ON t."createdById" = u.id
LEFT JOIN users a ON t."assignedToId" = a.id
WHERE t.id LIKE '%_demo'
ORDER BY t."createdAt" DESC;
```

### View Activities via Database

```sql
SELECT a.action, a.details, u.name as user, t.title as task, a."createdAt"
FROM activity_logs a
LEFT JOIN users u ON a."userId" = u.id
LEFT JOIN tasks t ON a."taskId" = t.id
WHERE a.id LIKE '%_demo'
ORDER BY a."createdAt" DESC;
```

## 🐛 Common Testing Issues

### Issue: Can't add members

**Solution**: Make sure both users are registered. Get the exact user ID from the users table.

### Issue: Status doesn't update

**Solution**: Check browser console for errors. Verify you're assigned to the task or are a LEADER.

### Issue: Analytics show wrong numbers

**Solution**: Refresh the page. Wait for async requests to complete.

### Issue: Can't delete task

**Solution**: Only creator or LEADER can delete. Check your role in the team.

### Issue: Activities not logging

**Solution**: Check that activities table has data. Some actions may not log yet.

## 📈 Performance Testing

### Load Testing Checklist

- [ ] Create 50+ tasks
- [ ] Check filtering performance
- [ ] Check pagination works
- [ ] Check analytics calculation time
- [ ] Monitor database query performance

### Data Volume Tests

- [ ] 10 teams
- [ ] 100 team members
- [ ] 1000 tasks
- [ ] 5000 activity logs

## ✅ Feature Verification Checklist

Use this checklist to verify all features work:

### Authentication

- [ ] Register new user
- [ ] Login with credentials
- [ ] Session persists on reload
- [ ] Logout clears session
- [ ] Protected routes redirect to login

### Teams

- [ ] Create team
- [ ] View all teams
- [ ] View team details
- [ ] Add team member
- [ ] See member list with roles
- [ ] Cannot add duplicate members

### Tasks

- [ ] Create task with all fields
- [ ] View tasks list
- [ ] Filter by status
- [ ] Filter by priority
- [ ] Filter by assignee
- [ ] Pagination works
- [ ] Update task fields
- [ ] Change task status
- [ ] Delete task (permission check)

### Analytics

- [ ] Overview shows correct counts
- [ ] Completion rate calculates
- [ ] Tasks per user list shows
- [ ] Overdue tasks identified

### Activities

- [ ] Team activities logged
- [ ] Task activities logged
- [ ] Filters work
- [ ] Chronological order correct

## 🎓 Demo Notes for Users

When demoing to users, emphasize:

1. **Easy Setup**: Just register and start managing
2. **Collaborative**: Add team members and assign tasks
3. **Status Tracking**: See task progress at a glance
4. **Analytics**: Understand team productivity
5. **Audit Trail**: Know who did what and when
6. **Responsive**: Works on all screen sizes

## 📝 Sample Demo Script (2-3 minutes)

> "Let me show you TaskFlow Lite, a modern task management tool built for teams.
>
> First, I'm going to register a new account. [Register as Alice]
>
> Great! I'm automatically logged in. Now let me create our first team - 'Product Development'. [Create team]
>
> Now I can invite team members. Let me add Bob and Charlie to the team. [Add members]
>
> With the team set up, I can create tasks. Let me create a few tasks with different priorities and statuses. [Create tasks]
>
> Notice how I can assign tasks to specific team members and set due dates. I can also update the status as work progresses. [Update a task]
>
> One of the powerful features is our analytics dashboard. We can see our team's productivity at a glance - how many tasks we've completed, what's in progress, and what's overdue. [View analytics]
>
> Finally, we have a complete activity log showing everything that's happened in the team - who created what, who updated status, and when. [View activities]
>
> That's TaskFlow Lite! Simple, powerful, and built for real team collaboration."

---

## 🚀 Next Steps

After exploring the demo:

1. Customize the application for your needs
2. Add your real team members
3. Create your actual tasks and projects
4. Use analytics to improve team productivity
5. Set up notifications (if extended with webhooks)

Enjoy using TaskFlow Lite! 🎉
