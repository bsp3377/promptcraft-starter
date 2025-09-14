import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const TEMPLATE = `You are a Critic & Refiner.

Refinement Goals: {{Goals}}
Critique Style: {{Style}}

Draft Text:\n{{Draft}}

Instructions:
- Provide an annotated critique highlighting changes (additions in green, removals in red) when possible.
- Rewrite the text to satisfy the refinement goals.
- Keep language precise and neutral; reduce bias.`

const GOALS = ['Improve Clarity', 'Reduce Bias', 'Add Depth', 'Tone Adjustment']
const STYLES = ['Soft feedback', 'Strict critique']

export default function CriticRefinerBuilder() {
  const navigate = useNavigate()
  const [draft, setDraft] = useState('')
  const [goals, setGoals] = useState<string[]>(['Improve Clarity'])
  const [style, setStyle] = useState('Soft feedback')
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState<{[k:string]:boolean}>({})

  const toggle = (val: string) => setGoals(prev => prev.includes(val) ? prev.filter(v=>v!==val) : [...prev, val])

  const onGenerate = async () => {
    if (!draft.trim()) return
    setLoading((s)=>({...s, generate:true}))
    try {
      const compiled = TEMPLATE
        .replaceAll('{{Goals}}', goals.join(', '))
        .replaceAll('{{Style}}', style)
        .replaceAll('{{Draft}}', draft)
      setPreview(await polishFinalPrompt(compiled))
    } finally { setLoading((s)=>({...s, generate:false})) }
  }

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 md:px-8">
      <div className="mb-8">
        <button onClick={() => navigate('/research')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Research Techniques
        </button>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Critic & Refiner Prompt</h1>
        <p className="text-lg text-gray-600">Improve accuracy & reduce bias.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="space-y-6">
          <InputCard label="Draft Text" placeholder="Paste the response or draft that needs critique and refinement." value={draft} onChange={setDraft} onEnhance={() => enhanceField('Draft Text', draft).then(t=>setDraft(t||draft))} multiline />

          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Refinement Goals</label>
              <div className="flex flex-wrap gap-2">
                {GOALS.map(g => (
                  <button key={g} onClick={()=>toggle(g)} className={`px-4 py-2 rounded-lg text-sm font-medium ${goals.includes(g)?'bg-primary-600 text-white':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{g}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Critique Style</label>
              <div className="flex gap-2">
                {STYLES.map(s => (
                  <button key={s} onClick={()=>setStyle(s)} className={`px-4 py-2 rounded-lg text-sm font-medium ${style===s?'bg-primary-600 text-white':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{s}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2"><PrimaryButton onClick={onGenerate} disabled={!draft.trim()||loading['generate']} loading={loading['generate']} className="w-full">Generate Refinement</PrimaryButton></div>
        </section>
        <PreviewPanel value={preview} onChange={setPreview} />
      </div>
    </div>
  )
}

