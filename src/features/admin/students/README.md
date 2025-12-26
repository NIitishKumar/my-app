# Admin Students Feature

Manages student records in the admin panel.

## Structure

```
students/
├── pages/          - StudentsPage (main page)
├── components/     - StudentTable, StudentForm
├── hooks/          - useStudents, useCreateStudent, useUpdateStudent, useDeleteStudent, useStudentDetails
├── api/            - students.api.ts, students.endpoints.ts
├── types/          - Domain models and DTOs
├── constants/      - Query keys, gender options, validation constants
├── utils/          - Utility functions
└── index.ts        - Public exports
```

## Usage

```tsx
import { StudentsPage, useStudents, Student } from '@/features/admin/students';

// Use in routing
<Route path="/admin/students" element={<StudentsPage />} />

// Use hooks in components
const { data: students, isLoading } = useStudents();
const createStudent = useCreateStudent();
```

## API Endpoints

- GET `/admin/students` - List all students
- GET `/admin/students/:id` - Get student details
- POST `/admin/students` - Create new student
- PUT `/admin/students/:id` - Update student
- DELETE `/admin/students/:id` - Delete student

## Form Fields

### Required Fields
- First Name
- Last Name
- Email (unique)
- Student ID (unique)
- Enrolled At (date)
- Status (Active/Inactive)

### Optional Fields
- Age (5-100)
- Gender (male, female, other)
- Phone
- Address (street, city, state, zipCode)

## Validation

- Email format validation
- Student ID uniqueness check
- Age range validation (5-100)
- Phone format validation
- Real-time validation with visual feedback

