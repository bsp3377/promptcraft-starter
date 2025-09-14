import { useEffect, useMemo, useState } from 'react'
import { listTemplates, type TemplateCard } from '../lib/supabase'

export default function TemplateLibrary() {
  const [all, setAll] = useState<TemplateCard[]>([])
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<string>('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try { setLoading(true); const t = await listTemplates(); setAll(t) }
      catch (e: any) { setError(e.message || 'Failed to load templates') }
      finally { setLoading(false) }
    })()
  }, [])

  const categories = useMemo(() => ['All', ...Array.from(new Set(all.map(t => t.category)))], [all])

  const filtered = useMemo(() => all.filter(t => (cat==='All'||t.category===cat) && (q==='' || (t.title+' '+t.category+' '+t.tags.join(' ')).toLowerCase().includes(q.toLowerCase()))), [all, q, cat])

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 md:px-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Explore Prompt Templates</h1>
      <p className="text-gray-600 mb-6">Browse curated template images by category. Select, edit, and generate prompts instantly.</p>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {categories.map(c => (
          <button key={c} onClick={()=>setCat(c)} className={`px-3 py-1.5 rounded-full text-sm ${cat===c?'bg-primary-600 text-white':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{c}</button>
        ))}
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search templates…" className="ml-auto w-64 px-3 py-2 border border-gray-300 rounded-lg" />
      </div>

      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(t => (
          <div key={t.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
            <img src={t.image_url} alt={t.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold mb-1">{t.title}</h3>
              <div className="text-xs text-gray-500 mb-3">{t.category}</div>
              <div className="flex flex-wrap gap-1 mb-4">
                {t.tags?.slice(0,5).map(tag => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
              <button onClick={()=>navigator.clipboard.writeText(t.default_prompt)} className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700">Use This Template</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


