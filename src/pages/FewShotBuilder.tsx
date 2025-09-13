import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const FEW_SHOT_TEMPLATE = `You are a {{Role}}.
Task: {{Task}}.

Examples:
{{Examples}}

Output Format:
{{OutputFormat}}

Instructions:
- Imitate the patterns demonstrated in the examples.
- Keep your answers consistent with the specified format.
- Do not explain your reasoning unless explicitly requested.`

export default function FewShotBuilder() {
  const navigate = useNavigate()
  const [role, setRole] = useState('')
  const [task, setTask] = useState('')
  const [examples, setExamples] = useState('')
  const [outputFormat, setOutputFormat] = useState('')
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)

  const handleEnhance = async (fieldLabel: string, value: string, setter: (value: string) => void) => {
    try {
      const improved = await enhanceField(fieldLabel, value)
      setter(improved)
    } catch (error) {
      console.error('Enhancement failed:', error)
    }
  }

  const handleGenerate = async () => {
    if (!role.trim() || !task.trim() || !examples.trim() || !outputFormat.trim()) return

    setLoading(true)
    try {
      const compiled = FEW_SHOT_TEMPLATE
        .replaceAll('{{Role}}', role)
        .replaceAll('{{Task}}', task)
        .replaceAll('{{Examples}}', examples)
        .replaceAll('{{OutputFormat}}', outputFormat)
      
      const finalText = await polishFinalPrompt(compiled)
      setPreview(finalText)
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const canGenerate = role.trim() && task.trim() && examples.trim() && outputFormat.trim()

  return (
    <div className="py-12">
      {/* Back Navigation */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/chatbot')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Few-Shot Prompt Builder
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
            placeholder="e.g., Grammar Corrector / Coding Assistant / Product Description Writer"
            value={role}
            onChange={setRole}
            onEnhance={() => handleEnhance('Role', role, setRole)}
            helpText="Define the role to set tone and expertise."
            required
          />

          <InputCard
            label="What is the AI's job?"
            placeholder="e.g., Correct grammar errors in sentences / Write SQL queries / Generate catchy ad slogans"
            value={task}
            onChange={setTask}
            onEnhance={() => handleEnhance('Task', task, setTask)}
            helpText="Describe the primary task in one line."
            required
          />

          <InputCard
            label="Provide 2-3 examples (input → output)"
            placeholder={`Input: "He go to school." → Output: "He goes to school."
Input: "I can has pizza?" → Output: "I can have pizza?"`}
            value={examples}
            onChange={setExamples}
            onEnhance={() => handleEnhance('Examples', examples, setExamples)}
            helpText="AI organizes pairs into consistent format and improves clarity."
            multiline
            required
          />

          <InputCard
            label="How should the final output look?"
            placeholder="e.g., Corrected sentence only / SQL query in code block / Ad copy in 1 sentence"
            value={outputFormat}
            onChange={setOutputFormat}
            onEnhance={() => handleEnhance('Output Format', outputFormat, setOutputFormat)}
            helpText="Specify brevity, formatting, or constraints."
            required
          />

          <div className="pt-4">
            <PrimaryButton
              onClick={handleGenerate}
              disabled={!canGenerate}
              loading={loading}
              className="w-full"
            >
              ⚡ Generate Final Prompt
            </PrimaryButton>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Combine Role + Task + Examples + Output into a structured Few-Shot prompt.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Each "Enhance" action rewrites only that specific field with clearer, more polished text.
            </p>
          </div>
        </section>

        {/* Right: Preview */}
        <PreviewPanel value={preview} onChange={setPreview} />
      </div>
    </div>
  )
}
