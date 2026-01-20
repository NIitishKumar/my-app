# Timetable Module - Backend API Specification

## Overview
This document specifies all required backend APIs, request payloads, and response structures for the Student Timetable Module.

---

## Authentication
All endpoints require authentication token in headers:
```
Authorization: Bearer <token>
```

---

## 1. Get Weekly Timetable

**Endpoint:** `GET /api/student/timetable/week`

**Description:** Returns the weekly timetable for the authenticated student. Week starts on Monday.

**Query Parameters:**
- `weekStart` (optional, string): Date in `YYYY-MM-DD` format. If not provided, returns current week's timetable.

**Example Request:**
```bash
GET /api/student/timetable/week?weekStart=2026-01-13
Authorization: Bearer <token>
```

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "weekStartDate": "2026-01-13T00:00:00.000Z",
    "weekEndDate": "2026-01-19T00:00:00.000Z",
    "days": [
      {
        "day": 1,
        "dayName": "Monday",
        "date": "2026-01-13T00:00:00.000Z",
        "slots": [
          {
            "id": "string",
            "subject": "Mathematics",
            "subjectCode": "MATH101",
            "teacher": {
              "id": "string",
              "name": "Mr. John Smith",
              "email": "john.smith@school.com"
            },
            "startTime": "09:00",
            "endTime": "10:00",
            "dayOfWeek": 1,
            "room": "Room 101",
            "classId": "string",
            "lectureId": "string",
            "type": "lecture"
          }
        ]
      }
    ]
  }
}
```

**Field Descriptions:**
- `weekStartDate`: ISO 8601 date string for Monday of the week
- `weekEndDate`: ISO 8601 date string for Sunday of the week
- `days`: Array of day schedules (Sunday=0 to Saturday=6)
- `day`: Number (0-6), where 0=Sunday, 1=Monday, ..., 6=Saturday
- `dayName`: String, full day name (e.g., "Monday")
- `date`: ISO 8601 date string for the specific date
- `slots`: Array of timetable slots for that day
- `id`: Unique identifier for the timetable slot
- `subject`: Subject name
- `subjectCode`: Optional subject code (e.g., "MATH101")
- `teacher.id`: Teacher ID
- `teacher.name`: Teacher full name
- `teacher.email`: Optional teacher email
- `startTime`: Time in `HH:mm` format (24-hour, e.g., "09:00", "14:30")
- `endTime`: Time in `HH:mm` format (24-hour)
- `dayOfWeek`: Number (0-6), day of week for this slot
- `room`: Room number/name
- `classId`: Optional class ID reference
- `lectureId`: Optional lecture ID reference
- `type`: Optional type: `"lecture"`, `"lab"`, or `"tutorial"`

**Notes:**
- Week always starts on Monday (day=1) and ends on Sunday (day=0)
- Slots should be sorted by `startTime` ascending within each day
- Only include days that have classes (can include empty arrays for days with no classes)
- Filter based on student's enrolled classes/subjects

---

## 2. Get Day Timetable

**Endpoint:** `GET /api/student/timetable/day`

**Description:** Returns timetable for a specific day. Still returns full weekly structure but filtered to the requested day.

**Query Parameters:**
- `date` (required, string): Date in `YYYY-MM-DD` format

**Example Request:**
```bash
GET /api/student/timetable/day?date=2026-01-15
Authorization: Bearer <token>
```

**Response Structure:**
Same as Weekly Timetable endpoint, but only includes the requested day in the `days` array.

**Response:**
```json
{
  "success": true,
  "data": {
    "weekStartDate": "2026-01-13T00:00:00.000Z",
    "weekEndDate": "2026-01-19T00:00:00.000Z",
    "days": [
      {
        "day": 3,
        "dayName": "Wednesday",
        "date": "2026-01-15T00:00:00.000Z",
        "slots": [
          {
            "id": "string",
            "subject": "English",
            "subjectCode": "ENG101",
            "teacher": {
              "id": "string",
              "name": "Mr. David Brown",
              "email": "david.brown@school.com"
            },
            "startTime": "09:00",
            "endTime": "10:00",
            "dayOfWeek": 3,
            "room": "Room 302",
            "classId": "string",
            "lectureId": "string",
            "type": "lecture"
          }
        ]
      }
    ]
  }
}
```

---

## 3. Get Timetable by Date Range

**Endpoint:** `GET /api/student/timetable`

**Description:** Returns timetable for a date range. Useful for getting multiple weeks or custom date ranges.

**Query Parameters:**
- `startDate` (required, string): Start date in `YYYY-MM-DD` format
- `endDate` (required, string): End date in `YYYY-MM-DD` format

**Example Request:**
```bash
GET /api/student/timetable?startDate=2026-01-13&endDate=2026-01-26
Authorization: Bearer <token>
```

**Response Structure:**
Same as Weekly Timetable endpoint, but includes all days within the date range in the `days` array. Multiple weeks can be included.

**Response:**
```json
{
  "success": true,
  "data": {
    "weekStartDate": "2026-01-13T00:00:00.000Z",
    "weekEndDate": "2026-01-26T00:00:00.000Z",
    "days": [
      // All days from startDate to endDate
      // ... (multiple day schedules)
    ]
  }
}
```

**Notes:**
- `weekStartDate` should be the start of the week containing `startDate`
- `weekEndDate` should be the end of the week containing `endDate`
- Include all days in the range, even if they have no classes

---

## Error Responses

All endpoints follow standard error response format:

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
```

