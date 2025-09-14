import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const TEMPLATE = `You are a Film Director.

Character Consistency Prompt:
- Identity Anchors: {{Identity}}
- Actions: {{Actions}}
- Consistency Note: {{Note}}

Guidelines:
- Maintain fixed attributes (hair, clothing, facial features) across all shots.
- Allow changes in pose and movement without altering identity.
- Keep language concise and production-ready.`

export default function CharacterConsistencyBuilder() {
  const navigate = useNavigate()
  const [identity, setIdentity] = useState('')
  const [actions, setActions] = useState('')
  const [note, setNote] = useState('')
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState<{[k:string]:boolean}>({})

  const onEnhance = async (label: string, value: string, setter: (v:string)=>void) => {
    try { setLoading((s)=>({...s,[label]:true})); const improved = await enhanceField(label,value); setter(improved||value);} finally { setLoading((s)=>({...s,[label]:false})) }
  }

  const onGenerate = async () => {
    if (!identity.trim() || !actions.trim() || !note.trim()) return
    setLoading((s)=>({...s, generate:true}))
    try {
      const compiled = TEMPLATE
        .replaceAll('{{Identity}}', identity)
        .replaceAll('{{Actions}}', actions)
        .replaceAll('{{Note}}', note)
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
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Consistent Character Prompt Builder</h1>
        <p className="text-lg text-gray-600">Describe characters with fixed identity anchors to keep them stable.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="space-y-6">
          <InputCard label="Character Identity" placeholder="A young woman with long brown hair, white cotton dress" value={identity} onChange={setIdentity} onEnhance={() => onEnhance('Character Identity', identity, setIdentity)} loading={loading['Character Identity']} />
          <InputCard label="Actions" placeholder="Walking calmly across a field" value={actions} onChange={setActions} onEnhance={() => onEnhance('Actions', actions, setActions)} loading={loading['Actions']} />
          <InputCard label="Consistency Note" placeholder="Keep appearance same throughout video." value={note} onChange={setNote} onEnhance={() => onEnhance('Consistency Note', note, setNote)} loading={loading['Consistency Note']} />
          <div className="pt-2"><PrimaryButton onClick={onGenerate} disabled={!identity.trim()||!actions.trim()||!note.trim()||loading['generate']} loading={loading['generate']} className="w-full">⚡ Generate Final Prompt</PrimaryButton></div>
        </section>
        <PreviewPanel value={preview} onChange={setPreview} />
      </div>
    </div>
  )
}

