# Notices Feature

Manages notices (announcements) in the admin and teacher panels with offline support.

## Structure

```
notices/
├── pages/          - NoticesListPage, CreateNoticePage
├── components/     - NoticeForm, NoticePreview, NoticeTable, ClassSelector
├── hooks/          - useNotices, useNoticeDetails, useCreateNotice, useUpdateNotice, useDeleteNotice, useNoticeDraft
├── api/            - notices.api.ts, notices.endpoints.ts
├── types/          - Domain models and DTOs
├── constants/      - Query keys, enums, options
├── utils/          - Validation, formatting helpers
└── index.ts        - Public exports
```

## Usage

```tsx
import { NoticesListPage, CreateNoticePage, useNotices, useCreateNotice } from '@/features/notices';

// Use in routing
<Route path="/admin/notices" element={<NoticesListPage />} />
<Route path="/admin/notices/create" element={<CreateNoticePage />} />

// Use hooks in components
const { data: notices, isLoading } = useNotices();
const createNotice = useCreateNotice();
```

## Features

- Create, edit, and delete notices
- Target specific audiences (All, Teachers, Students, Parents)
- Schedule notices for future publishing
- Priority levels (Normal, Important, Urgent)
- Class-specific targeting
- Offline support with draft saving
- Auto-sync drafts when coming online
- PWA-ready

## API Endpoints

- GET `/admin/notices` - List all notices (with filters)
- GET `/admin/notices/:id` - Get notice details
- POST `/admin/notices` - Create new notice
- PUT `/admin/notices/:id` - Update notice
- DELETE `/admin/notices/:id` - Delete notice

## Offline Support

When offline:
- "Publish" button is disabled
- "Save Draft" button is always enabled
- Drafts are saved to Zustand store (persisted to localStorage)
- Drafts automatically sync when coming back online
