import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import BuilderHeader from '../components/BuilderHeader'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const ROLEPLAY_TEMPLATE = `Role: {{Role}}
Task: {{Task}}
Output Style: {{OutputStyle}}
Scenario: {{Scenario}}
Final role prompt: "Act as an expert {{Role}}. {{Task}} Deliver the response as {{OutputStyle}} for this scenario: {{Scenario}} Ask clarifying questions if needed and provide helpful, accurate guidance."`

export default function RoleplayBuilder() {
  const navigate = useNavigate()
  const [role, setRole] = useState('Travel Guide')
  const [task, setTask] = useState('Suggest a 5-day Italy travel itinerary.')
  const [outputStyle, setOutputStyle] = useState('Step-by-step guide')
  const [scenario, setScenario] = useState('A traveler wants budget options in Rome.')
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedOutputStyle, setSelectedOutputStyle] = useState('Steps')

  const outputStyleOptions = ['Report', 'Steps', 'Bullets', 'Narrative', 'Q&A']

  const handleEnhance = async (fieldLabel: string, value: string, setter: (value: string) => void) => {
    try {
      const improved = await enhanceField(fieldLabel, value)
      setter(improved)
    } catch (error) {
      console.error('Enhancement failed:', error)
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
    } finally {
      setLoading(false)
    }
  }

  const canGenerate = role.trim() && task.trim() && outputStyle.trim()

  return (
    <div>
      <BuilderHeader />
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
          Role Prompt Builder
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Define the role, task, and context. AI will enhance your inputs and generate the final optimized prompt.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Fill in the details</h2>
          
          <InputCard
            label="Who should the AI act as?"
            placeholder="e.g., Doctor / Travel Guide / Fashion Photographer / Business Consultant"
            value={role}
            onChange={setRole}
            onEnhance={() => handleEnhance('Role', role, setRole)}
            helpText="Set a clear role to anchor tone and expertise."
            required
          />

          <InputCard
            label="What is the AI's job in this role?"
            placeholder="e.g., Give medical advice on healthy eating / Suggest a 5-day Italy travel itinerary / Describe how to photograph fashion models in natural light / Advise a startup on scaling strategy"
            value={task}
            onChange={setTask}
            onEnhance={() => handleEnhance('Task', task, setTask)}
            helpText="Describe the main objective in one sentence."
            required
          />

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <label className="font-medium text-gray-900">
                How should the response be delivered?
              </label>
              <button
                onClick={() => handleEnhance('Output Style', outputStyle, setOutputStyle)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                ✨ Enhance Output with AI
              </button>
            </div>
            
            <input
              type="text"
              placeholder="e.g., In a professional report / Casual conversational tone / Step-by-step guide / Bullet points"
              value={outputStyle}
              onChange={(e) => setOutputStyle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none mb-4"
            />
            
            <div className="flex flex-wrap gap-2 mb-4">
              {outputStyleOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSelectedOutputStyle(option)
                    setOutputStyle(option === 'Steps' ? 'Step-by-step guide' : 
                                 option === 'Bullets' ? 'Bullet points' :
                                 option === 'Q&A' ? 'Q&A format' :
                                 option === 'Report' ? 'Professional report' :
                                 'Narrative style')
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedOutputStyle === option
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            
            <p className="text-sm text-gray-500">Pick a delivery format to match your audience.</p>
          </div>

          <InputCard
            label="What input or situation should the AI respond to?"
            placeholder="e.g., A patient asks for a diet plan for diabetes / A traveler wants budget options in Rome / A model shoot in outdoor daylight / A business wants to expand into new markets"
            value={scenario}
            onChange={setScenario}
            onEnhance={() => handleEnhance('Scenario', scenario, setScenario)}
            helpText="Provide any constraints, preferences, or examples."
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
