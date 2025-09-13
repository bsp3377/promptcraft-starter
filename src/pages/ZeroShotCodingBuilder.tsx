import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const ZERO_SHOT_CODING_TEMPLATE = `Role (optional): {{Role}}
Task: {{Task}}
Output style: {{OutputStyle}}
Problem / scenario (optional): {{Scenario}}

Final zero-shot coding prompt:
- Act as {{RoleOrDefault}}.
- Complete the coding task directly using the specified output style.
- If context is provided, incorporate it precisely.
- Do not include examples or extra commentary.
- Return only what is requested in the output style.`

const CODING_OUTPUT_STYLES = ['Code Block', 'Function Only', 'Class Definition', 'API Response', 'Documentation']

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
      const roleOrDefault = role.trim() || 'a senior software developer'
      const compiled = ZERO_SHOT_CODING_TEMPLATE
        .replaceAll('{{Role}}', role || '(not specified)')
        .replaceAll('{{Task}}', task)
        .replaceAll('{{OutputStyle}}', outputStyle)
        .replaceAll('{{Scenario}}', scenario || '(not specified)')
        .replaceAll('{{RoleOrDefault}}', roleOrDefault)

      const finalText = await polishFinalPrompt(compiled)
      setPreview(finalText)
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setLoading((s)=>({...s, generate: false}));
    }
  }

  const canGenerate = task.trim() && outputStyle.trim()

  const getStyleChip = () => {
    const style = outputStyle.toLowerCase()
    if (style.includes('code block') || style.includes('```')) return 'Code Block'
    if (style.includes('function')) return 'Function Only'
    if (style.includes('class')) return 'Class Definition'
    if (style.includes('api') || style.includes('response')) return 'API Response'
    if (style.includes('doc') || style.includes('comment')) return 'Documentation'
    return 'Custom'
  }

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
            Back to Coding Assistant
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Zero-Shot Coding Builder
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ask AI to complete coding tasks directly, without examples. Define role, task, output style, and context. AI will enhance your inputs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Fill in the details</h2>

            <InputCard
              label="Who should the AI act as? (Optional)"
              placeholder="e.g., 'Python Developer' / 'React Frontend Engineer' / 'DevOps Specialist' / 'Data Scientist'"
              value={role}
              onChange={setRole}
              onEnhance={() => onEnhance('Role', role, setRole)}
              helpText="Set a role to guide coding expertise and best practices."
              loading={loading['Role']}
            />

            <InputCard
              label="What coding task should the AI complete?"
              placeholder={`- "Write a Python function to validate email addresses."
- "Create a React component for user authentication."
- "Set up a Docker configuration for a Node.js app."
- "Write SQL queries to analyze user engagement metrics."`}
              value={task}
              onChange={setTask}
              onEnhance={() => onEnhance('Task', task, setTask)}
              helpText="Describe the coding task clearly. No examples needed."
              multiline
              required
              loading={loading['Task']}
            />

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                How should the code be delivered?
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {CODING_OUTPUT_STYLES.map((style) => (
                  <button
                    key={style}
                    onClick={() => setOutputStyle(style)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      outputStyle === style
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., 'Complete function with error handling' / 'Code block with comments' / 'API response format'"
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
              <p className="text-xs text-gray-500">Choose a style or specify your own. Options: Code Block, Function Only, Class Definition, API Response, Documentation.</p>
            </div>

            <InputCard
              label="What context or constraints should the AI consider? (Optional)"
              placeholder={`- "Use Python 3.9+ and type hints."
- "Must work with React 18 and TypeScript."
- "Follow REST API conventions."
- "Optimize for performance and memory usage."`}
              value={scenario}
              onChange={setScenario}
              onEnhance={() => onEnhance('Scenario', scenario, setScenario)}
              helpText="Add any technical constraints, frameworks, or specific requirements."
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
