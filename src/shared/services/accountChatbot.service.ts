/**
 * Account Chatbot Service
 * Rule-based chatbot service for answering questions about user account details
 */

import type { User } from '../../store/types';

/**
 * Check if query matches any of the keywords
 */
const matchKeywords = (query: string, keywords: string[]): boolean => {
  const lowerQuery = query.toLowerCase().trim();
  return keywords.some((keyword) => lowerQuery.includes(keyword.toLowerCase()));
};

/**
 * Format profile information as a readable string
 */
const formatProfileInfo = (user: User): string => {
  const parts: string[] = [];

  if (user.name || user.firstName || user.lastName) {
    const fullName = user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.name;
    parts.push(`Name: ${fullName}`);
  }

  if (user.email) {
    parts.push(`Email: ${user.email}`);
  }

  if (user.role) {
    parts.push(`Role: ${user.role}`);
  }

  if (user.employeeId) {
    parts.push(`Employee ID: ${user.employeeId}`);
  }

  if (user.department) {
    parts.push(`Department: ${user.department}`);
  }

  return parts.length > 0 ? parts.join('\n') : 'Profile information not available.';
};

/**
 * Get response based on user query
 */
export const getChatbotResponse = (
  userQuery: string,
  user: User | null
): string => {
  if (!user) {
    return "I'm not able to access your account information. Please make sure you're logged in.";
  }

  const query = userQuery.trim().toLowerCase();

  // Help/Commands
  if (matchKeywords(query, ['help', 'what can you do', 'commands', 'what do you know', 'options'])) {
    return `I can help you with information about your account! You can ask me about:
• Your name, email, or role
• Your profile information
• Your employee/student ID
• Your department or other account details

Try asking: "What's my name?" or "Show my profile"`;
  }

  // Name queries
  if (matchKeywords(query, ['name', 'what is my name', 'who am i', 'my name'])) {
    const fullName = user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.name;
    return `Your name is ${fullName}.`;
  }

  // Email queries
  if (matchKeywords(query, ['email', 'my email', 'email address', 'what is my email'])) {
    return `Your email is ${user.email}.`;
  }

  // Role queries
  if (matchKeywords(query, ['role', 'my role', 'what is my role', 'user role', 'account type'])) {
    return `You are logged in as ${user.role}.`;
  }

  // Employee ID queries
  if (matchKeywords(query, ['employee id', 'employee id number', 'emp id', 'employee number'])) {
    if (user.employeeId) {
      return `Your Employee ID is ${user.employeeId}.`;
    }
    return "Employee ID is not available in your profile.";
  }

  // Department queries
  if (matchKeywords(query, ['department', 'my department', 'what department'])) {
    if (user.department) {
      return `Your department is ${user.department}.`;
    }
    return "Department information is not available in your profile.";
  }

  // Profile/Account queries
  if (matchKeywords(query, ['profile', 'my profile', 'account', 'my account', 'account details', 'show profile', 'full profile'])) {
    return formatProfileInfo(user);
  }

  // Greetings
  if (matchKeywords(query, ['hello', 'hi', 'hey', 'greetings'])) {
    return `Hello ${user.name}! I'm here to help you with information about your account. What would you like to know?`;
  }

  // Default response
  return `I can only discuss your account details. Try asking about your profile, name, email, role, or other account information. Type "help" to see what I can help you with.`;
};

