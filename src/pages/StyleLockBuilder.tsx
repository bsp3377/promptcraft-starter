import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const TEMPLATE = `You are a Visual Artist.

Style Lock Prompt:
- Role: {{Role}}
- Style / Art Type: {{Style}}
- Scene Description: {{Scene}}

Guidance:
- Enforce consistent character design, line weight, and palette across frames.
- Lock lighting setup and camera mood; maintain tone continuity.
- Prevent style drift and identity changes between shots.
- Keep language concise and production-ready.`

const STYLE_CHIPS = ['Photorealistic', 'Anime', 'Cinematic', 'Pixar-like']

export default function StyleLockBuilder() {
  const navigate = useNavigate()
  const [role, setRole] = useState('')
  const [style, setStyle] = useState('')
  const [scene, setScene] = useState('')
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState<{[k:string]:boolean}>({})

  const onEnhance = async (label: string, value: string, setter: (v:string)=>void) => {
    try { setLoading((s)=>({...s,[label]:true})); const improved = await enhanceField(label,value); setter(improved||value);} finally { setLoading((s)=>({...s,[label]:false})) }
  }

  const onGenerate = async () => {
    if (!scene.trim()) return
    setLoading((s)=>({...s, generate:true}))
    try {
      const compiled = TEMPLATE
        .replaceAll('{{Role}}', role || '(optional)')
        .replaceAll('{{Style}}', style)
        .replaceAll('{{Scene}}', scene)
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
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Style Lock Prompt Builder</h1>
        <p className="text-lg text-gray-600">Enforce consistent art style across frames.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="space-y-6">
          <InputCard label="Role (optional)" placeholder="Visual Artist / Director" value={role} onChange={setRole} onEnhance={() => onEnhance('Role', role, setRole)} loading={loading['Role']} />
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Style / Art Type</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {STYLE_CHIPS.map(c => (
                <button key={c} onClick={() => setStyle(c)} className={`px-3 py-1 rounded-full text-sm ${style===c? 'bg-primary-600 text-white':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{c}</button>
              ))}
            </div>
            <input type="text" placeholder="Photorealistic / Anime / Cinematic / Pixar-like" value={style} onChange={(e)=>setStyle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <InputCard label="Scene Description" placeholder="Family dinner scene in anime style, consistent lighting." value={scene} onChange={setScene} onEnhance={() => onEnhance('Scene Description', scene, setScene)} multiline loading={loading['Scene Description']} />
          <div className="pt-2"><PrimaryButton onClick={onGenerate} disabled={!scene.trim()||loading['generate']} loading={loading['generate']} className="w-full">⚡ Generate Final Prompt</PrimaryButton></div>
        </section>
        <PreviewPanel value={preview} onChange={setPreview} />
      </div>
    </div>
  )
}

