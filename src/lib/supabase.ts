import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and key must be defined')
  }

  return createClient(supabaseUrl, supabaseKey)
}

export const createBrowserSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and key must be defined')
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}