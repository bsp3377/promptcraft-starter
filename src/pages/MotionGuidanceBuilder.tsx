import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const TEMPLATE = `You are a Motion Director and Physics Supervisor.

Motion Guidance Prompt:
- Motion Description: {{Motion}}
- Scene Context: {{Context}}
- Stability Note: {{Stability}}

Guidance:
- Maintain physically plausible motion: stride length, cadence, and ground contact timing.
- Preserve speed continuity and direction across frames; avoid velocity jitter.
- Keep limb arcs consistent and free from pops or IK snapping.
- Stabilize camera path; minimize micro-shake and rolling shutter artifacts.
- Reduce temporal noise and flicker; enrich textures and shadows.
- Use concise, production-ready language.`

export default function MotionGuidanceBuilder() {
  const navigate = useNavigate()
  const [motion, setMotion] = useState('')
  const [context, setContext] = useState('')
  const [stability, setStability] = useState('')
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState<{[k:string]:boolean}>({})

  const onEnhance = async (label: string, value: string, setter: (v:string)=>void) => {
    try { setLoading((s)=>({...s,[label]:true})); const improved = await enhanceField(label,value); setter(improved||value);} finally { setLoading((s)=>({...s,[label]:false})) }
  }

  const onGenerate = async () => {
    if (!motion.trim() || !context.trim()) return
    setLoading((s)=>({...s, generate:true}))
    try {
      const compiled = TEMPLATE
        .replaceAll('{{Motion}}', motion)
        .replaceAll('{{Context}}', context)
        .replaceAll('{{Stability}}', stability || '(optional)')
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
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Motion Guidance Prompt Builder</h1>
        <p className="text-lg text-gray-600">Guide natural and stable motion in videos.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="space-y-6">
          <InputCard label="Motion Description" placeholder="Smooth running cycle with correct leg movement." value={motion} onChange={setMotion} onEnhance={() => onEnhance('Motion Description', motion, setMotion)} multiline loading={loading['Motion Description']} />
          <InputCard label="Scene Context" placeholder="Athlete running on a track at sunset." value={context} onChange={setContext} onEnhance={() => onEnhance('Scene Context', context, setContext)} loading={loading['Scene Context']} />
          <InputCard label="Stability Note" placeholder="Stable drone flight without jitter." value={stability} onChange={setStability} onEnhance={() => onEnhance('Stability Note', stability, setStability)} loading={loading['Stability Note']} />
          <div className="pt-2"><PrimaryButton onClick={onGenerate} disabled={!motion.trim()||!context.trim()||loading['generate']} loading={loading['generate']} className="w-full">⚡ Generate Final Prompt</PrimaryButton></div>
        </section>
        <PreviewPanel value={preview} onChange={setPreview} />
      </div>
    </div>
  )
}

