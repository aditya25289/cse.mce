# Project Team Registration

A web application for registering students for a project team, with form validation and MySQL database storage.

## Setup
1. Install Node.js and MySQL.
2. Create a MySQL database named `project_team` and set up the `registrations` table (see SQL below).
3. Install dependencies: `npm install`.
4. Configure environment variables in `.env` (copy `.env.example` and update credentials).
5. Run the server: `npm start`.
6. Access the form at `http://localhost:3000`.

## Database Schema
```sql
CREATE DATABASE project_team;
USE project_team;

CREATE TABLE registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    roll VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    year VARCHAR(50) NOT NULL,
    semester VARCHAR(50) NOT NULL,
    branch VARCHAR(255) NOT NULL,
    other_branch VARCHAR(255),
    languages JSON,
    other_language VARCHAR(255),
    proficiency INT,
    area VARCHAR(255),
    experience TEXT,
    hours VARCHAR(50),
    learn VARCHAR(10),
    reason TEXT,
    confirm BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);