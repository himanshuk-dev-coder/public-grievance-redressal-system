# Public Grievance Redressal System (PGRS)

A full-stack Web-based **Public Grievance Redressal System (PGRS)** designed to provide citizens with a structured platform to submit, track, and manage public grievances while enabling government officers and administrators to efficiently process, assign, monitor, and resolve complaints.

> **Academic Project | Group Project | MERN Stack**

---

## 📌 Overview

The Public Grievance Redressal System is a role-based grievance management platform developed as a **Group Project**.

The system connects citizens with the concerned departments through a centralized digital platform. Citizens can raise complaints, attach supporting documents or images, track complaint status, and provide feedback. Officers can manage assigned complaints and update their progress, while administrators manage officers, departments, complaints, and system-level operations.

The project focuses on:

- Digital grievance registration
- Complaint tracking and status management
- Role-Based Access Control (RBAC)
- Department and ministry-based complaint routing
- Officer assignment and management
- Location-based complaint information
- Citizen feedback and ratings

---

## ✨ Key Features

### 👤 Citizen Module

- User registration and login
- Email verification
- Google OAuth authentication
- Secure authentication using access and refresh tokens
- User profile management
- Change password
- Forgot/reset password functionality
- Raise a new complaint
- Upload supporting files/images
- Capture geographical location
- Generate and track complaint ID
- View complaint details and status
- Track complaint progress through status timeline
- Submit feedback and ratings
- Contact administration

### 👨‍💼 Officer Module

- Secure officer authentication
- Role-based dashboard
- View assigned complaints
- View detailed complaint information
- Update complaint status
- Process and manage complaints
- Work with complaints routed to the respective department
- Access relevant citizen and complaint information

### 🛡️ Admin Module

- Admin dashboard
- Manage officers
- Manage ministries and departments
- View and manage complaints
- View complaint details
- Manage contacts and feedback
- Role and permission management
- Complaint assignment/routing
- Monitor complaint processing
- Administrative access through RBAC

---

## 🔐 Authentication & Authorization

The application implements secure authentication and authorization mechanisms.

### Authentication

- JWT-based authentication
- Access Token
- Refresh Token
- Cookie-based authentication
- Password reset functionality
- Google OAuth integration

### Authorization

The application uses **Role-Based Access Control (RBAC)** with three primary roles:

```text
Citizen
   │
   ├── Raise Complaint
   ├── Track Complaint
   └── Submit Feedback

Officer
   │
   ├── View Assigned Complaints
   ├── Process Complaints
   └── Update Complaint Status

Admin
   │
   ├── Manage Officers
   ├── Manage Departments
   ├── Manage Complaints
   └── Administrative Operations
