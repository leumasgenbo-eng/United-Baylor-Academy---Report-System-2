import { supabase, GlobalSettingsRow } from '../lib/supabase'

/**
 * Global Settings Service - School-wide configuration
 */

// Fetch global settings
export async function fetchGlobalSettings(): Promise<GlobalSettingsRow | null> {
  const { data, error } = await supabase
    .from('global_settings')
    .select('*')
    .limit(1)
    .single()
  
  if (error && error.code !== 'PGRST116') {
    // PGRST116 means no rows found, which is acceptable
    console.error('Error fetching global settings:', error)
    throw error
  }
  
  return (data as GlobalSettingsRow) || null
}

// Update global settings
export async function updateGlobalSettings(updates: Partial<GlobalSettingsRow>) {
  // Check if settings exist
  const existing = await fetchGlobalSettings()
  
  if (existing) {
    // Update existing
    const { data, error } = await supabase
      .from('global_settings')
      .update(updates)
      .eq('id', existing.id)
      .select()
    
    if (error) {
      console.error('Error updating global settings:', error)
      throw error
    }
    
    return data?.[0] as GlobalSettingsRow
  } else {
    // Create new
    const { data, error } = await supabase
      .from('global_settings')
      .insert([{
        school_name: updates.school_name || 'United Baylor Academy',
        ...updates
      }])
      .select()
    
    if (error) {
      console.error('Error creating global settings:', error)
      throw error
    }
    
    return data?.[0] as GlobalSettingsRow
  }
}

// Update school name
export async function updateSchoolName(schoolName: string) {
  return updateGlobalSettings({ school_name: schoolName })
}

// Update exam details
export async function updateExamDetails(examTitle: string, mockSeries: string) {
  return updateGlobalSettings({ exam_title: examTitle, mock_series: mockSeries })
}

// Update academic year
export async function updateAcademicYear(year: string) {
  return updateGlobalSettings({ academic_year: year })
}

// Update term dates
export async function updateTermDates(startDate: string, endDate: string, nextTermBegin: string) {
  return updateGlobalSettings({
    start_date: startDate,
    end_date: endDate,
    next_term_begin: nextTermBegin
  })
}
