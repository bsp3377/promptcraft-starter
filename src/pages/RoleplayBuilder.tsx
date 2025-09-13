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
    if (!role.trim() || !task.trim() || !outputStyle.trim()) return

    setLoading((s)=>({...s, generate: true}));
    try {
      const compiled = ROLEPLAY_TEMPLATE
        .replaceAll('{{Role}}', role)
        .replaceAll('{{Task}}', task)
        .replaceAll('{{Scenario}}', scenario)
        .replaceAll('{{OutputStyle}}', outputStyle)

      const finalText = await polishFinalPrompt(compiled)
      setPreview(finalText)
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setLoading((s)=>({...s, generate: false}));
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
            label="Role"
            placeholder="e.g., Travel Guide"
            value={role}
            onChange={setRole}
            onEnhance={() => onEnhance('Role', role, setRole)}
            helpText="Set a clear role to anchor tone and expertise."
            required
            loading={loading['Role']}
          />

          <InputCard
            label="Task"
            placeholder="e.g., Suggest a 5-day Italy travel itinerary."
            value={task}
            onChange={setTask}
            onEnhance={() => onEnhance('Task', task, setTask)}
            helpText="Describe the main objective in one sentence."
            required
            loading={loading['Task']}
          />

          <InputCard
            label="Output Style"
            placeholder="e.g., Step-by-step guide"
            value={outputStyle}
            onChange={setOutputStyle}
            onEnhance={() => onEnhance('Output Style', outputStyle, setOutputStyle)}
            helpText="Pick a delivery format to match your audience."
            required
            loading={loading['Output Style']}
          />

          <InputCard
            label="Scenario"
            placeholder="e.g., A traveler wants budget options in Rome."
            value={scenario}
            onChange={setScenario}
            onEnhance={() => onEnhance('Scenario', scenario, setScenario)}
            helpText="Provide any constraints, preferences, or examples."
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
              You can update fields anytime before generating.
            </p>
          </div>
        </section>

        {/* Right: Preview */}
        <PreviewPanel value={preview} onChange={setPreview} />
      </div>
    </div>
  )
}