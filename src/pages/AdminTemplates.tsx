import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const ADMIN_USER = 'admin'
const ADMIN_PASS = 'adminpromptcraft'

export default function AdminTemplates() {
  const [authed, setAuthed] = useState(false)
  const [u, setU] = useState('')
  const [p, setP] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [defaultPrompt, setDefaultPrompt] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    setAuthed(sessionStorage.getItem('tmpl_admin') === '1')
  }, [])

  const doLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (u === ADMIN_USER && p === ADMIN_PASS) {
      sessionStorage.setItem('tmpl_admin', '1')
      setAuthed(true)
      setMsg('')
    } else {
      setMsg('Invalid admin credentials')
    }
  }

  const upload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) { setMsg('Choose an image'); return }
    try {
      setSaving(true); setMsg('')
      const ext = file.name.split('.').pop() || 'jpg'
      const path = `templates/${crypto.randomUUID()}.${ext}`
      const { error: upErr } = await supabase.storage.from('templates').upload(path, file, { upsert: false })
      if (upErr) throw upErr
      const { data: pub } = supabase.storage.from('templates').getPublicUrl(path)
      const imageUrl = pub.publicUrl
      const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean)
      const { error: insErr } = await supabase.from('templates').insert({
        title,
        category,
        tags: tagArray,
        image_url: imageUrl,
        default_prompt: defaultPrompt
      })
      if (insErr) throw insErr
      setMsg('Template saved')
      setTitle(''); setCategory(''); setTags(''); setDefaultPrompt(''); setFile(null)
    } catch (e: any) {
      setMsg(e.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (!authed) {
    return (
      <div className="py-12 max-w-md mx-auto px-4 md:px-8">
        <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
        <form onSubmit={doLogin} className="space-y-4">
          <input value={u} onChange={(e)=>setU(e.target.value)} placeholder="Username" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          <input value={p} onChange={(e)=>setP(e.target.value)} type="password" placeholder="Password" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          <button className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700">Sign in</button>
          {msg && <p className="text-red-600">{msg}</p>}
        </form>
      </div>
    )
  }

  return (
    <div className="py-12 max-w-2xl mx-auto px-4 md:px-8">
      <h1 className="text-3xl font-bold mb-6">Upload Template</h1>
      <form onSubmit={upload} className="space-y-4">
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
        <input value={category} onChange={(e)=>setCategory(e.target.value)} placeholder="Category (e.g., Fashion, Product)" className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
        <input value={tags} onChange={(e)=>setTags(e.target.value)} placeholder="Tags (comma separated)" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        <textarea value={defaultPrompt} onChange={(e)=>setDefaultPrompt(e.target.value)} placeholder="Default prompt" className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg"></textarea>
        <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0] || null)} />
        <button disabled={saving} className="bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-60">{saving?'Saving…':'Save Template'}</button>
        {msg && <p className="text-sm mt-2">{msg}</p>}
      </form>
    </div>
  )
}


