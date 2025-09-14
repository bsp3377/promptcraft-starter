import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const TEMPLATE = `You are an Animator.

Keyframe Prompt:
- Role: {{Role}}
- Style Lock: {{Style}}
- Keyframes:\n{{Frames}}

Guidance:
- Interpolate motion, lighting, and camera between listed frames.
- Maintain style lock consistently across in-betweens.
- Fill missing frames smoothly; avoid identity drift.
- Keep language concise and production-ready.`

export default function KeyframeBuilder() {
  const navigate = useNavigate()
  const [role, setRole] = useState('')
  const [frames, setFrames] = useState('')
  const [style, setStyle] = useState('')
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState<{[k:string]:boolean}>({})

  const onEnhance = async (label: string, value: string, setter: (v:string)=>void) => {
    try { setLoading((s)=>({...s,[label]:true})); const improved = await enhanceField(label,value); setter(improved||value);} finally { setLoading((s)=>({...s,[label]:false})) }
  }

  const onGenerate = async () => {
    if (!frames.trim()) return
    setLoading((s)=>({...s, generate:true}))
    try {
      const compiled = TEMPLATE
        .replaceAll('{{Role}}', role || 'Animator / Cinematographer')
        .replaceAll('{{Style}}', style || '(optional)')
        .replaceAll('{{Frames}}', frames)
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
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Keyframe Prompt Builder</h1>
        <p className="text-lg text-gray-600">Specify important frames and interpolate smoothly.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="space-y-6">
          <InputCard label="Role (optional)" placeholder="Animator / Cinematographer" value={role} onChange={setRole} onEnhance={() => onEnhance('Role', role, setRole)} loading={loading['Role']} />
          <InputCard label="Keyframe List" placeholder={`Frame 1: Sunrise at sea horizon\nFrame 60: Boat approaching shore`} value={frames} onChange={setFrames} onEnhance={() => onEnhance('Keyframe List', frames, setFrames)} multiline loading={loading['Keyframe List']} />
          <InputCard label="Style Lock" placeholder="Cinematic / Pastel colors / Anime" value={style} onChange={setStyle} onEnhance={() => onEnhance('Style Lock', style, setStyle)} loading={loading['Style Lock']} />
          <div className="pt-2"><PrimaryButton onClick={onGenerate} disabled={!frames.trim()||loading['generate']} loading={loading['generate']} className="w-full">⚡ Generate Final Prompt</PrimaryButton></div>
        </section>
        <PreviewPanel value={preview} onChange={setPreview} />
      </div>
    </div>
  )
}

