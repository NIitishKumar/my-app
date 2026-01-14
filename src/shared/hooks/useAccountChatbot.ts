/**
 * useAccountChatbot Hook
 * React hook for chatbot state management and message handling
 */

import { useState, useCallback } from 'react';
import { useAuthStore, selectUser } from '../../store';
import { getChatbotResponse } from '../services/accountChatbot.service';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const useAccountChatbot = () => {
  const user = useAuthStore(selectUser);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Initialize with welcome message
    const welcomeMessage: ChatMessage = {
      id: `welcome-${Date.now()}`,
      text: user
        ? `Hello ${user.name}! I'm here to help you with information about your account. What would you like to know?`
        : "Hello! I'm here to help you with information about your account.",
      sender: 'bot',
      timestamp: new Date(),
    };
    return [welcomeMessage];
  });
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;

      // Add user message
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}-${Math.random()}`,
        text: text.trim(),
        sender: 'user',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Get bot response
      const botResponseText = getChatbotResponse(text, user);
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}-${Math.random()}`,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
      };

      // Add bot response after a small delay for better UX
      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage]);
      }, 300);
    },
    [user]
  );

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const clearMessages = useCallback(() => {
    const welcomeMessage: ChatMessage = {
      id: `welcome-${Date.now()}`,
      text: user
        ? `Hello ${user.name}! I'm here to help you with information about your account. What would you like to know?`
        : "Hello! I'm here to help you with information about your account.",
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [user]);

  return {
    messages,
    isOpen,
    sendMessage,
    toggleChat,
    closeChat,
    clearMessages,
  };
};

