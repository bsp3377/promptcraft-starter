import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const ZERO_SHOT_CODING_TEMPLATE = `Role (optional): {{Role}}
Task: {{Task}}
Output style: "{{Output}}"
Problem / scenario (optional): "{{Scenario}}"

Final zero-shot prompt:
Act as a {{RoleOrDefault}}. Complete the task directly using the specified output style.
If context is provided, incorporate it precisely. Do not include examples or extra commentary.
Return only what is requested in the output style.`

const OUTPUT_OPTIONS = ['Code', 'Steps', 'Bullets', 'Table', 'Narrative']

export default function ZeroShotCodingBuilder() {
  const navigate = useNavigate()
  const [role, setRole] = useState('')
  const [task, setTask] = useState('')
  const [outputStyle, setOutputStyle] = useState('')
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
    if (!task.trim() || !outputStyle.trim()) return

    setLoading((s)=>({...s, generate: true}));
    try {
      const compiled = ZERO_SHOT_CODING_TEMPLATE
        .replaceAll('{{Role}}', role)
        .replaceAll('{{Task}}', task)
        .replaceAll('{{Output}}', outputStyle)
        .replaceAll('{{Scenario}}', scenario)
        .replaceAll('{{RoleOrDefault}}', role.trim() ? role : 'developer')

      const finalText = await polishFinalPrompt(compiled)
      setPreview(finalText)
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setLoading((s)=>({...s, generate: false}));
    }
  }

  const canGenerate = task.trim() && outputStyle.trim()

  return (
    <div>
      <div className="py-12 max-w-7xl mx-auto px-4 md:px-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/coding')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Coding Assistance
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Zero-Shot Prompt Builder</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ask AI to complete a coding task directly, without examples. Define role, task, output style, and scenario. AI will enhance your inputs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Fill in the details</h2>

            <InputCard
              label="Who should the AI act as?"
              placeholder={`e.g., "Python Developer" / "Travel Planner" / "Fitness Coach" / "Research Assistant"`}
              value={role}
              onChange={setRole}
              onEnhance={() => onEnhance('Role', role, setRole)}
              helpText="Set a role to guide tone and domain expertise, or leave blank."
              loading={loading['Role']}
            />

            <InputCard
              label="What should the AI do?"
              placeholder={`- "Write a Python function to check if a number is prime."\n- "Plan a 3-day trip to Rome."\n- "Summarize the article in 3 bullet points."`}
              value={task}
              onChange={setTask}
              onEnhance={() => onEnhance('Task', task, setTask)}
              helpText="Describe the task plainly. No examples needed."
              required
              loading={loading['Task']}
            />

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">How should the response be delivered?</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {OUTPUT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setOutputStyle(outputStyle === opt ? '' : opt)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      outputStyle === opt ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={`e.g., "Code only, inside a code block." / "Step-by-step guide." / "Concise bullet list."`}
                  value={outputStyle}
                  onChange={(e) => setOutputStyle(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  onClick={() => onEnhance('Output Style', outputStyle, setOutputStyle)}
                  disabled={loading['Output Style']}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {loading['Output Style'] ? '⏳' : '✨'} Enhance Output with AI
                </button>
              </div>
              <p className="text-xs text-gray-500">Choose a style or specify your own. Options: Code, Steps, Bullets, Table, Narrative.</p>
            </div>

            <InputCard
              label="What data, context, or situation should the AI handle?"
              placeholder={`e.g.,\n- "Check the number 29 for primality."\n- "The traveler wants budget-friendly recommendations."\n- "A buggy Python loop that doesn't stop."`}
              value={scenario}
              onChange={setScenario}
              onEnhance={() => onEnhance('Scenario', scenario, setScenario)}
              helpText="Add any details AI should use when completing the task."
              multiline
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


