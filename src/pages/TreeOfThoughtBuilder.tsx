import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const TEMPLATE = `Role: You are a {{RoleOrDefault}} who thinks in branches before drafting.

Story Question: {{Question}}
Tree-of-Thought Generation:
1) Generate {{Count}} distinct branches (succinct 2–3 sentence summaries each).
{{BranchesTemplate}}
Evaluation Criteria: {{Criteria}}
Selection:
- Briefly justify the best branch in one sentence (evidence-based, no hidden reasoning).
Output the final chosen branch as a paragraph (120–200 words).
Return Format:
- Branches: - A) - B) - C)
- Choice:
- Final Paragraph:`

function makeBranchesTemplate(count: number) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return Array.from({ length: count }, (_, i) => `- Branch ${letters[i]}: ...`).join('\n')
}

export default function TreeOfThoughtBuilder() {
  const navigate = useNavigate()
  const [role, setRole] = useState('Story Architect / Fantasy Writer')
  const [question, setQuestion] = useState('')
  const [count, setCount] = useState(3)
  const [criteria, setCriteria] = useState('Pick the most suspenseful / Most emotionally moving')
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState<{[k:string]:boolean}>({})

  const onEnhance = async (label: string, value: string, setter: (v:string)=>void) => {
    try { setLoading((s)=>({...s,[label]:true})); const improved = await enhanceField(label, value); setter(improved || value);} finally { setLoading((s)=>({...s,[label]:false})) }
  }

  const onGenerate = async () => {
    if (!question.trim()) return
    setLoading((s)=>({...s, generate:true}))
    try {
      const compiled = TEMPLATE
        .replaceAll('{{RoleOrDefault}}', role || 'Story Architect')
        .replaceAll('{{Question}}', question)
        .replaceAll('{{Count}}', String(count))
        .replaceAll('{{BranchesTemplate}}', makeBranchesTemplate(count))
        .replaceAll('{{Criteria}}', criteria)
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
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Tree-of-Thought Prompt Builder</h1>
        <p className="text-lg text-gray-600">Branch storylines into multiple options, then refine the best one.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <section className="space-y-6">
          <InputCard label="Role" value={role} onChange={setRole} onEnhance={() => onEnhance('Role', role, setRole)} placeholder="Story Architect / Fantasy Writer" />
          <InputCard label="Story Question" value={question} onChange={setQuestion} onEnhance={() => onEnhance('Story Question', question, setQuestion)} placeholder="What happens after the hero opens the cursed book?" />
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Branch Count</label>
            <div className="flex items-center gap-2">
              {[2,3,5].map(n => (
                <button key={n} onClick={()=>setCount(n)} className={`w-9 h-9 rounded-full text-sm font-medium ${count===n?'bg-primary-600 text-white':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{n}</button>
              ))}
              <input type="number" min={2} max={6} value={count} onChange={(e)=>setCount(Number(e.target.value))} className="px-3 py-2 border border-gray-300 rounded-lg w-24" placeholder="Custom" />
            </div>
          </div>
          <InputCard label="Evaluation Criteria" value={criteria} onChange={setCriteria} onEnhance={() => onEnhance('Evaluation Criteria', criteria, setCriteria)} placeholder="Pick the most suspenseful / Most emotionally moving" />
          <div className="pt-2"><PrimaryButton onClick={onGenerate} disabled={!question.trim()||loading['generate']} loading={loading['generate']} className="w-full">Generate Final Prompt</PrimaryButton></div>
        </section>
        <PreviewPanel value={preview} onChange={setPreview} />
      </div>
    </div>
  )
}

