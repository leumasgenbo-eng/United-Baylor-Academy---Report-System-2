# Supabase Integration Guide

This guide explains how to use the Supabase integration in this project.

## Files Created

### Core Files
1. **`src/lib/supabase.ts`** - Main Supabase client setup
2. **`src/services/studentService.ts`** - Student-related database operations
3. **`src/services/globalSettingsService.ts`** - Global settings management
4. **`src/components/StudentListExample.tsx`** - Example: Student list with CRUD operations
5. **`src/components/GlobalSettingsExample.tsx`** - Example: Global settings editor
6. **`.env.local.example`** - Environment variables template

## Setup Instructions

### 1. Install Supabase Client
The dependency has been added to `package.json`. Run:
```bash
npm install
```

### 2. Create Supabase Project
- Go to https://supabase.com
- Create a new project
- Wait for initialization

### 3. Create Database Tables
- In Supabase Dashboard, go to **SQL Editor**
- Copy all content from `schema.sql`
- Paste into SQL Editor and execute
- Tables will be created

### 4. Get Credentials
- Go to **Project Settings** → **API**
- Copy:
  - **Project URL** (starts with `https://`)
  - **Anon Public Key** (your API key)

### 5. Set Environment Variables
Create `.env.local` file (copy from `.env.local.example`):
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 6. Run Development Server
```bash
npm run dev
```

## Usage Examples

### Fetching Data
```typescript
import { fetchStudents } from './services/studentService'

const students = await fetchStudents('Junior High School', 'JHS 1')
```

### Creating Records
```typescript
import { createStudent } from './services/studentService'

const newStudent = await createStudent({
  name: 'John Doe',
  department: 'Junior High School',
  class_name: 'JHS 1'
})
```

### Updating Records
```typescript
import { updateStudent } from './services/studentService'

await updateStudent(studentId, {
  overall_remark: 'Excellent performance'
})
```

### Deleting Records
```typescript
import { deleteStudent } from './services/studentService'

await deleteStudent(studentId)
```

### Global Settings
```typescript
import { fetchGlobalSettings, updateGlobalSettings } from './services/globalSettingsService'

// Get settings
const settings = await fetchGlobalSettings()

// Update settings
await updateGlobalSettings({
  school_name: 'New School Name',
  academic_year: '2024/2025'
})
```

## Service Functions Reference

### Student Service (`src/services/studentService.ts`)
- `fetchStudents(department?, className?)` - Get all students with optional filters
- `fetchStudentWithScores(studentId)` - Get student with all scores
- `createStudent(studentData)` - Create new student
- `updateStudent(studentId, updates)` - Update student information
- `deleteStudent(studentId)` - Delete student
- `upsertStudentScore(studentId, subject, score, totalScore?)` - Create/update score
- `fetchStudentsByClass(department, className)` - Get students by class
- `searchStudents(searchTerm)` - Search students by name

### Global Settings Service (`src/services/globalSettingsService.ts`)
- `fetchGlobalSettings()` - Get school settings
- `updateGlobalSettings(updates)` - Update settings
- `updateSchoolName(schoolName)` - Update school name
- `updateExamDetails(examTitle, mockSeries)` - Update exam info
- `updateAcademicYear(year)` - Update academic year
- `updateTermDates(startDate, endDate, nextTermBegin)` - Update dates

## Component Examples

### StudentListExample
Shows how to:
- Fetch students from database
- Filter by department and class
- Update student remarks inline
- Delete students
- Handle loading and error states

### GlobalSettingsExample
Shows how to:
- Load global settings
- Edit form with multiple fields
- Save changes to database
- Display last updated timestamp
- Handle async operations

## Error Handling

All service functions throw errors on failure. Always wrap in try-catch:
```typescript
try {
  const data = await fetchStudents()
} catch (error) {
  console.error('Failed to fetch:', error)
  // Handle error appropriately
}
```

## Real-time Data (Optional)

Supabase supports real-time updates. To subscribe to changes:
```typescript
const { data: subscription } = supabase
  .from('students')
  .on('*', payload => {
    console.log('Student data changed:', payload)
  })
  .subscribe()

// Later, unsubscribe:
supabase.removeSubscription(subscription)
```

## Type Safety

The `supabase.ts` file exports TypeScript interfaces for database rows:
- `StudentRow`
- `StudentScoresRow`
- `GlobalSettingsRow`
- `StaffMembersRow`

Use these types for better IDE autocomplete and type checking.

## Troubleshooting

### "Missing Supabase environment variables"
- Ensure `.env.local` file exists with correct credentials
- Restart development server after adding env vars

### "Cannot read property 'select' of undefined"
- Check that `schema.sql` was executed successfully
- Verify all tables were created in Supabase

### Connection timeouts
- Check internet connection
- Verify Supabase project status in dashboard
- Check API key validity

## Next Steps

1. Create additional service files for other entities (staff, facilitators, etc.)
2. Add authentication with Supabase Auth
3. Set up Row Level Security (RLS) for multi-user access
4. Implement real-time subscriptions for live updates
5. Add data validation before database operations

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Database Best Practices](https://supabase.com/docs/guides/database)
