import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'
import { AppError } from './errorHandling'
import { handleError } from './errorHandling'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

try {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new AppError(
      'Variables d\'environnement Supabase manquantes. Veuillez configurer .env.local',
      'ENV_CONFIG_ERROR',
      500
    )
  }
} catch (error) {
  handleError(error)
  throw error
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
})