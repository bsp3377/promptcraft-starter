import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const TEMPLATE = `You are a Research Summarizer.

Summarization Prompt:
- Source Content:\n{{Source}}
- Output Format: {{Format}}
- Compression Level: {{Compression}}

Instructions:
- Capture main thesis in 1-2 lines.
- List 3-5 key points with data/quotes if present.
- Note contradictions, assumptions, or open questions.
- End with a one-line takeaway tailored to the audience.`

const FORMAT_OPTIONS = ['Bullet points', 'Paragraph', 'Table']
const COMPRESSION_OPTIONS = ['Short', 'Medium', 'Detailed']

export default function SummarizationBuilder() {
  const navigate = useNavigate()
  const [source, setSource] = useState('')
  const [format, setFormat] = useState('Bullet points')
  const [compression, setCompression] = useState('Medium')
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState<{[k:string]:boolean}>({})

  const onEnhance = async () => {
    try { setLoading((s)=>({...s, source:true})); const improved = await enhanceField('Source Content', source); setSource(improved || source);} finally { setLoading((s)=>({...s, source:false})) }
  }

  const onGenerate = async () => {
    if (!source.trim()) return
    setLoading((s)=>({...s, generate:true}))
    try {
      const compiled = TEMPLATE
        .replaceAll('{{Source}}', source)
        .replaceAll('{{Format}}', format)
        .replaceAll('{{Compression}}', compression)
      const finalText = await polishFinalPrompt(compiled)
      setPreview(finalText)
    } finally { setLoading((s)=>({...s, generate:false})) }
  }

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 md:px-8">
      <div className="mb-8">
        <button onClick={() => navigate('/research')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Research Techniques
        </button>
      </div>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Summarization Prompt</h1>
        <p className="text-lg text-gray-600">Condense sources into key points.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <section className="space-y-6">
          <InputCard label="Input Content" placeholder="Paste article, transcript, or notes here." value={source} onChange={setSource} onEnhance={onEnhance} multiline loading={loading['source']} helpText="Max 20,000 characters" />
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Output Format</label>
              <select value={format} onChange={(e)=>setFormat(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                {FORMAT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Compression Level</label>
              <div className="flex gap-2">
                {COMPRESSION_OPTIONS.map(o => (
                  <button key={o} onClick={()=>setCompression(o)} className={`px-4 py-2 rounded-lg text-sm font-medium ${compression===o? 'bg-primary-600 text-white':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{o}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-2"><PrimaryButton onClick={onGenerate} disabled={!source.trim()||loading['generate']} loading={loading['generate']} className="w-full">Generate Summary</PrimaryButton></div>
        </section>
        <PreviewPanel value={preview} onChange={setPreview} />
      </div>
    </div>
  )
}

