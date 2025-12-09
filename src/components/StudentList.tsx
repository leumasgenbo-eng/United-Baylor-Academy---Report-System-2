import React, { useState, useEffect } from 'react'
import { fetchStudents, deleteStudent, updateStudent } from '../services/studentService'
import { StudentRow } from '../lib/supabase'

/**
 * Example component showing how to use Supabase with student data
 * This demonstrates CRUD operations with real database
 */

export function StudentListExample() {
  const [students, setStudents] = useState<StudentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [department, setDepartment] = useState<string>('Junior High School')
  const [className, setClassName] = useState<string>('')

  // Load students on mount and when filters change
  useEffect(() => {
    loadStudents()
  }, [department, className])

  const loadStudents = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchStudents(department, className || undefined)
      setStudents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load students')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (studentId: number) => {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(studentId)
        setStudents(students.filter(s => s.id !== studentId))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete student')
      }
    }
  }

  const handleUpdateRemark = async (studentId: number, remark: string) => {
    try {
      const updated = await updateStudent(studentId, { overall_remark: remark })
      setStudents(students.map(s => s.id === studentId ? updated : s))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update remark')
    }
  }

  if (loading) return <div>Loading students...</div>
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>

  return (
    <div style={{ padding: '20px' }}>
      <h2>Student List - Supabase Integration Example</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <select 
          value={department} 
          onChange={(e) => setDepartment(e.target.value)}
          style={{ marginRight: '10px' }}
        >
          <option value="Daycare">Daycare</option>
          <option value="Nursery">Nursery</option>
          <option value="Kindergarten">Kindergarten</option>
          <option value="Lower Basic School">Lower Basic School</option>
          <option value="Upper Basic School">Upper Basic School</option>
          <option value="Junior High School">Junior High School</option>
        </select>
        
        <input
          type="text"
          placeholder="Class name (optional)"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
      </div>

      <div style={{ 
        overflowX: 'auto',
        border: '1px solid #ddd',
        borderRadius: '4px'
      }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>ID</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Name</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Department</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Class</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Gender</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Overall Remark</th>
              <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{student.id}</td>
                <td style={{ padding: '10px' }}>{student.name}</td>
                <td style={{ padding: '10px' }}>{student.department}</td>
                <td style={{ padding: '10px' }}>{student.class_name || '-'}</td>
                <td style={{ padding: '10px' }}>{student.gender || '-'}</td>
                <td style={{ padding: '10px' }}>
                  <input
                    type="text"
                    value={student.overall_remark || ''}
                    onChange={(e) => handleUpdateRemark(student.id, e.target.value)}
                    onBlur={() => handleUpdateRemark(student.id, student.overall_remark || '')}
                    style={{ 
                      width: '100%',
                      padding: '4px',
                      border: '1px solid #ccc',
                      borderRadius: '2px'
                    }}
                  />
                </td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <button
                    onClick={() => handleDelete(student.id)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#ff4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {students.length === 0 && (
        <div style={{ marginTop: '20px', color: '#666' }}>
          No students found for this department/class.
        </div>
      )}
    </div>
  )
}
