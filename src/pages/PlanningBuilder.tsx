import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const TEMPLATE = `You are a Business Strategist helping a startup plan expansion into new markets.

Planning Prompt:
- Role: {{Role}}
- Goal: {{Goal}}
- Steps:\n{{Steps}}
- Constraints / Notes: {{Constraints}}

Output: A concise, ordered plan with owners, milestones, and KPIs. Include risks, assumptions, and next checkpoints.`

export default function PlanningBuilder() {
  const navigate = useNavigate()
  const [role, setRole] = useState('')
  const [goal, setGoal] = useState('')
  const [steps, setSteps] = useState('')
  const [constraints, setConstraints] = useState('')
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState<{[k:string]:boolean}>({})

  const onEnhance = async (label: string, value: string, setter: (v:string)=>void) => {
    try { setLoading((s)=>({...s,[label]:true})); const improved = await enhanceField(label, value); setter(improved || value);} finally { setLoading((s)=>({...s,[label]:false})) }
  }

  const onGenerate = async () => {
    if (!goal.trim() || !steps.trim()) return
    setLoading((s)=>({...s, generate:true}))
    try {
      const compiled = TEMPLATE
        .replaceAll('{{Role}}', role || 'Business Strategist / Startup Mentor')
        .replaceAll('{{Goal}}', goal)
        .replaceAll('{{Steps}}', steps)
        .replaceAll('{{Constraints}}', constraints || '(none)')
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
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Planning Prompt Builder</h1>
        <p className="text-lg text-gray-600">Define step-by-step business strategies with clear goals.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="space-y-6">
          <InputCard label="Role (optional)" value={role} onChange={setRole} onEnhance={() => onEnhance('Role', role, setRole)} placeholder="Business Strategist / Startup Mentor" />
          <InputCard label="Goal / Objective" value={goal} onChange={setGoal} onEnhance={() => onEnhance('Goal / Objective', goal, setGoal)} placeholder="Expand into new markets" />
          <InputCard label="Step-by-Step Actions" value={steps} onChange={setSteps} onEnhance={() => onEnhance('Step-by-Step Actions', steps, setSteps)} placeholder={`1) Research competitors\n2) Identify target customers\n3) Validate demand with experiments\n4) Define GTM channels and budget\n5) Create 90-day execution plan...`} multiline />
          <InputCard label="Constraints / Notes" value={constraints} onChange={setConstraints} onEnhance={() => onEnhance('Constraints / Notes', constraints, setConstraints)} placeholder="Budget limited to $50k / Timeline = 6 months" />
          <div className="pt-2"><PrimaryButton onClick={onGenerate} disabled={!goal.trim()||!steps.trim()||loading['generate']} loading={loading['generate']} className="w-full">Generate Final Prompt</PrimaryButton></div>
        </section>
        <PreviewPanel value={preview} onChange={setPreview} />
      </div>
    </div>
  )
}

