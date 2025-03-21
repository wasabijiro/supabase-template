import { createClient } from '@supabase/supabase-js'
import { SUPABASE_CONFIG } from './config'

// Supabase client instance
export const supabase = createClient(
  SUPABASE_CONFIG.PROJECT.URL,
  SUPABASE_CONFIG.PROJECT.ANON_KEY,
)