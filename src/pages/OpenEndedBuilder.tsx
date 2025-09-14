import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const TEMPLATE = `Role: You are a Creative Writer (or switch to Screenwriter or Poet) who proposes multiple narrative directions.

Base Story Idea: {{Idea}}
Exploration Guidance: {{Guidance}}
Constraints: {{Constraints}}

Output Format:
- Present options as labeled bullet points (e.g., Ending A/B/C, Arc 1/2).
- Keep each option concise (1–3 sentences) with evocative sensory details.
- Maintain continuity and avoid contradictions in tone and lore.
- Conclude with a short prompt for which path to pursue next.`

export default function OpenEndedBuilder() {
  const navigate = useNavigate()
  const [role, setRole] = useState('')
  const [idea, setIdea] = useState('')
  const [guidance, setGuidance] = useState('')
  const [constraints, setConstraints] = useState('')
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState<{[k:string]:boolean}>({})

  const onEnhance = async (label: string, value: string, setter: (v:string)=>void) => {
    try { setLoading((s)=>({...s,[label]:true})); const improved = await enhanceField(label, value); setter(improved || value);} finally { setLoading((s)=>({...s,[label]:false})) }
  }

  const onGenerate = async () => {
    if (!idea.trim() || !guidance.trim()) return
    setLoading((s)=>({...s, generate:true}))
    try {
      const compiled = TEMPLATE
        .replaceAll('Creative Writer', role.trim() || 'Creative Writer')
        .replaceAll('{{Idea}}', idea)
        .replaceAll('{{Guidance}}', guidance)
        .replaceAll('{{Constraints}}', constraints || '(optional)')
      setPreview(await polishFinalPrompt(compiled))
    } finally { setLoading((s)=>({...s, generate:false})) }
  }

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 md:px-8">
      <div className="mb-8">
        <button onClick={() => navigate('/creative')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Creative Writing
        </button>
      </div>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Open-ended Prompt Builder</h1>
        <p className="text-lg text-gray-600">Encourage the AI to explore multiple story directions.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <section className="space-y-6">
          <InputCard label="Role (optional)" value={role} onChange={setRole} onEnhance={() => onEnhance('Role', role, setRole)} placeholder="Creative Writer / Screenwriter / Poet" />
          <InputCard label="Base Story Idea" value={idea} onChange={setIdea} onEnhance={() => onEnhance('Base Story Idea', idea, setIdea)} placeholder="A lonely astronaut discovers an alien artifact." />
          <InputCard label="Exploration Guidance" value={guidance} onChange={setGuidance} onEnhance={() => onEnhance('Exploration Guidance', guidance, setGuidance)} placeholder="Suggest 3 possible endings / Generate 2 alternative character arcs." multiline />
          <InputCard label="Constraints (optional)" value={constraints} onChange={setConstraints} onEnhance={() => onEnhance('Constraints', constraints, setConstraints)} placeholder="Keep under 300 words / Use first-person voice." />
          <div className="pt-2"><PrimaryButton onClick={onGenerate} disabled={!idea.trim()||!guidance.trim()||loading['generate']} loading={loading['generate']} className="w-full">Generate Final Prompt</PrimaryButton></div>
        </section>
        <PreviewPanel value={preview} onChange={setPreview} />
      </div>
    </div>
  )
}

