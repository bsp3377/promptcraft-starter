import { useEffect, useState } from 'react'
import { supabase, type SavedPrompt } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function History() {
  const [prompts, setPrompts] = useState<SavedPrompt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      try {
        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) { navigate('/auth'); return }
        const { data, error } = await supabase
          .from('prompts')
          .select('id, title, body, category, technique, created_at')
          .eq('user_id', userData.user.id)
          .order('created_at', { ascending: false })
        if (error) throw error
        setPrompts((data || []) as SavedPrompt[])
      } catch (e: any) {
        setError(e.message || 'Failed to load history')
      } finally {
        setLoading(false)
      }
    })()
  }, [navigate])

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 md:px-8">
      <h1 className="text-3xl font-bold mb-6">My Saved Prompts</h1>
      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && prompts.length === 0 && <p className="text-gray-600">No saved prompts yet.</p>}
      <div className="space-y-4">
        {prompts.map(p => (
          <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">{p.title}</h3>
                <p className="text-xs text-gray-500">{p.category} • {p.technique} • {new Date(p.created_at).toLocaleString()}</p>
              </div>
              <button onClick={()=>navigator.clipboard.writeText(p.body)} className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg">Copy</button>
            </div>
            <pre className="mt-3 text-sm whitespace-pre-wrap text-gray-800">{p.body}</pre>
          </div>
        ))}
      </div>
    </div>
  )
}


