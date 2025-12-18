# Admin Classes Feature

Manages school classes (grade-section combinations) in the admin panel.

## Structure

```
classes/
├── pages/          - ClassesPage (main page)
├── components/     - ClassTable, ClassForm
├── hooks/          - useClasses, useCreateClass, useUpdateClass, useDeleteClass, useClassDetails
├── api/            - classes.api.ts, classes.endpoints.ts
├── types/          - Domain models and DTOs
├── constants/      - Query keys, grade/section options
├── utils/          - Utility functions
└── index.ts        - Public exports
```

## Usage

```tsx
import { ClassesPage, useClasses, Class } from '@/features/admin/classes';

// Use in routing
<Route path="/admin/classes" element={<ClassesPage />} />

// Use hooks in components
const { data: classes, isLoading } = useClasses();
const createClass = useCreateClass();
```

## API Endpoints

- GET `/admin/classes` - List all classes
- GET `/admin/classes/:id` - Get class details
- POST `/admin/classes` - Create new class
- PUT `/admin/classes/:id` - Update class
- DELETE `/admin/classes/:id` - Delete class


