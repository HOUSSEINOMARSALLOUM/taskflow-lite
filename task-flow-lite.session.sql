-- TaskFlow Lite - Demo Session Data
-- This script populates the database with sample data for demonstration
-- Run this AFTER running: npm run migrate

-- ============================================================================
-- DEMO DATA SETUP
-- ============================================================================
-- This creates realistic demo users, teams, and tasks to showcase the app

-- ============================================================================
-- 1. CREATE DEMO USERS
-- ============================================================================

INSERT INTO users (id, email, name, password, role, "createdAt", "updatedAt")
VALUES
  -- Password: password123 (bcrypt hashed - you need to use bcrypt in the app)
  ('user1_demo', 'alice@taskflow.demo', 'Alice Johnson', '$2b$10$...', 'MEMBER', NOW(), NOW()),
  ('user2_demo', 'bob@taskflow.demo', 'Bob Smith', '$2b$10$...', 'MEMBER', NOW(), NOW()),
  ('user3_demo', 'charlie@taskflow.demo', 'Charlie Brown', 'password123', 'MEMBER', NOW(), NOW()),
  ('user4_demo', 'diana@taskflow.demo', 'Diana Prince', 'password123', 'MEMBER', NOW(), NOW()),
  ('user5_demo', 'eve@taskflow.demo', 'Eve Wilson', 'password123', 'ADMIN', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 2. CREATE DEMO TEAMS
-- ============================================================================

INSERT INTO teams (id, name, slug, description, "createdAt", "updatedAt")
VALUES
  ('team1_demo', 'Product Development', 'product-development', 'Building awesome features for TaskFlow Lite', NOW(), NOW()),
  ('team2_demo', 'Marketing', 'marketing', 'Marketing and growth initiatives', NOW(), NOW()),
  ('team3_demo', 'Design', 'design', 'UI/UX design and brand work', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 3. ADD TEAM MEMBERS
-- ============================================================================

INSERT INTO team_members (id, "teamId", "userId", role, "joinedAt")
VALUES
  -- Product Development Team
  ('tm1_demo', 'team1_demo', 'user1_demo', 'LEADER', NOW()),
  ('tm2_demo', 'team1_demo', 'user2_demo', 'MEMBER', NOW()),
  ('tm3_demo', 'team1_demo', 'user3_demo', 'MEMBER', NOW()),
  
  -- Marketing Team
  ('tm4_demo', 'team2_demo', 'user4_demo', 'LEADER', NOW()),
  ('tm5_demo', 'team2_demo', 'user2_demo', 'MEMBER', NOW()),
  
  -- Design Team
  ('tm6_demo', 'team3_demo', 'user5_demo', 'LEADER', NOW()),
  ('tm7_demo', 'team3_demo', 'user1_demo', 'MEMBER', NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 4. CREATE DEMO TASKS
-- ============================================================================

INSERT INTO tasks (id, title, description, status, priority, "dueDate", "teamId", "createdById", "assignedToId", "createdAt", "updatedAt", "completedAt")
VALUES
  -- Product Development Tasks
  ('task1_demo', 'Design user dashboard', 'Create mockups and wireframes for the main dashboard', 'IN_PROGRESS', 'HIGH', NOW() + INTERVAL '5 days', 'team1_demo', 'user1_demo', 'user3_demo', NOW() - INTERVAL '2 days', NOW(), NULL),
  ('task2_demo', 'Implement authentication', 'Set up JWT authentication system', 'DONE', 'URGENT', NOW() - INTERVAL '1 days', 'team1_demo', 'user1_demo', 'user2_demo', NOW() - INTERVAL '7 days', NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days'),
  ('task3_demo', 'Create API documentation', 'Document all REST endpoints', 'TODO', 'MEDIUM', NOW() + INTERVAL '10 days', 'team1_demo', 'user2_demo', 'user3_demo', NOW() - INTERVAL '3 days', NOW(), NULL),
  ('task4_demo', 'Setup database migration', 'Implement Prisma migrations', 'DONE', 'HIGH', NOW() - INTERVAL '5 days', 'team1_demo', 'user1_demo', 'user1_demo', NOW() - INTERVAL '10 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
  ('task5_demo', 'Write unit tests', 'Add tests for auth services', 'IN_PROGRESS', 'MEDIUM', NOW() + INTERVAL '7 days', 'team1_demo', 'user2_demo', 'user2_demo', NOW() - INTERVAL '2 days', NOW(), NULL),
  
  -- Marketing Tasks
  ('task6_demo', 'Create social media campaign', 'Plan and design Twitter/LinkedIn content', 'TODO', 'HIGH', NOW() + INTERVAL '8 days', 'team2_demo', 'user4_demo', 'user4_demo', NOW() - INTERVAL '1 days', NOW(), NULL),
  ('task7_demo', 'Write blog post about features', 'Explain key features in blog', 'IN_PROGRESS', 'MEDIUM', NOW() + INTERVAL '3 days', 'team2_demo', 'user4_demo', 'user2_demo', NOW() - INTERVAL '4 days', NOW(), NULL),
  ('task8_demo', 'Email newsletter', 'Send monthly product updates', 'TODO', 'LOW', NOW() + INTERVAL '15 days', 'team2_demo', 'user2_demo', 'user4_demo', NOW() - INTERVAL '5 days', NOW(), NULL),
  
  -- Design Tasks
  ('task9_demo', 'Redesign task cards', 'Improve visual hierarchy', 'IN_PROGRESS', 'MEDIUM', NOW() + INTERVAL '4 days', 'team3_demo', 'user5_demo', 'user1_demo', NOW() - INTERVAL '6 days', NOW(), NULL),
  ('task10_demo', 'Create color palette', 'Define primary and accent colors', 'DONE', 'HIGH', NOW() - INTERVAL '2 days', 'team3_demo', 'user5_demo', 'user5_demo', NOW() - INTERVAL '8 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
  ('task11_demo', 'Design analytics dashboard', 'Create charts and metrics visualization', 'TODO', 'MEDIUM', NOW() + INTERVAL '12 days', 'team3_demo', 'user1_demo', 'user5_demo', NOW() - INTERVAL '3 days', NOW(), NULL)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 5. CREATE DEMO ACTIVITY LOGS
-- ============================================================================

INSERT INTO activity_logs (id, action, details, "userId", "taskId", "teamId", "createdAt")
VALUES
  -- Task Creation Activities
  ('act1_demo', 'task_created', '{"title": "Design user dashboard", "priority": "HIGH"}', 'user1_demo', 'task1_demo', 'team1_demo', NOW() - INTERVAL '2 days'),
  ('act2_demo', 'task_created', '{"title": "Implement authentication", "priority": "URGENT"}', 'user1_demo', 'task2_demo', 'team1_demo', NOW() - INTERVAL '7 days'),
  ('act3_demo', 'task_created', '{"title": "Create API documentation", "priority": "MEDIUM"}', 'user2_demo', 'task3_demo', 'team1_demo', NOW() - INTERVAL '3 days'),
  
  -- Task Status Changes
  ('act4_demo', 'status_changed', '{"oldStatus": "TODO", "newStatus": "IN_PROGRESS"}', 'user2_demo', 'task2_demo', 'team1_demo', NOW() - INTERVAL '5 days'),
  ('act5_demo', 'status_changed', '{"oldStatus": "IN_PROGRESS", "newStatus": "DONE"}', 'user2_demo', 'task2_demo', 'team1_demo', NOW() - INTERVAL '1 days'),
  ('act6_demo', 'status_changed', '{"oldStatus": "TODO", "newStatus": "IN_PROGRESS"}', 'user1_demo', 'task1_demo', 'team1_demo', NOW() - INTERVAL '2 days'),
  ('act7_demo', 'status_changed', '{"oldStatus": "TODO", "newStatus": "IN_PROGRESS"}', 'user2_demo', 'task5_demo', 'team1_demo', NOW() - INTERVAL '2 days'),
  
  -- Marketing Activities
  ('act8_demo', 'task_created', '{"title": "Create social media campaign", "priority": "HIGH"}', 'user4_demo', 'task6_demo', 'team2_demo', NOW() - INTERVAL '1 days'),
  ('act9_demo', 'task_created', '{"title": "Write blog post about features", "priority": "MEDIUM"}', 'user4_demo', 'task7_demo', 'team2_demo', NOW() - INTERVAL '4 days'),
  ('act10_demo', 'status_changed', '{"oldStatus": "TODO", "newStatus": "IN_PROGRESS"}', 'user2_demo', 'task7_demo', 'team2_demo', NOW() - INTERVAL '3 days'),
  
  -- Design Activities
  ('act11_demo', 'task_created', '{"title": "Redesign task cards", "priority": "MEDIUM"}', 'user5_demo', 'task9_demo', 'team3_demo', NOW() - INTERVAL '6 days'),
  ('act12_demo', 'task_created', '{"title": "Create color palette", "priority": "HIGH"}', 'user5_demo', 'task10_demo', 'team3_demo', NOW() - INTERVAL '8 days'),
  ('act13_demo', 'status_changed', '{"oldStatus": "TODO", "newStatus": "DONE"}', 'user5_demo', 'task10_demo', 'team3_demo', NOW() - INTERVAL '2 days')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- DEMO DATA SUMMARY
-- ============================================================================
-- The demo includes:
-- Users:        5 demo users (Alice, Bob, Charlie, Diana, Eve)
-- Teams:        3 teams (Product, Marketing, Design)
-- Memberships:  7 team memberships with mixed roles
-- Tasks:        11 tasks across teams with various statuses
-- Activities:   13 activity log entries
-- ============================================================================

-- ============================================================================
-- VERIFICATION QUERIES (Optional - Run to check data)
-- ============================================================================

-- Count demo data
SELECT 
  (SELECT COUNT(*) FROM users WHERE id LIKE '%_demo') as total_users,
  (SELECT COUNT(*) FROM teams WHERE id LIKE '%_demo') as total_teams,
  (SELECT COUNT(*) FROM team_members WHERE id LIKE '%_demo') as total_members,
  (SELECT COUNT(*) FROM tasks WHERE id LIKE '%_demo') as total_tasks,
  (SELECT COUNT(*) FROM activity_logs WHERE id LIKE '%_demo') as total_activities;

-- Show all demo teams with member counts
SELECT 
  t.name,
  t.description,
  COUNT(tm.id) as member_count,
  COUNT(DISTINCT task.id) as task_count
FROM teams t
LEFT JOIN team_members tm ON t.id = tm."teamId"
LEFT JOIN tasks task ON t.id = task."teamId"
WHERE t.id LIKE '%_demo'
GROUP BY t.id, t.name, t.description
ORDER BY t.name;

-- Show all demo tasks with status breakdown
SELECT 
  status,
  COUNT(*) as count,
  ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM tasks WHERE id LIKE '%_demo'), 1) as percentage
FROM tasks
WHERE id LIKE '%_demo'
GROUP BY status
ORDER BY 
  CASE status 
    WHEN 'TODO' THEN 1
    WHEN 'IN_PROGRESS' THEN 2
    WHEN 'DONE' THEN 3
  END;

-- Show priority distribution
SELECT 
  priority,
  COUNT(*) as count
FROM tasks
WHERE id LIKE '%_demo'
GROUP BY priority
ORDER BY 
  CASE priority
    WHEN 'URGENT' THEN 1
    WHEN 'HIGH' THEN 2
    WHEN 'MEDIUM' THEN 3
    WHEN 'LOW' THEN 4
  END;
