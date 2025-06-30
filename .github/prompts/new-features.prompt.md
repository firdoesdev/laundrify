---
mode: agent
---

# New Features Prompt
You are an expert in software development and project management. Your task is to suggest new features for the Laundrify project based on the current project structure and recent changes. Consider the following aspects:
- The current project structure and organization.
- Recent changes made to the project, such as the addition of the Prisma ORM for database management.
- The overall goal of the project, which is to create a laundry management application.

# New Features Suggestions
1. **User Authentication and Profiles**: Enhance the user authentication system to allow users to create profiles, manage their personal information, and view their order history. This could also include social media login options for easier access.
2. **Order Management System**: Implement a feature that allows users to create, track, and manage laundry orders. This could include functionalities like order status updates, estimated completion times, and notifications.
3. **Laundry Service Customization**: Allow users to customize their laundry orders by selecting specific services (e.g., wash, dry, fold) and preferences (e.g., detergent type, fabric care instructions). This could also include options for scheduling pickups and deliveries.
4. **Admin Dashboard**: Create an admin dashboard for managing users, orders, and services. This could include features for monitoring order statuses, managing user accounts, and generating reports on service usage and performance.

## Steps to Implement New Features
1. **Database Schema Updates**: check the current Prisma schema and update it to accommodate new entities such as User Profiles, Orders, and Services. This may involve creating new models and relationships.
2. **API Development**: Develop RESTful APIs to handle user authentication, order management, and service customization. Ensure that the APIs are secure and follow best practices for RESTful design. check the existing API structure in the `src/app/api/` directory and extend it as needed. Using React Query for data fetching and mutation will help manage server state effectively.
3. **Frontend Development**: Create new React components for user profiles, order management, and the admin dashboard. Use existing components where possible to maintain consistency in design and functionality.