# Implementation Guide

## 🚀 How to Use This Architecture

### Step 1: Review the Architecture

1. **Start with** `README.md` - Overview
2. **Read** `ARCHITECTURE_DESIGN.md` - Principles and patterns
3. **Study** `COMPLETE_ARCHITECTURE_TREE.md` - Full structure

### Step 2: Understand the Patterns

#### Pattern A: Large Feature WITH Sub-features
**Use when**: Feature has multiple screens/flows (list, create, edit, etc.)

**Example**: `features/admin/`
- Has sub-features: dashboard, classes, teachers, students
- Each sub-feature has its own page, hook, components
- Feature-level hooks for API calls
- Demonstrates component colocation

#### Pattern B: Medium Feature WITH Sub-features
**Use when**: Feature has distinct flows but simpler structure

**Example**: `features/auth/`
- Has sub-features: login, register, forgot-password
- Simpler structure than admin
- Feature-level hooks for API
- No deeply nested components

### Step 3: Implement Your Features

#### Adding a New Sub-feature

1. **Create folder structure**:
```
features/my-feature/my-sub-feature/
├── index.tsx           # Main page component
├── index.hook.ts       # Page logic
├── index.form.ts       # Form config (optional)
├── index.skeleton.tsx  # Loading state (optional)
└── components/         # Large components only
    └── LargeComponent/
        ├── LargeComponent.tsx
        ├── LargeComponent.hook.ts
        ├── LargeComponent.types.ts
        └── index.ts
```

2. **Add API hooks**:
```typescript
// features/my-feature/hooks/useMyData.ts
import { useQuery } from '@tanstack/react-query';

export function useMyData() {
  return useQuery({
    queryKey: ['my-feature', 'data'],
    queryFn: async () => {
      // API call here
      return data;
    },
  });
}
```

3. **Export from feature index**:
```typescript
// features/my-feature/index.ts
export { MySubFeaturePage } from './my-sub-feature';
export * from './hooks/useMyData';
export * from './my-feature.types';
```

### Step 4: When to Create Component Folders

#### ✅ CREATE folder when component:
- Has 100+ lines of code
- Has complex UI logic
- Has its own types
- Needs a dedicated hook
- Will be reused within feature

#### ❌ DON'T CREATE folder when component:
- Is simple (< 50 lines)
- Has no logic
- No custom types needed
- Won't be reused

**Example of large component structure**:
```
components/ClassTable/
├── ClassTable.tsx       # Component UI
├── ClassTable.hook.ts   # UI logic (sorting, selection, etc.)
├── ClassTable.types.ts  # Component prop types
└── index.ts             # Exports
```

### Step 5: Hook Guidelines

#### Component Hooks (UI Logic Only)
```typescript
// ✅ Good: UI logic
export function useClassTable(data: Class[]) {
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const sortedData = useMemo(() => {
    return data.sort(/*...*/);
  }, [data, sortOrder]);
  
  return { sortedData, sortOrder, setSortOrder, selectedIds };
}
```

```typescript
// ❌ Bad: API logic in component hook
export function useClassTable() {
  // DON'T DO THIS
  const { data } = useQuery('/api/classes');
  return data;
}
```

#### Feature Hooks (API Logic)
```typescript
// ✅ Good: API logic in feature hooks
export function useClassList() {
  return useQuery({
    queryKey: ['classes', 'list'],
    queryFn: async () => {
      const response = await axios.get('/api/classes');
      return response.data;
    },
  });
}
```

### Step 6: Import Strategy

#### ✅ Good Imports
```typescript
// Import from feature index
import { ClassesPage, useClassList } from '@/features/admin';

// Import specific component
import { ClassTable } from '@/features/admin/classes/components/ClassTable';

// Import from shared
import { Button, Modal } from '@/components/common';
```

