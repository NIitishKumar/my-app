/**
 * ExamCountdown Component
 * Countdown timer component for upcoming exams
 */

import React, { useState, useEffect } from 'react';

interface ExamCountdownProps {
  examDate: Date | string;
  startTime: string; // HH:mm format
  className?: string;
}

export const ExamCountdown: React.FC<ExamCountdownProps> = ({
  examDate,
  startTime,
  className = '',
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const date = typeof examDate === 'string' ? new Date(examDate) : examDate;
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const examDateTime = new Date(date);
      examDateTime.setHours(startHours, startMinutes, 0, 0);

      const now = new Date();
      const difference = examDateTime.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft(null);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hrs = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours: hrs, minutes: mins, seconds: secs });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [examDate, startTime]);

  if (!timeLeft) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        <i className="fas fa-check-circle text-green-500 mr-2"></i>
        Exam has started or completed
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <i className="fas fa-clock text-indigo-500"></i>
      <span className="text-sm font-medium text-gray-700">Time remaining:</span>
      <div className="flex items-center gap-2">
        {timeLeft.days > 0 && (
          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-semibold">
            {timeLeft.days}d
          </span>
        )}
        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-semibold">
          {String(timeLeft.hours).padStart(2, '0')}h
        </span>
        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-semibold">
          {String(timeLeft.minutes).padStart(2, '0')}m
        </span>
        {timeLeft.days === 0 && (
          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-semibold">
            {String(timeLeft.seconds).padStart(2, '0')}s
          </span>
        )}
      </div>
    </div>
  );
};

