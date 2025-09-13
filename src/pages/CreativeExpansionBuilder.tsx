import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const CREATIVE_EXPANSION_TEMPLATE = `Role (optional): {{Role}}
Task: {{Task}}
Expansion Quantity & Format: {{Format}}
Base Idea/Scenario: {{Idea}}

Final Creative Expansion Prompt:
Act as a {{RoleOrDefault}}. First, generate {{Quantity}} creative options in {{Format}} based on the base idea: "{{Idea}}".
Evaluate briefly which 2–3 are strongest and why. Then produce the final script/response using the best option.
Maintain originality, avoid clichés, and keep tone consistent.`

const QUANTITY_OPTIONS = ['3', '5', '10', '20']

export default function CreativeExpansionBuilder() {
  const navigate = useNavigate()
  const [role, setRole] = useState('')
  const [task, setTask] = useState('')
  const [quantity, setQuantity] = useState('')
  const [format, setFormat] = useState('')
  const [idea, setIdea] = useState('')
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
    if (!task.trim() || !idea.trim()) return

    setLoading((s)=>({...s, generate: true}));
    try {
      const roleOrDefault = role.trim() || 'a creative scriptwriter'
      const finalFormat = format.trim() || `${quantity || '10'} creative options in bullet points`
      const finalQuantity = quantity || '10'
      
      const compiled = CREATIVE_EXPANSION_TEMPLATE
        .replaceAll('{{Role}}', role || '(not specified)')
        .replaceAll('{{Task}}', task)
        .replaceAll('{{Format}}', finalFormat)
        .replaceAll('{{Idea}}', idea)
        .replaceAll('{{RoleOrDefault}}', roleOrDefault)
        .replaceAll('{{Quantity}}', finalQuantity)

      const finalText = await polishFinalPrompt(compiled)
      setPreview(finalText)
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setLoading((s)=>({...s, generate: false}));
    }
  }

  const canGenerate = task.trim() && idea.trim()

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
            Creative Expansion Prompt Builder
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ask AI to generate multiple creative options before producing the final result. Fill the fields, enhance them with AI, and generate your final optimized prompt.
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
                  placeholder="e.g., 'Scriptwriter' / 'Ad Copy Specialist' / 'Novel Author' / 'Social Media Creator'"
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
              <p className="text-xs text-gray-500">Set a role to influence tone and conventions.</p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                What should the AI do?
              </label>
              <div className="flex gap-2">
                <textarea
                  placeholder="Brainstorm 10 YouTube hook ideas before writing the intro."
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none h-20"
                />
                <button
                  onClick={() => onEnhance('Task', task, setTask)}
                  disabled={loading['Task']}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {loading['Task'] ? '⏳' : '✨'} Enhance Task with AI
                </button>
              </div>
              <p className="text-xs text-gray-500">Describe the planned expansion + final output.</p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                How many creative options should the AI provide, and in what format?
              </label>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex gap-2">
                  {QUANTITY_OPTIONS.map((qty) => (
                    <button
                      key={qty}
                      onClick={() => setQuantity(qty)}
                      className={`w-12 h-12 rounded-full text-sm font-medium transition-colors ${
                        quantity === qty
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {qty}
                    </button>
                  ))}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="10 hooks in bullet points"
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => onEnhance('Format', format, setFormat)}
                  disabled={loading['Format']}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {loading['Format'] ? '⏳' : '✨'} Enhance Format with AI
                </button>
              </div>
              <p className="text-xs text-gray-500">Pick a number or specify your own format.</p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                What is the base idea or scenario to expand on?
              </label>
              <div className="flex gap-2">
                <textarea
                  placeholder="Ad campaign for an eco-friendly water bottle targeting commuters."
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none h-24"
                />
                <button
                  onClick={() => onEnhance('Idea', idea, setIdea)}
                  disabled={loading['Idea']}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {loading['Idea'] ? '⏳' : '✨'} Enhance Idea with AI
                </button>
              </div>
              <p className="text-xs text-gray-500">Paste the idea or describe the scenario to expand.</p>
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
                You can refine any field before generating.
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
