# Admin Subjects Feature

Manages subject records in the admin panel. Subjects can be created, viewed, and linked to classes. Each subject includes details like name, price, author, and description.

## Structure

```
subjects/
├── pages/          - SubjectsPage (main page), SubjectDetailsPage
├── components/     - SubjectTable, SubjectForm, SubjectSidebar
├── hooks/          - useSubjects, useSubject, useCreateSubject, useUpdateSubject, useDeleteSubject
├── api/            - subjects.api.ts, subjects.endpoints.ts, subjects.mapper.ts
├── types/          - Domain models and DTOs
├── constants/      - Query keys, validation constants
├── utils/          - Utility functions
└── index.ts        - Public exports
```

## Usage

```tsx
import { SubjectsPage, useSubjects, Subject } from '@/features/admin/subjects';

// Use in routing
<Route path="/admin/subjects" element={<SubjectsPage />} />

// Use hooks in components
const { data: subjects, isLoading } = useSubjects();
const createSubject = useCreateSubject();
```

## API Endpoints

- GET `/admin/subjects` - List all subjects
- GET `/admin/subjects/:id` - Get subject details
- POST `/admin/subjects` - Create new subject
- PUT `/admin/subjects/:id` - Update subject
- DELETE `/admin/subjects/:id` - Delete subject

## Form Fields

### Required Fields
- Name (2-100 characters)
- Author (2-100 characters)
- Price (0-999999.99)
- Classes (at least one class must be selected)

### Optional Fields
- Description (max 1000 characters)
- Active status (checkbox, defaults to true)

## Features

1. **Class Integration**: 
   - Subjects are linked to one or more classes
   - Multi-select dropdown in form to select classes
   - Display associated classes in table and details view

2. **Sidebar Layout**:
   - Left sidebar for navigation and filtering
   - Main content area for table/form
   - Responsive: sidebar collapses on mobile

3. **Search & Filter**:
   - Search by name, author, or description
   - Filter by class
   - Filter by status (active/inactive)
   - Real-time filtering

4. **CRUD Operations**:
   - Create: Form with class selection
   - Read: Table view and detail view
   - Update: Edit form pre-populated with data
   - Delete: Confirmation dialog before deletion

## Validation

- Name format validation (2-100 characters)
- Author format validation (2-100 characters)
- Price range validation (0-999999.99)
- Description length validation (max 1000 characters)
- At least one class must be selected
- Real-time validation with visual feedback

## Dependencies

- Uses `useClasses()` hook from `@/features/admin/classes` to fetch classes for selection
- Uses existing `httpClient` from `@/services/http/httpClient`
- Uses React Query for data fetching and caching
- Uses Formik + Yup for form validation

