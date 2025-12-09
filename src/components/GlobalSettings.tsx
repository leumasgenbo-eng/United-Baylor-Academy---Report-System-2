import React, { useState, useEffect } from 'react'
import { fetchGlobalSettings, updateGlobalSettings } from '../services/globalSettingsService'
import { GlobalSettingsRow } from '../lib/supabase'

/**
 * Example component for managing global school settings
 * Shows how to fetch and update Supabase data
 */

export function GlobalSettingsExample() {
  const [settings, setSettings] = useState<GlobalSettingsRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    school_name: '',
    exam_title: '',
    academic_year: '',
    start_date: '',
    end_date: '',
    head_teacher_name: '',
    school_contact: '',
    school_email: ''
  })

  // Load settings on mount
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchGlobalSettings()
      if (data) {
        setSettings(data)
        setFormData({
          school_name: data.school_name || '',
          exam_title: data.exam_title || '',
          academic_year: data.academic_year || '',
          start_date: data.start_date || '',
          end_date: data.end_date || '',
          head_teacher_name: data.head_teacher_name || '',
          school_contact: data.school_contact || '',
          school_email: data.school_email || ''
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      const updated = await updateGlobalSettings(formData)
      setSettings(updated)
      alert('Settings saved successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading settings...</div>
  }

  return (
    <div style={{ maxWidth: '600px', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Global Settings - Supabase Integration Example</h2>
      
      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#ffcccc',
          color: '#cc0000',
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          Error: {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            School Name
          </label>
          <input
            type="text"
            name="school_name"
            value={formData.school_name}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Exam Title
          </label>
          <input
            type="text"
            name="exam_title"
            value={formData.exam_title}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Academic Year
          </label>
          <input
            type="text"
            name="academic_year"
            value={formData.academic_year}
            onChange={handleInputChange}
            placeholder="e.g., 2023/2024"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Start Date
            </label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              End Date
            </label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Head Teacher Name
          </label>
          <input
            type="text"
            name="head_teacher_name"
            value={formData.head_teacher_name}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            School Contact
          </label>
          <input
            type="text"
            name="school_contact"
            value={formData.school_contact}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            School Email
          </label>
          <input
            type="email"
            name="school_email"
            value={formData.school_email}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '10px 20px',
            backgroundColor: saving ? '#cccccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: saving ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            marginTop: '10px'
          }}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {settings && (
        <div style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          <p><strong>Last Updated:</strong> {new Date(settings.updated_at).toLocaleString()}</p>
        </div>
      )}
    </div>
  )
}
