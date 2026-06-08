import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Variabel lingkungan Supabase belum terisi dengan benar di file .env!")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
