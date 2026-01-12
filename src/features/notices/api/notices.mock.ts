/**
 * Mock Data for Notices
 * This will be replaced with actual API calls later
 */

import type { NoticeApiDTO } from '../types/notices.types';

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock notices data
const mockNotices: NoticeApiDTO[] = [
  {
    _id: 'notice-1',
    title: 'Welcome Back to School!',
    description: 'We are excited to welcome all students, teachers, and parents back for the new academic year. Please review the updated school policies and schedules.',
    audience: 'ALL',
    classIds: [],
    priority: 'NORMAL',
    status: 'PUBLISHED',
    publishAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    createdBy: 'admin-1',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'notice-2',
    title: 'Parent-Teacher Meeting Scheduled',
    description: 'The annual parent-teacher meeting will be held on Friday, March 15th from 2:00 PM to 5:00 PM. Please confirm your attendance.',
    audience: 'PARENTS',
    classIds: [],
    priority: 'IMPORTANT',
    status: 'PUBLISHED',
    publishAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    createdBy: 'admin-1',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'notice-3',
    title: 'Mid-Term Examination Schedule',
    description: 'Mid-term examinations will begin on April 1st. Please find the detailed schedule attached. Students are advised to prepare accordingly.',
    audience: 'STUDENTS',
    classIds: ['class-1', 'class-2', 'class-3'],
    priority: 'URGENT',
    status: 'PUBLISHED',
    publishAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days from now
    createdBy: 'admin-1',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'notice-4',
    title: 'Staff Meeting - Curriculum Review',
    description: 'All teaching staff are required to attend the curriculum review meeting on Monday, March 18th at 3:00 PM in the conference room.',
    audience: 'TEACHERS',
    classIds: [],
    priority: 'IMPORTANT',
    status: 'PUBLISHED',
    publishAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    createdBy: 'admin-1',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'notice-5',
    title: 'Sports Day Registration Open',
    description: 'Registration for the annual sports day is now open. Students can register for various events through the school portal until March 20th.',
    audience: 'STUDENTS',
    classIds: ['class-4', 'class-5'],
    priority: 'NORMAL',
    status: 'PUBLISHED',
    publishAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    createdBy: 'admin-1',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'notice-6',
    title: 'Library Hours Extended',
    description: 'The school library will now be open until 6:00 PM on weekdays to accommodate students who need extra study time.',
    audience: 'STUDENTS',
    classIds: [],
    priority: 'NORMAL',
    status: 'PUBLISHED',
    publishAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    createdBy: 'admin-1',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'notice-7',
    title: 'Science Fair - Save the Date',
    description: 'The annual science fair will be held on April 10th. Students are encouraged to start preparing their projects. More details to follow.',
    audience: 'STUDENTS',
    classIds: ['class-1', 'class-2'],
    priority: 'IMPORTANT',
    status: 'SCHEDULED',
    publishAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days from now
    createdBy: 'admin-1',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'notice-8',
    title: 'Holiday Notice - Spring Break',
    description: 'The school will be closed for spring break from April 15th to April 22nd. Classes will resume on April 23rd.',
    audience: 'ALL',
    classIds: [],
    priority: 'NORMAL',
    status: 'PUBLISHED',
    publishAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    createdBy: 'admin-1',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

// Filter mock data based on filters
const filterMockNotices = (
  notices: NoticeApiDTO[],
  filters?: { audience?: string; status?: string; priority?: string }
): NoticeApiDTO[] => {
  let filtered = [...notices];

  if (filters?.audience) {
    filtered = filtered.filter((notice) => notice.audience === filters.audience);
  }

  if (filters?.status) {
    filtered = filtered.filter((notice) => notice.status === filters.status);
  }

  if (filters?.priority) {
    filtered = filtered.filter((notice) => notice.priority === filters.priority);
  }

  return filtered;
};

// Mock API functions
export const mockNoticesApi = {
  getAll: async (filters?: { audience?: string; status?: string; priority?: string }): Promise<NoticeApiDTO[]> => {
    await delay(500); // Simulate API delay
    return filterMockNotices(mockNotices, filters);
  },

  getById: async (id: string): Promise<NoticeApiDTO> => {
    await delay(300);
    const notice = mockNotices.find((n) => n._id === id);
    if (!notice) {
      throw new Error(`Notice with id ${id} not found`);
    }
    return notice;
  },

  create: async (data: any): Promise<NoticeApiDTO> => {
    await delay(400);
    const newNotice: NoticeApiDTO = {
      _id: `notice-${Date.now()}`,
      title: data.title,
      description: data.description,
      audience: data.audience,
      classIds: data.classIds || [],
      priority: data.priority,
      status: data.publishAt && new Date(data.publishAt) > new Date() ? 'SCHEDULED' : 'PUBLISHED',
      publishAt: data.publishAt || new Date().toISOString(),
      expiresAt: data.expiresAt,
      createdBy: 'admin-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockNotices.push(newNotice);
    return newNotice;
  },

  update: async (id: string, data: any): Promise<NoticeApiDTO> => {
    await delay(400);
    const index = mockNotices.findIndex((n) => n._id === id);
    if (index === -1) {
      throw new Error(`Notice with id ${id} not found`);
    }
    const existing = mockNotices[index];
    const updatedNotice: NoticeApiDTO = {
      ...existing,
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.audience !== undefined && { audience: data.audience }),
      ...(data.classIds !== undefined && { classIds: data.classIds }),
      ...(data.priority !== undefined && { priority: data.priority }),
      ...(data.publishAt !== undefined && { publishAt: data.publishAt }),
      ...(data.expiresAt !== undefined && { expiresAt: data.expiresAt }),
      _id: id,
      updatedAt: new Date().toISOString(),
      // Update status based on publishAt
      status: data.publishAt && new Date(data.publishAt) > new Date() ? 'SCHEDULED' : existing.status === 'SCHEDULED' && (!data.publishAt || new Date(data.publishAt) <= new Date()) ? 'PUBLISHED' : existing.status,
    };
    mockNotices[index] = updatedNotice;
    return updatedNotice;
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    const index = mockNotices.findIndex((n) => n._id === id);
    if (index === -1) {
      throw new Error(`Notice with id ${id} not found`);
    }
    mockNotices.splice(index, 1);
  },
};
