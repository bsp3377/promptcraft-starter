import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const STYLE_TRANSFER_PODCAST_TEMPLATE = `Role (optional): {{Role}}
Task: {{Task}}
Desired style / tone: {{Style}}
Source text / scenario: "{{Text}}"

Final style transfer prompt:
Act as a {{RoleOrDefault}}. Rewrite the provided text in a {{Style}} tone.
Preserve original meaning and key details. Avoid adding new claims.
Improve clarity, tighten phrasing, and ensure consistent voice.
Return only the rewritten text without extra commentary.
If critical context is missing, request concise clarification first.`

const TONE_OPTIONS = ['casual', 'formal', 'persuasive', 'humorous', 'poetic', 'academic']

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
      setLoading((s)=>({...s, [label]: true}));
      const improved = await enhanceField(label, value);
      setter(improved || value);
    } finally {
      setLoading((s)=>({...s, [label]: false}));
    }
  }

  const onGenerate = async () => {
    if (!task.trim() || !text.trim()) return

    setLoading((s)=>({...s, generate: true}));
    try {
      const compiled = STYLE_TRANSFER_PODCAST_TEMPLATE
        .replaceAll('{{Role}}', role)
        .replaceAll('{{Task}}', task)
        .replaceAll('{{Style}}', style)
        .replaceAll('{{Text}}', text)
        .replaceAll('{{RoleOrDefault}}', role.trim() ? role : 'scriptwriter')

      const finalText = await polishFinalPrompt(compiled)
      setPreview(finalText)
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setLoading((s)=>({...s, generate: false}));
    }
  }

  const canGenerate = task.trim() && text.trim()

  return (
    <div>
      <div className="py-12 max-w-7xl mx-auto px-4 md:px-8">
        {/* Back Navigation */}
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Style Transfer Prompt Builder</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Guide AI to rewrite or generate scripts in a specific tone, voice, or style. Fill the fields and enhance with AI.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Fill in the details</h2>

            <InputCard
              label="Who should the AI act as?"
              placeholder="e.g., 'Marketing Copywriter' / 'Motivational Speaker' / 'Shakespearean Poet' / 'Professional Editor'"
              value={role}
              onChange={setRole}
              onEnhance={() => onEnhance('Role', role, setRole)}
              helpText="Set a role to guide tone and voice."
              loading={loading['Role']}
            />

            <InputCard
              label="What should the AI do?"
              placeholder={`- "Rewrite this email to sound professional."\n- "Make ad copy persuasive."\n- "Explain quantum physics in a funny tone."\n- "Transform notes into a formal report."`}
              value={task}
              onChange={setTask}
              onEnhance={() => onEnhance('Task', task, setTask)}
              helpText="Describe the transformation you need."
              required
              loading={loading['Task']}
            />

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Which style or tone should the text follow?</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {TONE_OPTIONS.map((tone) => (
                  <button
                    key={tone}
                    onClick={() => setStyle(style === tone ? '' : tone)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      style === tone ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={`e.g., 'Casual and friendly' / 'Formal and authoritative' / 'Persuasive sales tone' / 'Poetic, Shakespeare-style'`}
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  onClick={() => onEnhance('Style/Tone', style, setStyle)}
                  disabled={loading['Style/Tone']}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                  aria-label="Enhance Style with AI"
                >
                  {loading['Style/Tone'] ? '⏳' : '✨'} Enhance Style with AI
                </button>
              </div>
              <p className="text-xs text-gray-500">Pick a tone or write your own custom style.</p>
            </div>

            <InputCard
              label="What text should the AI transform (or what's the scenario)?"
              placeholder={`- "Introducing our new eco-friendly water bottle."\n- "Meeting postponed to next Monday."\n- "Explain quantum physics to children."`}
              value={text}
              onChange={setText}
              onEnhance={() => onEnhance('Text', text, setText)}
              helpText="Paste the text or describe the scenario to be rewritten."
              multiline
              required
              loading={loading['Text']}
            />

            <div className="pt-4">
              <PrimaryButton
                onClick={onGenerate}
                disabled={!canGenerate || loading['generate']}
                loading={loading['generate']}
                className="w-full"
              >
                ⚡ Generate Final Prompt
              </PrimaryButton>
              <p className="text-sm text-gray-500 mt-2 text-center">You can update fields anytime before generating.</p>
            </div>
          </section>

          {/* Right: Preview */}
          <PreviewPanel value={preview} onChange={setPreview} />
        </div>
      </div>
    </div>
  )
}


