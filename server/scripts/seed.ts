// TaskFlow Lite - Database Seeder
// This script populates the database with demo data
// Run with: npx ts-node scripts/seed.ts

import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/password";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...\n");

  try {
    // ====================================================================
    // CREATE DEMO USERS WITH PROPERLY HASHED PASSWORDS
    // ====================================================================
    console.log("👥 Creating demo users...");

    const users = await Promise.all([
      prisma.user.upsert({
        where: { email: "alice@taskflow.demo" },
        update: {},
        create: {
          id: "user1_demo",
          email: "alice@taskflow.demo",
          name: "Alice Johnson",
          password: await hashPassword("Demo@123"),
          role: "MEMBER",
        },
      }),
      prisma.user.upsert({
        where: { email: "bob@taskflow.demo" },
        update: {},
        create: {
          id: "user2_demo",
          email: "bob@taskflow.demo",
          name: "Bob Smith",
          password: await hashPassword("Demo@123"),
          role: "MEMBER",
        },
      }),
      prisma.user.upsert({
        where: { email: "charlie@taskflow.demo" },
        update: {},
        create: {
          id: "user3_demo",
          email: "charlie@taskflow.demo",
          name: "Charlie Brown",
          password: await hashPassword("Demo@123"),
          role: "MEMBER",
        },
      }),
      prisma.user.upsert({
        where: { email: "diana@taskflow.demo" },
        update: {},
        create: {
          id: "user4_demo",
          email: "diana@taskflow.demo",
          name: "Diana Prince",
          password: await hashPassword("Demo@123"),
          role: "MEMBER",
        },
      }),
      prisma.user.upsert({
        where: { email: "eve@taskflow.demo" },
        update: {},
        create: {
          id: "user5_demo",
          email: "eve@taskflow.demo",
          name: "Eve Wilson",
          password: await hashPassword("Demo@123"),
          role: "ADMIN",
        },
      }),
    ]);

    console.log(`✅ Created ${users.length} demo users\n`);

    // ====================================================================
    // CREATE DEMO TEAMS
    // ====================================================================
    console.log("🏢 Creating demo teams...");

    const teams = await Promise.all([
      prisma.team.upsert({
        where: { slug: "product-development" },
        update: {},
        create: {
          id: "team1_demo",
          name: "Product Development",
          slug: "product-development",
          description: "Building awesome features for TaskFlow Lite",
        },
      }),
      prisma.team.upsert({
        where: { slug: "marketing" },
        update: {},
        create: {
          id: "team2_demo",
          name: "Marketing",
          slug: "marketing",
          description: "Marketing and growth initiatives",
        },
      }),
      prisma.team.upsert({
        where: { slug: "design" },
        update: {},
        create: {
          id: "team3_demo",
          name: "Design",
          slug: "design",
          description: "UI/UX design and brand work",
        },
      }),
    ]);

    console.log(`✅ Created ${teams.length} demo teams\n`);

    // ====================================================================
    // ADD TEAM MEMBERS
    // ====================================================================
    console.log("👫 Adding team members...");

    const teamMembers = await Promise.all([
      // Product Development Team
      prisma.teamMember.upsert({
        where: {
          teamId_userId: { teamId: "team1_demo", userId: "user1_demo" },
        },
        update: {},
        create: {
          id: "tm1_demo",
          teamId: "team1_demo",
          userId: "user1_demo",
          role: "LEADER",
        },
      }),
      prisma.teamMember.upsert({
        where: {
          teamId_userId: { teamId: "team1_demo", userId: "user2_demo" },
        },
        update: {},
        create: {
          id: "tm2_demo",
          teamId: "team1_demo",
          userId: "user2_demo",
          role: "MEMBER",
        },
      }),
      prisma.teamMember.upsert({
        where: {
          teamId_userId: { teamId: "team1_demo", userId: "user3_demo" },
        },
        update: {},
        create: {
          id: "tm3_demo",
          teamId: "team1_demo",
          userId: "user3_demo",
          role: "MEMBER",
        },
      }),
      // Marketing Team
      prisma.teamMember.upsert({
        where: {
          teamId_userId: { teamId: "team2_demo", userId: "user4_demo" },
        },
        update: {},
        create: {
          id: "tm4_demo",
          teamId: "team2_demo",
          userId: "user4_demo",
          role: "LEADER",
        },
      }),
      prisma.teamMember.upsert({
        where: {
          teamId_userId: { teamId: "team2_demo", userId: "user2_demo" },
        },
        update: {},
        create: {
          id: "tm5_demo",
          teamId: "team2_demo",
          userId: "user2_demo",
          role: "MEMBER",
        },
      }),
      // Design Team
      prisma.teamMember.upsert({
        where: {
          teamId_userId: { teamId: "team3_demo", userId: "user5_demo" },
        },
        update: {},
        create: {
          id: "tm6_demo",
          teamId: "team3_demo",
          userId: "user5_demo",
          role: "LEADER",
        },
      }),
      prisma.teamMember.upsert({
        where: {
          teamId_userId: { teamId: "team3_demo", userId: "user1_demo" },
        },
        update: {},
        create: {
          id: "tm7_demo",
          teamId: "team3_demo",
          userId: "user1_demo",
          role: "MEMBER",
        },
      }),
    ]);

    console.log(`✅ Added ${teamMembers.length} team memberships\n`);

    // ====================================================================
    // CREATE DEMO TASKS
    // ====================================================================
    console.log("📋 Creating demo tasks...");

    const now = new Date();
    const tasks = await Promise.all([
      // Product Development Tasks
      prisma.task.upsert({
        where: { id: "task1_demo" },
        update: {},
        create: {
          id: "task1_demo",
          title: "Design user dashboard",
          description: "Create mockups and wireframes for the main dashboard",
          status: "IN_PROGRESS",
          priority: "HIGH",
          dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
          teamId: "team1_demo",
          createdById: "user1_demo",
          assignedToId: "user3_demo",
        },
      }),
      prisma.task.upsert({
        where: { id: "task2_demo" },
        update: {},
        create: {
          id: "task2_demo",
          title: "Implement authentication",
          description: "Set up JWT authentication system",
          status: "DONE",
          priority: "URGENT",
          dueDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
          teamId: "team1_demo",
          createdById: "user1_demo",
          assignedToId: "user2_demo",
          completedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        },
      }),
      prisma.task.upsert({
        where: { id: "task3_demo" },
        update: {},
        create: {
          id: "task3_demo",
          title: "Create API documentation",
          description: "Document all REST endpoints",
          status: "TODO",
          priority: "MEDIUM",
          dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
          teamId: "team1_demo",
          createdById: "user2_demo",
          assignedToId: "user3_demo",
        },
      }),
      prisma.task.upsert({
        where: { id: "task4_demo" },
        update: {},
        create: {
          id: "task4_demo",
          title: "Setup database migration",
          description: "Implement Prisma migrations",
          status: "DONE",
          priority: "HIGH",
          dueDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
          teamId: "team1_demo",
          createdById: "user1_demo",
          assignedToId: "user1_demo",
          completedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        },
      }),
      prisma.task.upsert({
        where: { id: "task5_demo" },
        update: {},
        create: {
          id: "task5_demo",
          title: "Write unit tests",
          description: "Add tests for auth services",
          status: "IN_PROGRESS",
          priority: "MEDIUM",
          dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
          teamId: "team1_demo",
          createdById: "user2_demo",
          assignedToId: "user2_demo",
        },
      }),
      // Marketing Tasks
      prisma.task.upsert({
        where: { id: "task6_demo" },
        update: {},
        create: {
          id: "task6_demo",
          title: "Create social media campaign",
          description: "Plan and design Twitter/LinkedIn content",
          status: "TODO",
          priority: "HIGH",
          dueDate: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
          teamId: "team2_demo",
          createdById: "user4_demo",
          assignedToId: "user4_demo",
        },
      }),
      prisma.task.upsert({
        where: { id: "task7_demo" },
        update: {},
        create: {
          id: "task7_demo",
          title: "Write blog post about features",
          description: "Explain key features in blog",
          status: "IN_PROGRESS",
          priority: "MEDIUM",
          dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
          teamId: "team2_demo",
          createdById: "user4_demo",
          assignedToId: "user2_demo",
        },
      }),
      prisma.task.upsert({
        where: { id: "task8_demo" },
        update: {},
        create: {
          id: "task8_demo",
          title: "Email newsletter",
          description: "Send monthly product updates",
          status: "TODO",
          priority: "LOW",
          dueDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
          teamId: "team2_demo",
          createdById: "user2_demo",
          assignedToId: "user4_demo",
        },
      }),
      // Design Tasks
      prisma.task.upsert({
        where: { id: "task9_demo" },
        update: {},
        create: {
          id: "task9_demo",
          title: "Redesign task cards",
          description: "Improve visual hierarchy",
          status: "IN_PROGRESS",
          priority: "MEDIUM",
          dueDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
          teamId: "team3_demo",
          createdById: "user5_demo",
          assignedToId: "user1_demo",
        },
      }),
      prisma.task.upsert({
        where: { id: "task10_demo" },
        update: {},
        create: {
          id: "task10_demo",
          title: "Create color palette",
          description: "Define primary and accent colors",
          status: "DONE",
          priority: "HIGH",
          dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
          teamId: "team3_demo",
          createdById: "user5_demo",
          assignedToId: "user5_demo",
          completedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        },
      }),
      prisma.task.upsert({
        where: { id: "task11_demo" },
        update: {},
        create: {
          id: "task11_demo",
          title: "Design analytics dashboard",
          description: "Create charts and metrics visualization",
          status: "TODO",
          priority: "MEDIUM",
          dueDate: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
          teamId: "team3_demo",
          createdById: "user1_demo",
          assignedToId: "user5_demo",
        },
      }),
    ]);

    console.log(`✅ Created ${tasks.length} demo tasks\n`);

    // ====================================================================
    // CREATE DEMO ACTIVITY LOGS
    // ====================================================================
    console.log("📊 Creating demo activity logs...");

    const activities = await Promise.all([
      // Task creations
      prisma.activityLog.upsert({
        where: { id: "act1_demo" },
        update: {},
        create: {
          id: "act1_demo",
          action: "task_created",
          details: { title: "Design user dashboard", priority: "HIGH" },
          userId: "user1_demo",
          taskId: "task1_demo",
          teamId: "team1_demo",
        },
      }),
      prisma.activityLog.upsert({
        where: { id: "act2_demo" },
        update: {},
        create: {
          id: "act2_demo",
          action: "task_created",
          details: { title: "Implement authentication", priority: "URGENT" },
          userId: "user1_demo",
          taskId: "task2_demo",
          teamId: "team1_demo",
        },
      }),
      // Status changes
      prisma.activityLog.upsert({
        where: { id: "act4_demo" },
        update: {},
        create: {
          id: "act4_demo",
          action: "status_changed",
          details: { oldStatus: "TODO", newStatus: "IN_PROGRESS" },
          userId: "user2_demo",
          taskId: "task2_demo",
          teamId: "team1_demo",
        },
      }),
      prisma.activityLog.upsert({
        where: { id: "act5_demo" },
        update: {},
        create: {
          id: "act5_demo",
          action: "status_changed",
          details: { oldStatus: "IN_PROGRESS", newStatus: "DONE" },
          userId: "user2_demo",
          taskId: "task2_demo",
          teamId: "team1_demo",
        },
      }),
    ]);

    console.log(`✅ Created ${activities.length} demo activity logs\n`);

    // ====================================================================
    // PRINT SUMMARY
    // ====================================================================
    console.log("✨ Database seeding completed successfully!\n");
    console.log("📊 Summary:");
    console.log(`   • Users: ${users.length}`);
    console.log(`   • Teams: ${teams.length}`);
    console.log(`   • Team Members: ${teamMembers.length}`);
    console.log(`   • Tasks: ${tasks.length}`);
    console.log(`   • Activities: ${activities.length}`);
    console.log("\n🎯 Demo Accounts:");
    console.log("   Email: alice@taskflow.demo | Password: Demo@123");
    console.log("   Email: bob@taskflow.demo | Password: Demo@123");
    console.log("   Email: charlie@taskflow.demo | Password: Demo@123");
    console.log("   Email: diana@taskflow.demo | Password: Demo@123");
    console.log("   Email: eve@taskflow.demo | Password: Demo@123");
    console.log("\n🚀 Ready to start the application!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
