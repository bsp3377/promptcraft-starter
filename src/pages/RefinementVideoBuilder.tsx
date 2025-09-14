import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const TEMPLATE = `You are a Refinement Director.

Refinement Prompt:
- Base Prompt:\n{{Base}}
- Refinement Instruction:\n{{Instruction}}
- Iteration Note:\n{{Note}}

Guidance:
- Start broad; keep language concise and unambiguous.
- Iterate with targeted refinements; avoid introducing new subjects.
- Maintain temporal consistency and color continuity.
- Reduce flicker and stabilize motion across frames.
- Prefer actionable, testable changes each pass.`

export default function RefinementVideoBuilder() {
  const navigate = useNavigate()
  const [base, setBase] = useState('')
  const [instruction, setInstruction] = useState('')
  const [note, setNote] = useState('')
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState<{[k:string]:boolean}>({})

  const onEnhance = async (label: string, value: string, setter: (v:string)=>void) => {
    try { setLoading((s)=>({...s,[label]:true})); const improved = await enhanceField(label,value); setter(improved||value);} finally { setLoading((s)=>({...s,[label]:false})) }
  }

  const onGenerate = async () => {
    if (!base.trim() || !instruction.trim()) return
    setLoading((s)=>({...s, generate:true}))
    try {
      const compiled = TEMPLATE
        .replaceAll('{{Base}}', base)
        .replaceAll('{{Instruction}}', instruction)
        .replaceAll('{{Note}}', note || 'Repeat until transitions are seamless.')
      const finalText = await polishFinalPrompt(compiled)
      setPreview(finalText)
    } finally { setLoading((s)=>({...s, generate:false})) }
  }

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 md:px-8">
      <div className="mb-8">
        <button onClick={() => navigate('/video')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Video Techniques
        </button>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Refinement Prompt Builder</h1>
        <p className="text-lg text-gray-600">Start broad, then refine with AI for smoother output.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="space-y-6">
          <InputCard label="Base Prompt" placeholder="Describe the overall scene." value={base} onChange={setBase} onEnhance={() => onEnhance('Base Prompt', base, setBase)} multiline loading={loading['Base Prompt']} />
          <InputCard label="Refinement Instruction" placeholder="Make character movements smoother / Keep sky color constant." value={instruction} onChange={setInstruction} onEnhance={() => onEnhance('Refinement Instruction', instruction, setInstruction)} loading={loading['Refinement Instruction']} />
          <InputCard label="Iteration Note" placeholder="Repeat until transitions are seamless." value={note} onChange={setNote} onEnhance={() => onEnhance('Iteration Note', note, setNote)} loading={loading['Iteration Note']} />
          <div className="pt-2"><PrimaryButton onClick={onGenerate} disabled={!base.trim()||!instruction.trim()||loading['generate']} loading={loading['generate']} className="w-full">⚡ Generate Final Prompt</PrimaryButton></div>
        </section>
        <PreviewPanel value={preview} onChange={setPreview} />
      </div>
    </div>
  )
}

