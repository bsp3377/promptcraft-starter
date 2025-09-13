import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const CHAIN_OF_THOUGHT_TEMPLATE = `You are a {{Role}}.
Task: {{Task}}.

Problem:
{{Scenario}}

Output:
{{OutputFormat}}

Reasoning Rules:
- First, show your reasoning step-by-step.
- Then, provide a concise final answer.`

export default function ChainOfThoughtBuilder() {
  const navigate = useNavigate()
  const [role, setRole] = useState('')
  const [task, setTask] = useState('')
  const [outputFormat, setOutputFormat] = useState('1) Reasoning steps\n2) Final Answer')
  const [scenario, setScenario] = useState('')
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
    if (!role.trim() || !task.trim() || !outputFormat.trim() || !scenario.trim()) return

    setLoading(true)
    try {
      const compiled = CHAIN_OF_THOUGHT_TEMPLATE
        .replaceAll('{{Role}}', role)
        .replaceAll('{{Task}}', task)
        .replaceAll('{{Scenario}}', scenario)
        .replaceAll('{{OutputFormat}}', outputFormat)
      
      const finalText = await polishFinalPrompt(compiled)
      setPreview(finalText)
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const canGenerate = role.trim() && task.trim() && outputFormat.trim() && scenario.trim()

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
          Chain-of-Thought Prompt Builder
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Guide AI to reason step by step before answering. Fill in details below and AI will enhance your input.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Fill in the details</h2>
          
          <InputCard
            label="Who should the AI act as?"
            placeholder="e.g., Math Tutor / Shopping Assistant / Business Analyst"
            value={role}
            onChange={setRole}
            onEnhance={() => handleEnhance('Role', role, setRole)}
            helpText="Define the role to set tone and expertise."
            required
          />

          <InputCard
            label="What should the AI do step by step?"
            placeholder="e.g., Solve math problems with reasoning / Calculate shopping bill with discounts / Explain investment risks logically"
            value={task}
            onChange={setTask}
            onEnhance={() => handleEnhance('Task', task, setTask)}
            helpText="Describe the primary task; encourage reasoning."
            required
          />

          <InputCard
            label="How should the response be structured?"
            placeholder="e.g., 1) Reasoning steps 2) Final Answer / Detailed explanation followed by summary / Table with step-by-step logic"
            value={outputFormat}
            onChange={setOutputFormat}
            onEnhance={() => handleEnhance('Output Format', outputFormat, setOutputFormat)}
            helpText="Specify the order: reasoning first, then the final answer."
            required
          />

          <InputCard
            label="What problem or scenario should the AI solve?"
            placeholder="e.g., Math problems, business scenarios, logical puzzles"
            value={scenario}
            onChange={setScenario}
            onEnhance={() => handleEnhance('Scenario', scenario, setScenario)}
            helpText="Provide the exact problem or context to solve."
            multiline
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
              Merge Role + Task + Output + Scenario into one optimized Chain-of-Thought prompt.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Each "Enhance" action polishes only that specific field for grammar, clarity, and useful detail.
            </p>
          </div>
        </section>

        {/* Right: Preview */}
        <PreviewPanel value={preview} onChange={setPreview} />
      </div>
    </div>
  )
}