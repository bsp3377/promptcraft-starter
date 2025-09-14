import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const TEMPLATE = `You are a Film Director.

Shot-based Prompt:
- Role: {{Role}}
- Shot Type(s): {{Shots}}
- Camera Movement(s): {{Moves}}
- Scene: {{Scene}}

Guidance:
- Use concise language; specify subject, framing, and movement.
- Maintain continuity in direction, lighting, and pacing.
- Keep each shot self-contained and production-ready.`

const SHOT_CHIPS = ['Wide shot', 'Close-up', 'Drone view', 'Tracking shot']
const MOVE_CHIPS = ['Pan left', 'Zoom in', 'Steady tracking', 'Dolly out']

export default function CinematicBuilder() {
  const navigate = useNavigate()
  const [role, setRole] = useState('')
  const [shots, setShots] = useState<string[]>([])
  const [moves, setMoves] = useState<string[]>([])
  const [scene, setScene] = useState('')
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState<{[k:string]:boolean}>({})

  const toggle = (arr: string[], setArr: (v:string[])=>void, v: string) => {
    setArr(arr.includes(v) ? arr.filter(x=>x!==v) : [...arr, v])
  }

  const onEnhance = async (label: string, value: string, setter: (v:string)=>void) => {
    try { setLoading((s)=>({...s,[label]:true})); const improved = await enhanceField(label,value); setter(improved||value);} finally { setLoading((s)=>({...s,[label]:false})) }
  }

  const onGenerate = async () => {
    if (!scene.trim()) return
    setLoading((s)=>({...s, generate:true}))
    try {
      const compiled = TEMPLATE
        .replaceAll('{{Role}}', role || '(optional)')
        .replaceAll('{{Shots}}', shots.join(', ') || '(custom)')
        .replaceAll('{{Moves}}', moves.join(', ') || '(custom)')
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
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Cinematic Prompt Builder</h1>
        <p className="text-lg text-gray-600">Use filmmaking language to define shots and movements.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="space-y-6">
          <InputCard label="Role (Optional)" placeholder="Film Director / Drone Operator" value={role} onChange={setRole} onEnhance={() => onEnhance('Role', role, setRole)} loading={loading['Role']} />

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Shot Types</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {SHOT_CHIPS.map(c => (
                <button key={c} onClick={() => toggle(shots,setShots,c)} className={`px-3 py-1 rounded-full text-sm ${shots.includes(c)? 'bg-primary-600 text-white':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{c}</button>
              ))}
            </div>
            <input type="text" placeholder="Add custom shot type..." className="w-full px-3 py-2 border border-gray-300 rounded-lg" onKeyDown={(e)=>{
              if (e.key==='Enter') { const v=(e.target as HTMLInputElement).value.trim(); if (v) setShots([...shots,v]); (e.target as HTMLInputElement).value=''; }
            }} />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Camera Movements</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {MOVE_CHIPS.map(c => (
                <button key={c} onClick={() => toggle(moves,setMoves,c)} className={`px-3 py-1 rounded-full text-sm ${moves.includes(c)? 'bg-primary-600 text-white':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{c}</button>
              ))}
            </div>
          </div>

          <InputCard label="Scene Description" placeholder="Forest path, character walking, steady tracking shot." value={scene} onChange={setScene} onEnhance={() => onEnhance('Scene Description', scene, setScene)} multiline loading={loading['Scene Description']} />

          <div className="pt-2"><PrimaryButton onClick={onGenerate} disabled={!scene.trim()||loading['generate']} loading={loading['generate']} className="w-full">⚡ Generate Final Prompt</PrimaryButton></div>
        </section>

        <PreviewPanel value={preview} onChange={setPreview} />
      </div>
    </div>
  )
}

