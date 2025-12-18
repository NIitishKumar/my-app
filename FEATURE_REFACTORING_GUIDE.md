# Feature Refactoring Guide

## Completed
- ✅ **admin/classes/** - Full implementation with all files

## In Progress

### Admin Feature Sub-features
1. **teachers/** (15 files needed)
2. **lectures/** (15 files needed)

### Teacher Feature Sub-features  
3. **attendance/** (15 files needed)
4. **queries/** (15 files needed)

### Student Feature Sub-features
5. **exams/** (15 files needed)
6. **notifications/** (15 files needed)
7. **records/** (15 files needed)

### Parent Feature Sub-features
8. **children/** (15 files needed)
9. **attendance/** (15 files needed)
10. **records/** (15 files needed)
11. **queries/** (15 files needed)

### Auth Feature
12. **login/** (restructure existing)

## File Template for Each Sub-feature

```
feature-name/sub-feature/
├── types/sub-feature.types.ts
├── constants/sub-feature.constants.ts
├── api/
│   ├── sub-feature.endpoints.ts
│   └── sub-feature.api.ts
├── hooks/
│   ├── useSubFeatureList.ts
│   ├── useSubFeatureDetails.ts
│   ├── useCreateSubFeature.ts
│   ├── useUpdateSubFeature.ts
│   └── useDeleteSubFeature.ts
├── components/
│   ├── SubFeatureTable.tsx
│   └── SubFeatureForm.tsx
├── pages/
│   └── SubFeaturePage.tsx
├── utils/
│   └── sub-feature.utils.ts
├── index.ts
└── README.md
```

## Quick Reference: admin/classes (Template)

This serves as the reference implementation. Copy this pattern for all other sub-features.

### Key Points
1. **Types**: Domain models + DTOs in same file
2. **API**: Mapper functions inline, clean service exports
3. **Hooks**: One hook per operation (GET list, GET detail, POST, PUT, DELETE)
4. **Components**: Table + Form minimum
5. **Constants**: Query keys + enums/options
6. **Utils**: Helper functions for formatting, filtering, sorting
7. **Index**: Export everything public
8. **README**: Document structure and usage

## Migration Strategy

### Phase 1: Create New Structure (CURRENT)
- Create new sub-feature folders
- Implement with new architecture
- Keep old files intact

### Phase 2: Update Imports
- Update route files
- Update layout files  
- Update any cross-feature references

### Phase 3: Cleanup
- Delete old monolithic files
- Verify no broken imports

### Phase 4: Verify
- Run build
- Fix any TypeScript errors
- Test application

## Automated Generation Script

Given the repetitive nature, I'll provide you a template-based approach for the remaining sub-features:

### For each sub-feature, you need to:
1. Define domain model and DTO
2. Create API endpoints
3. Create API service with mappers
4. Create 5 hooks (list, details, create, update, delete)
5. Create Table and Form components
6. Create main Page component
7. Add constants and utils
8. Create index.ts and README.md

## Estimated Effort
- ~15 files × 11 remaining sub-features = **165 files**
- With the classes/ template complete, each additional sub-feature should take ~15 minutes

## Recommendation
Since this is a massive refactoring affecting the entire codebase, I recommend:

1. **Complete one role at a time** (Admin → Teacher → Student → Parent → Auth)
2. **Test after each role** to catch issues early
3. **Update routes progressively** as features are migrated

Would you like me to:
A) Continue creating all sub-features systematically (will take significant time)
B) Create a code generator script to automate this
C) Complete just the admin feature fully, then provide templates for the rest