**HTTP Status Codes:**
- `200 OK`: Success
- `400 Bad Request`: Invalid query parameters (e.g., invalid date format)
- `401 Unauthorized`: Invalid/missing token
- `403 Forbidden`: Student doesn't have access
- `404 Not Found`: Student not found
- `500 Internal Server Error`: Server error

---

## Data Relationships

### Student Identification
- Get student ID from authenticated JWT token
- Filter timetable based on student's enrolled classes

### Class/Lecture Relationships
- Link timetable slots to student's enrolled classes
- Link to lectures/subjects assigned to those classes
- Include teacher information from lecture/class assignments

### Schedule Calculation
- Calculate week start (Monday) and week end (Sunday) from given date
- Include all days of the week (Sunday-Saturday) even if empty
- Sort slots by `startTime` within each day

---

## Database Schema Requirements

### Required Collections/Tables

1. **Students Collection**
   - Student ID
   - Enrolled classes (array of class IDs)

2. **Classes Collection**
   - Class ID
   - Class name, grade, section
   - Associated subjects

3. **Lectures Collection**
   - Lecture ID
   - Subject
   - Teacher information
   - Schedule (dayOfWeek, startTime, endTime, room)
   - Class ID (reference)
   - Type (lecture/lab/tutorial)

4. **Timetable Slots** (derived from Lectures)
   - Can be computed from Lectures collection
   - Filter by student's enrolled classes
   - Group by day of week

---

## Business Logic

1. **Week Calculation**
   - Week starts on Monday (day=1)
   - Week ends on Sunday (day=0)
   - If no `weekStart` provided, use current week

2. **Slot Filtering**
   - Only include slots for classes the student is enrolled in
   - Filter by active lectures only
   - Exclude cancelled/postponed classes (if applicable)

3. **Time Format**
   - All times in 24-hour format (`HH:mm`)
   - Store in UTC or local timezone (specify in documentation)
   - Convert to ISO 8601 for date fields

4. **Empty Days**
   - Include all days of the week even if no classes
   - Return empty `slots` array for days with no classes

---

## Example cURL Commands

### 1. Get Current Week Timetable
```bash
curl -X GET "http://localhost:3000/api/student/timetable/week" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 2. Get Specific Week Timetable
```bash
curl -X GET "http://localhost:3000/api/student/timetable/week?weekStart=2026-01-13" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Get Day Timetable
```bash
curl -X GET "http://localhost:3000/api/student/timetable/day?date=2026-01-15" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Get Date Range Timetable
```bash
curl -X GET "http://localhost:3000/api/student/timetable?startDate=2026-01-13&endDate=2026-01-26" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Frontend Integration Notes

- Frontend uses mock data by default
- To enable real API, uncomment `timetableService` import in `useTimetable.ts`
- Comment out mock data generation line
- All date handling uses ISO 8601 format
- Times are stored and displayed in `HH:mm` format (24-hour)

---

## Summary

**Required Endpoints:**
1. `GET /api/student/timetable/week` - Weekly timetable
2. `GET /api/student/timetable/day` - Single day timetable
3. `GET /api/student/timetable` - Date range timetable

**Key Features:**
- Week-based navigation (Monday-Sunday)
- Day-by-day schedule breakdown
- Time slot details (subject, teacher, room, time)
- Support for lecture types (lecture/lab/tutorial)
- Flexible date querying

**Data Flow:**
1. Student authenticates → Get student ID from token
2. Query student's enrolled classes
3. Get lectures/classes for those classes
4. Filter by day of week and date range
5. Format as weekly timetable structure
6. Return to frontend

All endpoints are ready for frontend integration!

