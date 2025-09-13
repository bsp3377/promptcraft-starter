import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const REFINEMENT_TEMPLATE = `You are a {{Role}}. Task: {{Task}}.

Text to refine:
"{{Text}}"

Constraints:
{{Constraints}}

Instructions:
- Critique the original.
- Rewrite with higher clarity, persuasion, and conversion potential.
- Respect all constraints provided.`

export default function RefinementBuilder() {
  const navigate = useNavigate()
  const [role, setRole] = useState('')
  const [task, setTask] = useState('')
  const [text, setText] = useState('')
  const [constraints, setConstraints] = useState('')
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
    if (!role.trim() || !task.trim() || !text.trim()) return

    setLoading((s)=>({...s, generate: true}));
    try {
      const compiled = REFINEMENT_TEMPLATE
        .replaceAll('{{Role}}', role)
        .replaceAll('{{Task}}', task)
        .replaceAll('{{Text}}', text)
        .replaceAll('{{Constraints}}', constraints || 'Keep it concise, clear, and conversion-oriented.')

      const finalText = await polishFinalPrompt(compiled)
      setPreview(finalText)
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setLoading((s)=>({...s, generate: false}));
    }
  }

  const canGenerate = role.trim() && task.trim() && text.trim()

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
            Refinement Copywriting Builder
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Critique & rewrite text for better conversion. Define your role, task, and text to refine. AI will enhance each input and generate the final optimized prompt.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Fill in the details</h2>

            <InputCard
              label="Who should the AI act as?"
              placeholder="e.g., 'Conversion Copywriter' / 'Marketing Strategist' / 'UX Writer'"
              value={role}
              onChange={setRole}
              onEnhance={() => onEnhance('Role', role, setRole)}
              helpText="Define the role to set expertise and approach."
              required
              loading={loading['Role']}
            />

            <InputCard
              label="What should the AI do?"
              placeholder="e.g., 'Improve landing page headline' / 'Rewrite CTA' / 'Optimize email subject line'"
              value={task}
              onChange={setTask}
              onEnhance={() => onEnhance('Task', task, setTask)}
              helpText="Clarify the specific refinement task and goals."
              required
              loading={loading['Task']}
            />

            <InputCard
              label="What text should be refined?"
              placeholder="e.g., 'Start your free trial now!' / 'Our product is amazing' / 'Click here to learn more'"
              value={text}
              onChange={setText}
              onEnhance={() => onEnhance('Text', text, setText)}
              helpText="Paste the text you want to improve and refine."
              multiline
              required
              loading={loading['Text']}
            />

            <InputCard
              label="What constraints should be followed? (Optional)"
              placeholder="e.g., 'Keep it under 10 words, focus on urgency' / 'Use emotional triggers' / 'Include a number'"
              value={constraints}
              onChange={setConstraints}
              onEnhance={() => onEnhance('Constraints', constraints, setConstraints)}
              helpText="Specify any length limits, tone requirements, or specific elements to include."
              multiline
              loading={loading['Constraints']}
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
