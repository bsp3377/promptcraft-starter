import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const TEMPLATE = `Role: You are an Editor and Writing Coach.

Task: Refine the following draft via a two-pass process: critique, then improved rewrite.
Draft: "{{Draft}}"

Critique Focus: {{FocusList}}

Guidelines:
- Provide concise, actionable critique in bullet points. Do not reveal internal chain-of-thought; only surface specific issues and suggestions.
- Preserve plot facts; you may adjust wording, rhythm, and imagery.

Refinement Goal: {{Goal}}

Return Format:
- Critique: • bullet list (5–8 items)
- Revised Passage: 120–180 words, first or close third person, sensory detail, emotional texture.`

const FOCUS_CHIPS = ['Clarity', 'Tone', 'Pacing', 'Dialogue', 'Emotion']

export default function RefinementWritingBuilder() {
  const navigate = useNavigate()
  const [role, setRole] = useState('')
  const [draft, setDraft] = useState('')
  const [goal, setGoal] = useState('')
  const [focus, setFocus] = useState<string[]>(['Clarity'])
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState<{[k:string]:boolean}>({})

  const toggle = (val: string) => setFocus(prev => prev.includes(val) ? prev.filter(v=>v!==val) : [...prev, val])

  const onEnhance = async (label: string, value: string, setter: (v:string)=>void) => {
    try { setLoading((s)=>({...s,[label]:true})); const improved = await enhanceField(label, value); setter(improved || value);} finally { setLoading((s)=>({...s,[label]:false})) }
  }

  const onGenerate = async () => {
    if (!draft.trim() || !goal.trim()) return
    setLoading((s)=>({...s, generate:true}))
    try {
      const compiled = TEMPLATE
        .replaceAll('Editor and Writing Coach', role.trim() ? role : 'Editor and Writing Coach')
        .replaceAll('{{Draft}}', draft)
        .replaceAll('{{FocusList}}', focus.join(', '))
        .replaceAll('{{Goal}}', goal)
      const finalText = await polishFinalPrompt(compiled)
      setPreview(finalText)
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
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Refinement Prompt Builder</h1>
        <p className="text-lg text-gray-600">Draft → critique → improve story writing.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="space-y-6">
          <InputCard label="Role (optional)" value={role} onChange={setRole} onEnhance={() => onEnhance('Role', role, setRole)} placeholder="Editor / Writing Coach" />

          <InputCard label="Draft Text" value={draft} onChange={setDraft} onEnhance={() => onEnhance('Draft Text', draft, setDraft)} placeholder="The hero walked into the forest. It was scary." multiline />

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Critique Focus</label>
            <div className="flex flex-wrap gap-2">
              {FOCUS_CHIPS.map(c => (
                <button key={c} onClick={()=>toggle(c)} className={`px-3 py-1 rounded-full text-sm ${focus.includes(c)?'bg-primary-600 text-white':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{c}</button>
              ))}
            </div>
          </div>

          <InputCard label="Refinement Goal" value={goal} onChange={setGoal} onEnhance={() => onEnhance('Refinement Goal', goal, setGoal)} placeholder="Make the narration vivid and emotionally deep." />

          <div className="pt-2">
            <PrimaryButton onClick={onGenerate} disabled={!draft.trim()||!goal.trim()||loading['generate']} loading={loading['generate']} className="w-full">Generate Final Prompt</PrimaryButton>
          </div>
        </section>

        <PreviewPanel value={preview} onChange={setPreview} />
      </div>
    </div>
  )
}


