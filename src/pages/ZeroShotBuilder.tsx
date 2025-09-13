import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const ZERO_SHOT_TEMPLATE = `Role (optional): {{Role}}
Task: {{Task}}
Output style: {{OutputStyle}}
Problem / scenario (optional): {{Scenario}}

Final zero-shot prompt:
- Act as {{RoleOrDefault}}.
- Complete the task directly using the specified output style.
- If context is provided, incorporate it precisely.
- Do not include examples or extra commentary.
- Return only what is requested in the output style.`

const OUTPUT_STYLES = ['Code', 'Steps', 'Bullets', 'Table', 'Narrative']

export default function ZeroShotBuilder() {
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
      const roleOrDefault = role.trim() || 'a capable assistant'
      const compiled = ZERO_SHOT_TEMPLATE
        .replaceAll('{{Role}}', role || '(not specified)')
        .replaceAll('{{Task}}', task)
        .replaceAll('{{OutputStyle}}', outputStyle)
        .replaceAll('{{Scenario}}', scenario || '(not specified)')
        .replaceAll('{{RoleOrDefault}}', roleOrDefault)

      const finalText = await polishFinalPrompt(compiled)
      setPreview(finalText)
      
      // Navigate to result page with the generated prompt
      const encodedPrompt = encodeURIComponent(finalText)
      navigate(`/builder/zero-shot/result?prompt=${encodedPrompt}`)
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setLoading((s)=>({...s, generate: false}));
    }
  }

  const canGenerate = task.trim() && outputStyle.trim()

  const getStyleChip = () => {
    const style = outputStyle.toLowerCase()
    if (style.includes('code')) return 'Code'
    if (style.includes('step')) return 'Steps'
    if (style.includes('bullet')) return 'Bullets'
    if (style.includes('table')) return 'Table'
    if (style.includes('narrative') || style.includes('story')) return 'Narrative'
    return 'Custom'
  }

  return (
    <div>
      <div className="py-12 max-w-7xl mx-auto px-4 md:px-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Zero-Shot Prompt Builder
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ask AI to complete a task directly, without examples. Define role, task, output style, and scenario. AI will enhance your inputs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Fill in the details</h2>

            <InputCard
              label="Who should the AI act as? (Optional)"
              placeholder="e.g., 'Python Developer' / 'Travel Planner' / 'Fitness Coach' / 'Research Assistant'"
              value={role}
              onChange={setRole}
              onEnhance={() => onEnhance('Role', role, setRole)}
              helpText="Set a role to guide tone and domain expertise, or leave blank."
              loading={loading['Role']}
            />

            <InputCard
              label="What should the AI do?"
              placeholder={`- "Write a Python function to check if a number is prime."
- "Plan a 3-day trip to Rome."
- "Suggest a 7-day diet plan for weight loss."
- "Summarize the article in 3 bullet points."`}
              value={task}
              onChange={setTask}
              onEnhance={() => onEnhance('Task', task, setTask)}
              helpText="Describe the task plainly. No examples needed."
              multiline
              required
              loading={loading['Task']}
            />

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                How should the response be delivered?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., 'Code only, inside a code block.' / 'Step-by-step guide.' / 'Table format.' / 'Concise bullet list.'"
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
              {outputStyle && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Style:</span>
                  <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium">
                    {getStyleChip()}
                  </span>
                </div>
              )}
              <p className="text-xs text-gray-500">Choose a style or specify your own. Options: Code, Steps, Bullets, Table, Narrative.</p>
            </div>

            <InputCard
              label="What data, context, or situation should the AI handle? (Optional)"
              placeholder={`- "Check the number 29 for primality."
- "The traveler wants budget-friendly recommendations."
- "A person weighs 80kg and wants to lose 5kg in a month."
- "Article is about climate change and agriculture."`}
              value={scenario}
              onChange={setScenario}
              onEnhance={() => onEnhance('Scenario', scenario, setScenario)}
              helpText="Add any details the AI should use when completing the task."
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
