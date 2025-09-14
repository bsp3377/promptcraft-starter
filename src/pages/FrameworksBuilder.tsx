import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const TEMPLATE = `You are a Management Consultant using the {{Framework}} framework.

Context: {{Context}}
Focus Areas: {{Focus}}

Task: Produce a clear, concise {{Framework}} with prioritized insights and actions.
Deliverables:
- A filled {{Framework}} structure.
- Top 5 cross-quadrant insights.
- A 30/60/90-day action plan aligned to the focus areas with owners and simple KPIs.
Style: Specific, business-oriented, action-focused.`

const PRESETS = ['SWOT', 'PESTLE', 'GTM']

export default function FrameworksBuilder() {
  const navigate = useNavigate()
  const [role, setRole] = useState('')
  const [framework, setFramework] = useState('SWOT')
  const [custom, setCustom] = useState('')
  const [context, setContext] = useState('')
  const [focus, setFocus] = useState('')
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState<{[k:string]:boolean}>({})

  const activeFramework = custom.trim() || framework

  const onEnhance = async (label: string, value: string, setter: (v:string)=>void) => {
    try { setLoading((s)=>({...s,[label]:true})); const improved = await enhanceField(label, value); setter(improved || value);} finally { setLoading((s)=>({...s,[label]:false})) }
  }

  const onGenerate = async () => {
    if (!context.trim() || !focus.trim()) return
    setLoading((s)=>({...s, generate:true}))
    try {
      const compiled = TEMPLATE
        .replaceAll('{{Framework}}', activeFramework)
        .replaceAll('{{Context}}', context)
        .replaceAll('{{Focus}}', focus)
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
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">SWOT/Framework Prompt Builder</h1>
        <p className="text-lg text-gray-600">Structure business strategies with SWOT, PESTLE, or GTM frameworks.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="space-y-6">
          <InputCard label="Role (optional)" value={role} onChange={setRole} onEnhance={() => onEnhance('Role', role, setRole)} placeholder="Management Consultant / Market Analyst" />
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Framework</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {PRESETS.map(p => (
                <button key={p} onClick={()=>{ setFramework(p); setCustom('') }} className={`px-3 py-1 rounded-full text-sm ${framework===p && !custom? 'bg-primary-600 text-white':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{p}</button>
              ))}
              <button className={`px-3 py-1 rounded-full text-sm ${custom? 'bg-primary-600 text-white':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={()=>{ if (!custom) setCustom('Custom') }}>Custom</button>
            </div>
            <input type="text" placeholder="Add custom framework name..." value={custom} onChange={(e)=>setCustom(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <InputCard label="Business Context" value={context} onChange={setContext} onEnhance={() => onEnhance('Business Context', context, setContext)} placeholder="Launching a new SaaS tool for small businesses" />
          <InputCard label="Focus Areas" value={focus} onChange={setFocus} onEnhance={() => onEnhance('Focus Areas', focus, setFocus)} placeholder="Customer acquisition, pricing strategy, competitor analysis" />
          <div className="pt-2"><PrimaryButton onClick={onGenerate} disabled={!context.trim()||!focus.trim()||loading['generate']} loading={loading['generate']} className="w-full">Generate Final Prompt</PrimaryButton></div>
        </section>
        <PreviewPanel value={preview} onChange={setPreview} />
      </div>
    </div>
  )
}

