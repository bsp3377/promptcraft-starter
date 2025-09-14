import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const TEMPLATE = `Role: You are a Strategy Coach advising an executive team as a Board Consultant.

Part 1 — Idea Initial Strategy: {{Idea}}
Part 2 — Critique Assess the strategy focusing on: {{Aspects}}. For each aspect, state key assumptions, evidence to collect, red flags, and quick tests to validate. Quantify where possible (cost ranges, timelines, expected impact). Keep reasoning summarized; avoid exposing internal chain-of-thought.
Part 3 — Refined Strategy Refine the original idea to make it realistic under the stated goal: {{Goal}}. Outline a phased plan (30/60/90 days) with scope, resources, and KPIs. Include risk mitigations, dependencies, and decision checkpoints. Provide a concise one-paragraph final recommendation.`

const DEFAULT_ASPECTS = ['Feasibility', 'Budget', 'Risks', 'Opportunities']

export default function DeliberationBuilder() {
  const navigate = useNavigate()
  const [role, setRole] = useState('')
  const [idea, setIdea] = useState('')
  const [goal, setGoal] = useState('')
  const [aspects, setAspects] = useState<string[]>(DEFAULT_ASPECTS)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState<{[k:string]:boolean}>({})

  const toggle = (val: string) => setAspects(prev => prev.includes(val) ? prev.filter(v=>v!==val) : [...prev, val])

  const onEnhance = async (label: string, value: string, setter: (v:string)=>void) => {
    try { setLoading((s)=>({...s,[label]:true})); const improved = await enhanceField(label, value); setter(improved || value);} finally { setLoading((s)=>({...s,[label]:false})) }
  }

  const onGenerate = async () => {
    if (!idea.trim() || !goal.trim()) return
    setLoading((s)=>({...s, generate:true}))
    try {
      const compiled = TEMPLATE
        .replaceAll('You are a Strategy Coach', role ? `You are a ${role}` : 'You are a Strategy Coach')
        .replaceAll('{{Idea}}', idea)
        .replaceAll('{{Aspects}}', aspects.join(', '))
        .replaceAll('{{Goal}}', goal)
      setPreview(await polishFinalPrompt(compiled))
    } finally { setLoading((s)=>({...s, generate:false})) }
  }

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 md:px-8">
      <div className="mb-8">
        <button onClick={() => navigate('/business')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Business & Strategy
        </button>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Deliberation Prompt Builder</h1>
        <p className="text-lg text-gray-600">Generate → critique → refine business strategies.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="space-y-6">
          <InputCard label="Role (optional)" value={role} onChange={setRole} onEnhance={() => onEnhance('Role', role, setRole)} placeholder="Strategy Coach / Board Consultant" />
          <InputCard label="Initial Strategy" value={idea} onChange={setIdea} onEnhance={() => onEnhance('Initial Strategy', idea, setIdea)} placeholder="Expand into e-commerce by Q4" multiline />
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Critique Aspects</label>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_ASPECTS.map(a => (
                <button key={a} onClick={()=>toggle(a)} className={`px-3 py-1 rounded-full text-sm ${aspects.includes(a)?'bg-primary-600 text-white':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{a}</button>
              ))}
            </div>
          </div>
          <InputCard label="Refinement Goal" value={goal} onChange={setGoal} onEnhance={() => onEnhance('Refinement Goal', goal, setGoal)} placeholder="Make the strategy realistic under $100k budget" />
          <div className="pt-2"><PrimaryButton onClick={onGenerate} disabled={!idea.trim()||!goal.trim()||loading['generate']} loading={loading['generate']} className="w-full">Generate Final Prompt</PrimaryButton></div>
        </section>
        <PreviewPanel value={preview} onChange={setPreview} />
      </div>
    </div>
  )
}

