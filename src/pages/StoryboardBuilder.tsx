import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const TEMPLATE = `You are a {{RoleOrDefault}}.

Storyboard Prompt:
- Role: {{Role}}
- Style / Mood: {{Style}}
- Scene List:
{{Scenes}}

Guidance:
- Keep one scene per line with shot type, movement, subject, and timing.
- Maintain continuity in lighting, screen direction, and pacing.
- Prefer concise, visual language; avoid dialogue unless required.`

const STYLE_CHIPS = ['Cinematic', 'Moody', 'Documentary', 'Whimsical', 'Anime']

export default function StoryboardBuilder() {
  const navigate = useNavigate()
  const [role, setRole] = useState('')
  const [scenes, setScenes] = useState('')
  const [style, setStyle] = useState('')
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState<{[k:string]:boolean}>({})

  const onEnhance = async (label: string, value: string, setter: (v:string)=>void) => {
    try {
      setLoading((s)=>({...s, [label]: true}))
      const improved = await enhanceField(label, value)
      setter(improved || value)
    } finally {
      setLoading((s)=>({...s, [label]: false}))
    }
  }

  const onGenerate = async () => {
    if (!scenes.trim()) return
    setLoading((s)=>({...s, generate: true}))
    try {
      const compiled = TEMPLATE
        .replaceAll('{{RoleOrDefault}}', role.trim() || 'Director / Cinematographer')
        .replaceAll('{{Role}}', role || '(not specified)')
        .replaceAll('{{Style}}', style || '(not specified)')
        .replaceAll('{{Scenes}}', scenes)
      const finalText = await polishFinalPrompt(compiled)
      setPreview(finalText)
    } finally {
      setLoading((s)=>({...s, generate: false}))
    }
  }

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 md:px-8">
      <div className="mb-8">
        <button onClick={() => navigate('/video')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Video Techniques
        </button>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Storyboard Prompt Builder</h1>
        <p className="text-lg text-gray-600">Break your video prompt into scene-by-scene descriptions for smooth continuity.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="space-y-6">
          <InputCard
            label="Role (Optional)"
            placeholder="Director / Cinematographer"
            value={role}
            onChange={setRole}
            onEnhance={() => onEnhance('Role', role, setRole)}
            helpText="Sets creative lens and expertise."
            loading={loading['Role']}
          />

          <InputCard
            label="Scene List"
            placeholder={`Scene 1: Close-up of a bird on a branch, morning light.\nScene 2: Bird takes off slowly, wide shot, sunrise glow.`}
            value={scenes}
            onChange={setScenes}
            onEnhance={() => onEnhance('Scene List', scenes, setScenes)}
            helpText="One scene per line. Include shot type, subject, time of day, and key motion."
            multiline
            loading={loading['Scene List']}
          />

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Style / Mood</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {STYLE_CHIPS.map(c => (
                <button key={c} onClick={() => setStyle(c)} className={`px-3 py-1 rounded-full text-sm ${style===c? 'bg-primary-600 text-white':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{c}</button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Cinematic / Documentary / Anime"
                value={style}
                onChange={(e)=>setStyle(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button onClick={() => onEnhance('Style / Mood', style, setStyle)} disabled={loading['Style / Mood']} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">{loading['Style / Mood']?'⏳':'✨'} Enhance with AI</button>
            </div>
          </div>

          <div className="pt-2">
            <PrimaryButton onClick={onGenerate} disabled={!scenes.trim() || loading['generate']} loading={loading['generate']} className="w-full">⚡ Generate Final Prompt</PrimaryButton>
          </div>
        </section>

        <PreviewPanel value={preview} onChange={setPreview} />
      </div>
    </div>
  )
}

