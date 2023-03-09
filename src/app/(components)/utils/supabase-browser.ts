import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from './types'

export const createClient = () => createBrowserSupabaseClient<Database>({
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
})