#### ❌ Bad Imports
```typescript
// DON'T: Deep import
import { ClassTable } from '@/features/admin/classes/components/ClassTable/ClassTable';

// DON'T: Relative import from outside feature
import { useClassList } from '../../../../../../features/admin/hooks/useClassList';
```

### Step 7: TypeScript Best Practices

#### Feature Types
```typescript
// features/admin/admin.types.ts
export interface Class {
  id: string;
  name: string;
  grade: number;
}

export interface CreateClassDTO {
  name: string;
  grade: number;
}
```

#### Component Types
```typescript
// components/ClassTable/ClassTable.types.ts
export interface ClassTableProps {
  data: Class[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}
```

### Step 8: File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Component | PascalCase.tsx | `ClassTable.tsx` |
| Hook | camelCase.ts | `useClassList.ts` |
| Types | *.types.ts | `admin.types.ts` |
| Constants | *.constants.ts | `routes.constants.ts` |
| Utils | *.utils.ts | `date.utils.ts` |
| Config | *.config.ts | `app.config.ts` |

### Step 9: Common Mistakes to Avoid

1. **❌ Creating component folders for simple components**
   - Only create folders for large, complex components

2. **❌ Putting API logic in component hooks**
   - API logic belongs in feature `hooks/` folder

3. **❌ Deep nesting**
   - Max 3-4 levels: feature → sub-feature → components → component folder

4. **❌ Missing index.ts exports**
   - Every folder needs an `index.ts` for clean imports

5. **❌ Mixing concerns**
   - Keep API, UI logic, and presentation separated

### Step 10: Testing Strategy

#### Test Structure
```
features/admin/__tests__/
├── hooks/
│   └── useClassList.test.ts      # Test API hook
├── classes/
│   └── ClassesPage.test.tsx       # Test page
└── components/
    └── ClassTable.test.tsx        # Test component
```

## 🎯 Quick Reference

### When to use which pattern?

| Scenario | Pattern | Example |
|----------|---------|---------|
| Multiple CRUD screens | Large with sub-features | admin/ |
| Auth flows | Medium with sub-features | auth/ |
| Single screen feature | Without sub-features | notifications/ |
| Shared UI | components/common/ | Button, Modal |

### Folder Decision Tree

```
Is it a business feature?
├─ Yes → Put in features/
│  │
│  └─ Does it have multiple screens?
│     ├─ Yes → Create sub-features
│     └─ No → Simple feature (pages/ + hooks/)
│
└─ No → Is it shared UI?
   ├─ Yes → Put in components/
   └─ No → utilities/, hooks/, or services/
```

## 📚 Resources

- **React Query**: https://tanstack.com/query
- **Feature-Sliced Design**: https://feature-sliced.design/
- **React Best Practices**: https://react.dev

## ✅ Checklist for New Features

- [ ] Created feature folder in `features/`
- [ ] Added feature types file
- [ ] Added feature constants
- [ ] Created sub-features (if applicable)
- [ ] Added API hooks in `hooks/` folder
- [ ] Large components have dedicated folders
- [ ] All folders have `index.ts`
- [ ] Exported from feature `index.ts`
- [ ] No API calls in component hooks
- [ ] Imports use feature index
- [ ] Types are properly defined

## 🎓 Learning Path

1. **Day 1**: Study the structure
2. **Day 2**: Implement one simple feature (notifications)
3. **Day 3**: Implement one complex feature (teacher)
4. **Day 4**: Refactor and optimize
5. **Day 5**: Add tests

## 💡 Pro Tips

1. **Start simple** - Begin with small features, grow complexity
2. **Copy patterns** - Use admin/ and auth/ as templates
3. **Think in features** - Group by business domain, not file type
4. **Collocate wisely** - Put things together that change together
5. **Export intentionally** - Only export what's needed publicly

---

**Happy Coding!** 🚀

This architecture is designed for scalability and maintainability. Follow the patterns, and your codebase will remain clean and organized even as it grows.

