# Class Management API

A Node.js and Express API for managing educational classes with MongoDB integration.

## Features

- Class CRUD operations
- Student and Lecture references
- Capacity management
- Academic scheduling
- Student enrollment management

## API Endpoints

### Classes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/classes` | Get all classes |
| GET | `/api/classes/:id` | Get class by ID (with populated students and lectures) |
| POST | `/api/classes` | Create new class |
| PUT | `/api/classes/:id` | Update class |
| DELETE | `/api/classes/:id` | Delete class |
| POST | `/api/classes/:id/students` | Add student to class |
| DELETE | `/api/classes/:id/students/:studentId` | Remove student from class |

### Schema Fields

#### Class Schema
- `className` (String, required, unique)
- `subjects` (Array of Strings, required)
- `grade` (String, required)
- `roomNo` (String, required)
- `capacity` (Number, required, 1-200)
- `enrolled` (Number, default 0)
- `students` (Array of ObjectId references to students)
- `classHead` (Object with teacher info)
- `lectures` (Array of ObjectId references to lectures)
- `schedule` (Object with academicYear, semester, dates)
- `isActive` (Boolean, default true)

#### Student Schema
- `firstName` (String, required)
- `lastName` (String, required)
- `email` (String, required, unique)
- `studentId` (String, required, unique)
- `age` (Number, 5-100)
- `gender` (String enum: male, female, other)
- `phone` (String)
- `address` (Object)
- `enrolledAt` (Date, default now)
- `isActive` (Boolean, default true)

#### Lecture Schema
- `title` (String, required)
- `description` (String)
- `subject` (String, required)
- `teacher` (Object with teacher details)
- `schedule` (Object with day, time, room)
- `duration` (Number in minutes, required)
- `type` (String enum: lecture, lab, seminar, tutorial)
- `materials` (Array of material objects)
- `isActive` (Boolean, default true)

## Example Requests

### Create a Class
```bash
POST /api/classes
Content-Type: application/json

{
  "className": "Mathematics 101",
  "subjects": ["Algebra", "Geometry"],
  "grade": "10th Grade",
  "roomNo": "A-101",
  "capacity": 30,
  "enrolled": 0,
  "students": [],
  "classHead": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@school.edu",
    "employeeId": "T001"
  },
  "lectures": [],
  "schedule": {
    "academicYear": "2024-2025",
    "semester": "Fall",
    "startDate": "2024-09-01",
    "endDate": "2024-12-15"
  }
}
```

### Add Student to Class
```bash
POST /api/classes/:classId/students
Content-Type: application/json

{
  "studentId": "60f7b3b3b3b3b3b3b3b3b3b3"
}
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB connection details
   ```

3. Start the server:
   ```bash
   npm start
   ```

## Environment Variables

- `MONGODB_URI` - MongoDB connection string (default: mongodb://localhost:27017)
- `DB_NAME` - Database name (default: testdb)
- `PORT` - Server port (default: 3000)