import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(url, anon)

export type SavedPrompt = {
  id: string
  title: string
  body: string
  category: string
  technique: string
  created_at: string
}

export async function savePrompt({ title, body, category, technique }: { title: string; body: string; category: string; technique: string }) {
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) throw new Error('Sign in required')
  const { error } = await supabase.from('prompts').insert({
    user_id: userData.user.id,
    title,
    body,
    category,
    technique
  })
  if (error) throw error
}


