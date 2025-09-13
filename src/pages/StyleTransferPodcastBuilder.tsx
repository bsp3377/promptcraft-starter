import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const TONE_CHIPS = ['casual', 'formal', 'persuasive', 'humorous', 'poetic', 'academic']

const TEMPLATE = `Role (optional): {{Role}}
Task: {{Task}}
Desired Style/Tone: {{Style}}
Source Text/Scenario: "{{Text}}"

Final Style Transfer Prompt:
Act as a {{RoleOrDefault}}. Rewrite the provided text in a {{Style}} tone.
Preserve meaning and key details. Improve clarity, tighten phrasing, and ensure consistency.
Return only the rewritten text, no extra commentary.`

export default function StyleTransferPodcastBuilder() {
  const navigate = useNavigate()

  const [role, setRole] = useState('')
  const [task, setTask] = useState('')
  const [style, setStyle] = useState('')
  const [text, setText] = useState('')
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

  const applyChip = (tone: string) => {
    setStyle((prev) => prev ? `${prev}, ${tone}` : tone)
  }

  const onGenerate = async () => {
    if (!task.trim() || !text.trim()) return
    setLoading((s)=>({...s, generate: true}))
    try {
      const compiled = TEMPLATE
        .replaceAll('{{Role}}', role || '(not specified)')
        .replaceAll('{{Task}}', task)
        .replaceAll('{{Style}}', style || 'your best professional')
        .replaceAll('{{Text}}', text)
        .replaceAll('{{RoleOrDefault}}', role || 'skilled scriptwriter')

      const finalText = await polishFinalPrompt(compiled)
      setPreview(finalText)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading((s)=>({...s, generate: false}))
    }
  }

  const canGenerate = task.trim() && text.trim()

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 md:px-8">
      {/* Back */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/category/podcast-scripts')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Podcast & Scripts
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Style Transfer Prompt Builder</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">Guide AI to rewrite or generate text in a specific tone, voice, or style. Fill the fields, enhance with AI, and generate your final optimized prompt.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left */}
        <section className="space-y-6">
          <InputCard
            label="Who should the AI act as? (Optional)"
            placeholder="e.g., 'Marketing Copywriter' / 'Motivational Speaker' / 'Professional Editor'"
            value={role}
            onChange={setRole}
            onEnhance={() => onEnhance('Role', role, setRole)}
            helpText="Set a role to guide tone and voice."
            loading={loading['Role']}
          />

          <InputCard
            label="What should the AI do?"
            placeholder="Rewrite this script section to sound professional."
            value={task}
            onChange={setTask}
            onEnhance={() => onEnhance('Task', task, setTask)}
            helpText="Describe the transformation you need."
            multiline
            required
            loading={loading['Task']}
          />

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Which style or tone should the text follow?</label>
            <div className="flex flex-wrap gap-2">
              {TONE_CHIPS.map((tone)=> (
                <button
                  key={tone}
                  onClick={() => applyChip(tone)}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >{tone}</button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g., 'Formal and authoritative' / 'Casual and friendly' / 'Persuasive sales tone'"
                value={style}
                onChange={(e)=> setStyle(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                onClick={() => onEnhance('Style/Tone', style, setStyle)}
                disabled={loading['Style/Tone']}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >{loading['Style/Tone'] ? '⏳' : '✨'} Enhance Style with AI</button>
            </div>
          </div>

          <InputCard
            label="What text should the AI transform (or what's the scenario)?"
            placeholder="Introducing our new eco-friendly water bottle..."
            value={text}
            onChange={setText}
            onEnhance={() => onEnhance('Source Text', text, setText)}
            helpText="Paste the text or describe the scenario to be rewritten."
            multiline
            required
            loading={loading['Source Text']}
          />

          <div className="pt-2">
            <PrimaryButton
              onClick={onGenerate}
              disabled={!canGenerate || loading['generate']}
              loading={loading['generate']}
              className="w-full"
            >⚡ Generate Final Prompt</PrimaryButton>
          </div>
        </section>

        {/* Right: Preview */}
        <PreviewPanel value={preview} onChange={setPreview} />
      </div>
    </div>
  )
}


