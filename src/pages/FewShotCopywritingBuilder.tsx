import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const FEW_SHOT_TEMPLATE = `You are a {{Role}}. Task: {{Task}}.

Examples:
{{Examples}}

Output Format:
{{Output}}

Instructions:
- Follow the good patterns shown in the examples.
- Avoid bad ad practices.
- Keep results concise and conversion-oriented.`

export default function FewShotCopywritingBuilder() {
  const navigate = useNavigate()
  const [role, setRole] = useState('')
  const [task, setTask] = useState('')
  const [examples, setExamples] = useState('')
  const [output, setOutput] = useState('')
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
    if (!role.trim() || !task.trim() || !examples.trim() || !output.trim()) return

    setLoading((s)=>({...s, generate: true}));
    try {
      const compiled = FEW_SHOT_TEMPLATE
        .replaceAll('{{Role}}', role)
        .replaceAll('{{Task}}', task)
        .replaceAll('{{Examples}}', examples)
        .replaceAll('{{Output}}', output)

      const finalText = await polishFinalPrompt(compiled)
      setPreview(finalText)
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setLoading((s)=>({...s, generate: false}));
    }
  }

  const canGenerate = role.trim() && task.trim() && examples.trim() && output.trim()

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
            Few-Shot Copywriting Builder
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Provide 2-3 examples along with your instructions. AI will enhance your input and generate the final optimized prompt.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Fill in the details</h2>

            <InputCard
              label="Who should the AI act as?"
              placeholder="e.g., 'Grammar Corrector' / 'Coding Assistant' / 'Product Description Writer'"
              value={role}
              onChange={setRole}
              onEnhance={() => onEnhance('Role', role, setRole)}
              helpText="Define the role to set tone and expertise."
              required
              loading={loading['Role']}
            />

            <InputCard
              label="What is the AI's job?"
              placeholder="e.g., 'Correct grammar errors in sentences' / 'Write SQL queries' / 'Generate catchy ad slogans'"
              value={task}
              onChange={setTask}
              onEnhance={() => onEnhance('Task', task, setTask)}
              helpText="Describe the primary task in one line."
              required
              loading={loading['Task']}
            />

            <InputCard
              label="Provide 2-3 examples (input → output)"
              placeholder={`Input: "He go to school." → Output: "He goes to school."
Input: "I can has pizza?" → Output: "I can have pizza?"`}
              value={examples}
              onChange={setExamples}
              onEnhance={() => onEnhance('Examples', examples, setExamples)}
              helpText="AI organizes pairs into consistent format and improves clarity."
              multiline
              required
              loading={loading['Examples']}
            />

            <InputCard
              label="How should the final output look?"
              placeholder="e.g., 'Corrected sentence only' / 'SQL query in code block' / 'Ad copy in 1 sentence'"
              value={output}
              onChange={setOutput}
              onEnhance={() => onEnhance('Output', output, setOutput)}
              helpText="Specify brevity, formatting, or constraints."
              required
              loading={loading['Output']}
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
                Combine Role + Task + Examples + Output into a structured Few-Shot prompt.
              </p>
              <p className="text-xs text-gray-400 mt-1 text-center">
                Tip: Each 'Enhance' action rewrites only that specific field with clearer, more polished text.
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
