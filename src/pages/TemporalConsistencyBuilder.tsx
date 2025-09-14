import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const TEMPLATE = `You are a Video Editor / Continuity Supervisor.

Temporal Consistency Prompt:
- Role: Video Editor / Continuity Supervisor (optional)
- Instruction: {{Instruction}}
- Scene Context: {{Context}}

Guidance:
- Preserve color stability across shots; avoid hue shifts.
- Maintain character identity, facial features, and proportions.
- Keep motion continuity consistent (speed, direction, and timing).
- Reduce flicker and temporal noise; stabilize textures and patterns.
- Keep language concise and production-ready.`

export default function TemporalConsistencyBuilder() {
  const navigate = useNavigate()
  const [instruction, setInstruction] = useState('')
  const [context, setContext] = useState('')
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState<{[k:string]:boolean}>({})

  const onEnhance = async (label: string, value: string, setter: (v:string)=>void) => {
    try { setLoading((s)=>({...s,[label]:true})); const improved = await enhanceField(label,value); setter(improved||value);} finally { setLoading((s)=>({...s,[label]:false})) }
  }

  const onGenerate = async () => {
    if (!instruction.trim() || !context.trim()) return
    setLoading((s)=>({...s, generate:true}))
    try {
      const compiled = TEMPLATE
        .replaceAll('{{Instruction}}', instruction)
        .replaceAll('{{Context}}', context)
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
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Temporal Consistency Prompt Builder</h1>
        <p className="text-lg text-gray-600">Ensure stability of colors, faces, and motion across frames.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="space-y-6">
          <InputCard label="Instruction" placeholder="Keep sky color constant. Maintain character faces across frames." value={instruction} onChange={setInstruction} onEnhance={() => onEnhance('Instruction', instruction, setInstruction)} multiline loading={loading['Instruction']} />
          <InputCard label="Scene Context" placeholder="Man walking across a desert at sunset." value={context} onChange={setContext} onEnhance={() => onEnhance('Scene Context', context, setContext)} loading={loading['Scene Context']} />
          <div className="pt-2"><PrimaryButton onClick={onGenerate} disabled={!instruction.trim()||!context.trim()||loading['generate']} loading={loading['generate']} className="w-full">⚡ Generate Final Prompt</PrimaryButton></div>
        </section>
        <PreviewPanel value={preview} onChange={setPreview} />
      </div>
    </div>
  )
}

