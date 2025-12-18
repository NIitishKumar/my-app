# School Management System - Architecture Design

## 🏗️ Architecture Overview

This is a feature-first, scalable architecture designed for a large React + TypeScript application.

### Key Principles
1. **Feature-First**: Business logic organized by domain features
2. **Self-Contained Modules**: Each feature is independent with its own hooks, types, and components
3. **Component Colocation**: Large components have dedicated folders with hooks and types
4. **API Separation**: API/service logic lives in feature hooks, not components
5. **Controlled Exports**: Every folder has index.ts for clean imports

### Root Structure
```
src/
├── App.tsx                    # Root component with providers
├── main.tsx                   # Entry point
├── index.css                  # Global styles
├── assets/                    # Static files
├── components/                # Shared UI components
├── config/                    # Configuration
├── constants/                 # Global constants
├── data/                      # Mock/seed data
├── features/                  # Business modules (main work here)
├── hooks/                     # Global hooks
├── routes/                    # Routing configuration
├── services/                  # API infrastructure
├── store/                     # Global state
├── styles/                    # Theme and global styles
├── types/                     # Global TypeScript types
└── utils/                     # Utility functions
```

### Feature Modules

#### Large Features (with sub-features)
- admin/ - Admin management features
- teacher/ - Teacher portal features
- student/ - Student portal features
- parent/ - Parent portal features

#### Medium Features (single-level)
- auth/ - Authentication flows
- notifications/ - Notification system
- profile/ - User profile management
- settings/ - Application settings

### File Naming Conventions
- Components: `PascalCase.tsx`
- Hooks: `camelCase.ts` or `use*.ts`
- Types: `*.types.ts`
- Constants: `*.constants.ts`
- Services: `*.service.ts`
- Store: `*.slice.ts` (Redux) or `*.store.ts` (Zustand)

### Import Strategy
```typescript
// ✅ Good - From feature index
import { ClassList, useClasses } from '@/features/admin/classes';

// ❌ Bad - Deep import
import { ClassList } from '@/features/admin/classes/list/components/ClassList';
```

## Generated Structure
See generated folder structure below...

