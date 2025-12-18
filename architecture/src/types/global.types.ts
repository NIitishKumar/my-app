// Global TypeScript types
export type ID = string | number;

export interface BaseEntity {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
}

