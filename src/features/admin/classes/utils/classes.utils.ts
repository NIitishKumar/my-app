/**
 * Classes Utility Functions
 */

import type { Class } from '../types/classes.types';

/**
 * Format class display name
 */
export const formatClassName = (classItem: Class): string => {
  return `${classItem.name} - Grade ${classItem.grade} Section ${classItem.section}`;
};

/**
 * Sort classes by grade and section
 */
export const sortClasses = (classes: Class[]): Class[] => {
  return [...classes].sort((a, b) => {
    // First sort by grade
    const gradeCompare = parseInt(a.grade) - parseInt(b.grade);
    if (gradeCompare !== 0) return gradeCompare;
    
    // Then sort by section
    return a.section.localeCompare(b.section);
  });
};

/**
 * Filter classes by search term
 */
export const filterClasses = (classes: Class[], searchTerm: string): Class[] => {
  const term = searchTerm.toLowerCase();
  return classes.filter((classItem) =>
    classItem.name.toLowerCase().includes(term) ||
    classItem.grade.includes(term) ||
    classItem.section.toLowerCase().includes(term) ||
    classItem.teacherName?.toLowerCase().includes(term)
  );
};


