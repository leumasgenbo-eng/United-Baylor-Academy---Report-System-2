import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate that environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file.'
  )
}

// Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for database tables
export interface TablesInsert<T extends keyof any> {
  students: Omit<StudentRow, 'id' | 'created_at' | 'updated_at'>
  student_scores: Omit<StudentScoresRow, 'id' | 'created_at' | 'updated_at'>
  global_settings: Omit<GlobalSettingsRow, 'id' | 'created_at' | 'updated_at'>
  staff_members: Omit<StaffMembersRow, 'created_at' | 'updated_at'>
}

export interface StudentRow {
  id: number
  student_id: number | null
  name: string
  department: string
  class_name: string | null
  gender: string | null
  date_of_birth: string | null
  guardian: string | null
  contact: string | null
  address: string | null
  age: string | null
  promoted_to: string | null
  conduct: string | null
  interest: string | null
  attendance: string | null
  overall_remark: string | null
  final_remark: string | null
  recommendation: string | null
  created_at: string
  updated_at: string
}

export interface StudentScoresRow {
  id: number
  student_id: number
  subject: string
  score: number | null
  total_score: number | null
  created_at: string
  updated_at: string
}

export interface GlobalSettingsRow {
  id: number
  school_name: string
  exam_title: string | null
  mock_series: string | null
  mock_announcement: string | null
  mock_deadline: string | null
  term_info: string | null
  academic_year: string | null
  next_term_begin: string | null
  attendance_total: string | null
  start_date: string | null
  end_date: string | null
  head_teacher_name: string | null
  report_date: string | null
  school_contact: string | null
  school_email: string | null
  created_at: string
  updated_at: string
}

export interface StaffMembersRow {
  id: string
  name: string
  role: string
  status: string
  contact: string | null
  qualification: string | null
  created_at: string
  updated_at: string
}
