import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const ROLEPLAY_TEMPLATE = `You are a {{Role}}.
Task: {{Task}}.

Scenario:
{{Scenario}}

Output Style:
{{OutputStyle}}

Guidelines:
- Stay in character and be helpful, concise, and accurate.
- Ask clarifying questions only when necessary.
- Follow the requested output style strictly.`

export default function RoleplayBuilder() {
  const navigate = useNavigate()
  const [role, setRole] = useState('')
  const [task, setTask] = useState('')
  const [outputStyle, setOutputStyle] = useState('')
  const [scenario, setScenario] = useState('')
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)

  const handleEnhance = async (fieldLabel: string, value: string, setter: (value: string) => void) => {
    try {
      const improved = await enhanceField(fieldLabel, value)
      setter(improved)
    } catch (error) {
      console.error('Enhancement failed:', error)
      // Could add toast notification here
    }
  }

  const handleGenerate = async () => {
    if (!role.trim() || !task.trim() || !outputStyle.trim()) return

    setLoading(true)
    try {
      const compiled = ROLEPLAY_TEMPLATE
        .replaceAll('{{Role}}', role)
        .replaceAll('{{Task}}', task)
        .replaceAll('{{Scenario}}', scenario || 'No specific scenario provided')
        .replaceAll('{{OutputStyle}}', outputStyle)
      
      const finalText = await polishFinalPrompt(compiled)
      setPreview(finalText)
    } catch (error) {
      console.error('Generation failed:', error)
      // Could add toast notification here
    } finally {
      setLoading(false)
    }
  }

  const canGenerate = role.trim() && task.trim() && outputStyle.trim()

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
          Roleplay Prompt Builder
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Define a role, task, and scenario. AI will enhance each step and generate your final optimized prompt.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Fill in the details</h2>
          
          <InputCard
            label="Who should the AI act as?"
            placeholder="e.g., Customer Support Agent / Doctor / Travel Guide"
            value={role}
            onChange={setRole}
            onEnhance={() => handleEnhance('Role', role, setRole)}
            helpText="Define the role to set tone and expertise."
            required
          />

          <InputCard
            label="What is the AI's job?"
            placeholder="e.g., Answer product questions politely / Explain symptoms and treatments / Suggest travel itineraries"
            value={task}
            onChange={setTask}
            onEnhance={() => handleEnhance('Task', task, setTask)}
            helpText="Describe the primary task in one line."
            required
          />

          <InputCard
            label="How should the response be structured?"
            placeholder="e.g., Polite chat in bullet points / Q&A format / Step-by-step guide"
            value={outputStyle}
            onChange={setOutputStyle}
            onEnhance={() => handleEnhance('Output Style', outputStyle, setOutputStyle)}
            helpText="Specify the format and tone for responses."
            required
          />

          <InputCard
            label="What situation should the AI handle?"
            placeholder="e.g., A customer asks for a refund on a damaged product / A patient describes chest pain / A tourist wants a 3-day Paris itinerary"
            value={scenario}
            onChange={setScenario}
            onEnhance={() => handleEnhance('Scenario', scenario, setScenario)}
            helpText="Describe the specific situation or context."
            multiline
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
              Enhance will polish grammar and clarity while keeping your intent. Generate produces a complete, structured prompt.
            </p>
          </div>
        </section>

        {/* Right: Preview */}
        <PreviewPanel value={preview} onChange={setPreview} />
      </div>
    </div>
  )
}
