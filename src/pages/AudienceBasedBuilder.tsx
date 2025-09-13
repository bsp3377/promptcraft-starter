import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const AUDIENCE_BASED_TEMPLATE = `Act as a {{Role}}. Task: {{Task}}.

Audience:
{{Audience}}

Scenario:
{{Scenario}}

Constraints:
- Tailor message to the audience's knowledge level.
- Keep it concise, actionable, and jargon-light.`

const AUDIENCE_OPTIONS = ['Kids', 'Students', 'Beginners', 'Professionals', 'Experts', 'General Public']

export default function AudienceBasedBuilder() {
  const navigate = useNavigate()
  const [role, setRole] = useState('')
  const [task, setTask] = useState('')
  const [audience, setAudience] = useState('')
  const [scenario, setScenario] = useState('')
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
    if (!role.trim() || !task.trim() || !audience.trim() || !scenario.trim()) return

    setLoading((s)=>({...s, generate: true}));
    try {
      const compiled = AUDIENCE_BASED_TEMPLATE
        .replaceAll('{{Role}}', role)
        .replaceAll('{{Task}}', task)
        .replaceAll('{{Audience}}', audience)
        .replaceAll('{{Scenario}}', scenario)

      const finalText = await polishFinalPrompt(compiled)
      setPreview(finalText)
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setLoading((s)=>({...s, generate: false}));
    }
  }

  const canGenerate = role.trim() && task.trim() && audience.trim() && scenario.trim()

  return (
    <div>
      <div className="py-12 max-w-7xl mx-auto px-4 md:px-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/category/copywriting')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Copywriting
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Audience-Based Copywriting Builder
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Adapt AI's response to a specific audience. Define your task, audience, and context. AI will enhance each input and generate the final optimized prompt.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Fill in the details</h2>

            <InputCard
              label="Who should the AI act as?"
              placeholder="e.g., 'Business Consultant' / 'Teacher' / 'Health Coach'"
              value={role}
              onChange={setRole}
              onEnhance={() => onEnhance('Role', role, setRole)}
              helpText="Refine the role to include domain expertise and voice traits."
              required
              loading={loading['Role']}
            />

            <InputCard
              label="What should the AI do?"
              placeholder="e.g., 'Explain investment strategy' / 'Teach fractions' / 'Suggest healthy meal plans'"
              value={task}
              onChange={setTask}
              onEnhance={() => onEnhance('Task', task, setTask)}
              helpText="Clarify deliverable, constraints, and audience benefit."
              required
              loading={loading['Task']}
            />

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Who is the target audience?
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {AUDIENCE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setAudience(audience === option ? '' : option)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      audience === option
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., 'Busy CEOs' / '10-year-old students' / 'Stay-at-home parents' / 'Beginner coders'"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  onClick={() => onEnhance('Audience', audience, setAudience)}
                  disabled={loading['Audience']}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {loading['Audience'] ? '⏳' : '✨'} Enhance Audience with AI
                </button>
              </div>
              <p className="text-xs text-gray-500">Choose a preset or type a specific audience above.</p>
            </div>

            <InputCard
              label="What is the input or situation?"
              placeholder={`- "Explain compound interest."
- "Teach how to solve x² + 5x + 6 = 0."
- "Promote a new app for homemakers."`}
              value={scenario}
              onChange={setScenario}
              onEnhance={() => onEnhance('Scenario', scenario, setScenario)}
              helpText="Paste your text or describe the scenario to adapt."
              multiline
              required
              loading={loading['Scenario']}
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
              <p className="text-sm text-gray-500 mt-2 text-center">
                You can update fields anytime before generating.
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
