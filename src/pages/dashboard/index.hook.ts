import React from "react";
import { useNavigate } from "react-router-dom";
import type { quickActions } from "./index.constant";
import { useDashboardStats } from "./useDashboardQueries";
import { formatDateShort, formatRelativeTime, formatTimeRange } from "../../utils/helper";

export const useDashboard = () => {

    const { data: dashboardStats, isLoading: isLoadingStats, error: statsError } = useDashboardStats();


    const navigate = useNavigate()
    const handleQuickActionClick = (action: typeof quickActions[0]) => {
        if (action.openForm) {
            navigate(action.route, { state: { openForm: true } });
        } else {
            navigate(action.route);
        }
    };

    const recentActivities = dashboardStats ? [
        ...dashboardStats.students.recent.slice(0, 3).map((student) => ({
            title: 'New student enrolled',
            description: `${student.firstName} ${student.lastName} joined ${student.grade}`,
            time: formatRelativeTime(student?.createdAt),
            icon: 'fa-user-plus',
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600',
        })),
        ...dashboardStats.classes.recent.slice(0, 2).map((classItem) => ({
            title: 'New class created',
            description: `${classItem.className} - ${classItem.grade}`,
            time: formatRelativeTime(classItem?.createdAt),
            icon: 'fa-chalkboard',
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600',
        })),
    ].slice(0, 5) : [];


    // Build upcoming events from lectures data
    const upcomingEvents = dashboardStats?.lectures.upcoming
        .filter((lecture) => lecture.schedule && lecture.schedule.dayOfWeek) // Filter out lectures without schedule
        .slice(0, 4)
        .map((lecture, index) => {
            const gradients = [
                'from-indigo-500 to-indigo-600',
                'from-purple-500 to-purple-600',
                'from-green-500 to-green-600',
                'from-orange-500 to-orange-600',
            ];

            // Get next occurrence of the day of week
            const today = new Date();
            const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const targetDay = dayOfWeek.indexOf(lecture?.schedule?.dayOfWeek || '');
            const currentDay = today.getDay();
            let daysUntil = (targetDay - currentDay + 7) % 7;
            if (daysUntil === 0) daysUntil = 7; // Next week if today
            const eventDate = new Date(today);
            eventDate.setDate(today.getDate() + daysUntil);
            const dateInfo = formatDateShort(eventDate);

            return {
                date: dateInfo.date,
                month: dateInfo.month,
                title: lecture.title,
                time: formatTimeRange(lecture?.schedule?.startTime || '', lecture?.schedule?.endTime || ''),
                location: lecture?.schedule?.room || 'TBD',
                gradient: gradients[index % gradients.length],
            };
        }) || [];

    return { handleQuickActionClick, recentActivities, statsError, isLoadingStats, upcomingEvents };
};