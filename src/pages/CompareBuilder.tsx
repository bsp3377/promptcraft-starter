import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { polishFinalPrompt } from '../lib/gemini'

const TEMPLATE = `You are a Comparison Analyst.

Compare & Contrast Prompt:
- Items:\n{{Items}}
- Output Structure: {{Structure}}
- Depth Level: {{Depth}}

Rules:
- Present a clear side-by-side comparison.
- Mark pros and cons explicitly.
- Provide a succinct takeaway for each item.`

const STRUCTURES = ['Table', 'Bullet List', 'Paragraph Analysis']
const DEPTH = ['Surface', 'In-depth']

type Item = { title: string; notes: string }

export default function CompareBuilder() {
  const navigate = useNavigate()
  const [items, setItems] = useState<Item[]>([
    { title: '', notes: '' },
    { title: '', notes: '' },
  ])
  const [structure, setStructure] = useState('Table')
  const [depth, setDepth] = useState('Surface')
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState<{[k:string]:boolean}>({})

  const onGenerate = async () => {
    const has = items.some(i => i.title.trim() || i.notes.trim())
    if (!has) return
    setLoading((s)=>({...s, generate:true}))
    try {
      const list = items
        .filter(i => i.title.trim() || i.notes.trim())
        .map((i, idx) => `Item ${idx+1} - ${i.title || '(untitled)'}: ${i.notes || ''}`)
        .join('\n')
      const compiled = TEMPLATE
        .replaceAll('{{Items}}', list)
        .replaceAll('{{Structure}}', structure)
        .replaceAll('{{Depth}}', depth)
      setPreview(await polishFinalPrompt(compiled))
    } finally { setLoading((s)=>({...s, generate:false})) }
  }

  const setField = (index: number, key: keyof Item, value: string) => {
    setItems(prev => prev.map((it, i) => i===index ? { ...it, [key]: value } as Item : it))
  }

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 md:px-8">
      <div className="mb-8">
        <button onClick={() => navigate('/research')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Research Techniques
        </button>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Compare & Contrast Prompt</h1>
        <p className="text-lg text-gray-600">List pros/cons.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {items.map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                <input value={item.title} onChange={(e)=>setField(idx, 'title', e.target.value)} placeholder={`Item ${String.fromCharCode(65+idx)}`} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <textarea value={item.notes} onChange={(e)=>setField(idx, 'notes', e.target.value)} placeholder="Paste notes, specs, or description" className="w-full h-28 px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            ))}
          </div>
          <button onClick={()=>setItems([...items, { title: '', notes: '' }])} className="text-primary-600 text-sm font-medium">+ Add another</button>

          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Output Structure</label>
              <div className="flex flex-wrap gap-2">
                {STRUCTURES.map(s => (
                  <button key={s} onClick={()=>setStructure(s)} className={`px-4 py-2 rounded-lg text-sm font-medium ${structure===s?'bg-primary-600 text-white':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Depth Level</label>
              <div className="flex gap-2">
                {DEPTH.map(d => (
                  <button key={d} onClick={()=>setDepth(d)} className={`px-4 py-2 rounded-lg text-sm font-medium ${depth===d?'bg-primary-600 text-white':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{d}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2"><PrimaryButton onClick={onGenerate} disabled={loading['generate']} loading={loading['generate']} className="w-full">Generate Comparison</PrimaryButton></div>
        </section>
        <PreviewPanel value={preview} onChange={setPreview} />
      </div>
    </div>
  )
}

