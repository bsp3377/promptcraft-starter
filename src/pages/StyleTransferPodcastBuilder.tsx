import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const STYLE_TRANSFER_PODCAST_TEMPLATE = `Role (optional): {{Role}}
Task: {{Task}}
Desired Style/Tone: {{Style}}
Source Text/Scenario: "{{Text}}"

Final Style Transfer Prompt:
Act as a {{RoleOrDefault}}. Rewrite the provided text in a {{Style}} tone.
Preserve meaning and key details. Improve clarity, tighten phrasing, and ensure consistency.
Return only the rewritten text, no extra commentary.`

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
      const roleOrDefault = role.trim() || 'a professional scriptwriter'
      const compiled = STYLE_TRANSFER_PODCAST_TEMPLATE
        .replaceAll('{{Role}}', role || '(not specified)')
        .replaceAll('{{Task}}', task)
        .replaceAll('{{Style}}', style || 'engaging and professional')
        .replaceAll('{{Text}}', text)
        .replaceAll('{{RoleOrDefault}}', roleOrDefault)

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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Style Transfer Prompt Builder
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Guide AI to rewrite or generate text in a specific tone, voice, or style. Fill the fields, enhance with AI, and generate your final optimized prompt.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Fill in the details</h2>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Who should the AI act as? ✨ Optional
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., 'Marketing Copywriter' / 'Motivational Speaker' / 'Shakespearean Poet' / 'Professional Editor'"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  onClick={() => onEnhance('Role', role, setRole)}
                  disabled={loading['Role']}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {loading['Role'] ? '⏳' : '✨'} Enhance Role with AI
                </button>
              </div>
              <p className="text-xs text-gray-500">Set a role to guide tone and voice.</p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                ☑ What should the AI do?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Rewrite this email to sound professional."
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  onClick={() => onEnhance('Task', task, setTask)}
                  disabled={loading['Task']}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {loading['Task'] ? '⏳' : '✨'} Enhance Task with AI
                </button>
              </div>
              <p className="text-xs text-gray-500">Describe the transformation you need.</p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Which style or tone should the text follow?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., 'Casual and friendly' / 'Formal and authoritative' / 'Persuasive sales tone' / 'Poetic and dramatic'"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  onClick={() => onEnhance('Style', style, setStyle)}
                  disabled={loading['Style']}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {loading['Style'] ? '⏳' : '✨'} Enhance Style with AI
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-gray-500">Common tones</p>
                <div className="flex flex-wrap gap-2">
                  {TONE_OPTIONS.map((tone) => (
                    <button
                      key={tone}
                      onClick={() => setStyle(style === tone ? '' : tone)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        style === tone
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500">Pick a tone or write your own custom style.</p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                What text should the AI transform (or what's the scenario)?
              </label>
              <div className="flex gap-2">
                <textarea
                  placeholder="Introducing our new eco-friendly water bottle. It keeps drinks cold for 24 hours and hot for 12."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none h-24"
                />
                <button
                  onClick={() => onEnhance('Text', text, setText)}
                  disabled={loading['Text']}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {loading['Text'] ? '⏳' : '✨'} Enhance Text with AI
                </button>
              </div>
              <p className="text-xs text-gray-500">Paste the text or describe the scenario to be rewritten.</p>
            </div>

            <div className="pt-4">
              <PrimaryButton
                onClick={onGenerate}
                disabled={!canGenerate || loading['generate']}
                loading={loading['generate']}
                className="w-full"
              >
                ⚡ Generate Final Prompt
              </PrimaryButton>
              <p className="text-sm text-gray-500 mt-2 text-center">
                ⓘ You can update fields anytime before generating.
              </p>
            </div>
          </section>

          {/* Right: Preview */}
          <PreviewPanel value={preview} onChange={setPreview} />
        </div>
      </div>
    </div>
  )
}
