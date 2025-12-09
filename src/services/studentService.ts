import { supabase, StudentRow, StudentScoresRow } from '../lib/supabase'

/**
 * Student Service - All student-related database operations
 */

// Fetch all students
export async function fetchStudents(department?: string, className?: string) {
  let query = supabase.from('students').select('*')
  
  if (department) {
    query = query.eq('department', department)
  }
  
  if (className) {
    query = query.eq('class_name', className)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching students:', error)
    throw error
  }
  
  return data as StudentRow[]
}

// Fetch single student with scores
export async function fetchStudentWithScores(studentId: number) {
  const { data: student, error: studentError } = await supabase
    .from('students')
    .select('*')
    .eq('id', studentId)
    .single()
  
  if (studentError) {
    console.error('Error fetching student:', studentError)
    throw studentError
  }
  
  const { data: scores, error: scoresError } = await supabase
    .from('student_scores')
    .select('*')
    .eq('student_id', studentId)
  
  if (scoresError) {
    console.error('Error fetching scores:', scoresError)
    throw scoresError
  }
  
  return {
    student: student as StudentRow,
    scores: scores as StudentScoresRow[]
  }
}

// Create new student
export async function createStudent(studentData: Partial<StudentRow>) {
  const { data, error } = await supabase
    .from('students')
    .insert([studentData])
    .select()
  
  if (error) {
    console.error('Error creating student:', error)
    throw error
  }
  
  return data?.[0] as StudentRow
}

// Update student
export async function updateStudent(studentId: number, updates: Partial<StudentRow>) {
  const { data, error } = await supabase
    .from('students')
    .update(updates)
    .eq('id', studentId)
    .select()
  
  if (error) {
    console.error('Error updating student:', error)
    throw error
  }
  
  return data?.[0] as StudentRow
}

// Delete student
export async function deleteStudent(studentId: number) {
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', studentId)
  
  if (error) {
    console.error('Error deleting student:', error)
    throw error
  }
}

// Add or update student score
export async function upsertStudentScore(studentId: number, subject: string, score: number, totalScore?: number) {
  const { data, error } = await supabase
    .from('student_scores')
    .upsert(
      {
        student_id: studentId,
        subject,
        score,
        total_score: totalScore
      },
      { onConflict: 'student_id, subject' }
    )
    .select()
  
  if (error) {
    console.error('Error upserting score:', error)
    throw error
  }
  
  return data?.[0] as StudentScoresRow
}

// Fetch students by class
export async function fetchStudentsByClass(department: string, className: string) {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('department', department)
    .eq('class_name', className)
    .order('name', { ascending: true })
  
  if (error) {
    console.error('Error fetching students by class:', error)
    throw error
  }
  
  return data as StudentRow[]
}

// Search students by name
export async function searchStudents(searchTerm: string) {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .ilike('name', `%${searchTerm}%`)
  
  if (error) {
    console.error('Error searching students:', error)
    throw error
  }
  
  return data as StudentRow[]
}
