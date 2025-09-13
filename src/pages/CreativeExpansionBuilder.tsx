import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const CREATIVE_EXPANSION_TEMPLATE = `Role (optional): {{Role}}
Task: {{Task}}
Expansion quantity & format: {{Format}}
Base idea / scenario: {{Idea}}

Final creative expansion prompt:
Act as a {{RoleOrDefault}}. First, generate {{Quantity}} creative options in {{Format}} based on the base idea: "{{Idea}}".
Then briefly evaluate which 2–3 options are strongest and why.
Finally, produce the final deliverable (script/section/lines) using the single best option.
Maintain clarity and originality, avoid clichés, and keep tone consistent with the role.
Return the expanded options, the short evaluation, and the final output, in that order.`

const QUANTITY_OPTIONS = ['3', '5', '10', '20']

export default function CreativeExpansionBuilder() {
  const navigate = useNavigate()
  const [role, setRole] = useState('')
  const [task, setTask] = useState('')
  const [quantity, setQuantity] = useState('')
  const [format, setFormat] = useState('')
  const [idea, setIdea] = useState('')
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
    if (!task.trim() || !format.trim() || !idea.trim()) return

    setLoading((s)=>({...s, generate: true}));
    try {
      const compiled = CREATIVE_EXPANSION_TEMPLATE
        .replaceAll('{{Role}}', role)
        .replaceAll('{{Task}}', task)
        .replaceAll('{{Format}}', format)
        .replaceAll('{{Idea}}', idea)
        .replaceAll('{{Quantity}}', quantity || 'several')
        .replaceAll('{{RoleOrDefault}}', role.trim() ? role : 'scriptwriter')

      const finalText = await polishFinalPrompt(compiled)
      setPreview(finalText)
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setLoading((s)=>({...s, generate: false}));
    }
  }

  const canGenerate = task.trim() && format.trim() && idea.trim()

  return (
    <div>
      <div className="py-12 max-w-7xl mx-auto px-4 md:px-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/category/podcast-scripts')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Podcast & Scripts
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Creative Expansion Prompt Builder</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ask AI to generate multiple creative options before producing the final result. Fill the fields and enhance with AI.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Fill in the details</h2>

            <InputCard
              label="Who should the AI act as?"
              placeholder={`e.g., "Scriptwriter" / "Ad Copy Specialist" / "Novel Author" / "Social Media Creator"`}
              value={role}
              onChange={setRole}
              onEnhance={() => onEnhance('Role', role, setRole)}
              helpText="Set a role to influence tone and conventions."
              loading={loading['Role']}
            />

            <InputCard
              label="What should the AI do?"
              placeholder={`- "Brainstorm 10 YouTube hook ideas before writing the intro."\n- "Generate 5 ad headlines before creating the full copy."\n- "Suggest 3 possible plot twists before writing the story."`}
              value={task}
              onChange={setTask}
              onEnhance={() => onEnhance('Task', task, setTask)}
              helpText="Describe the planned expansion + final output."
              required
              loading={loading['Task']}
            />

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">How many creative options should the AI provide, and in what format?</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {QUANTITY_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setQuantity(quantity === opt ? '' : opt)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      quantity === opt ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={`e.g., "10 hooks in bullet points" / "5 ad headlines in a numbered list" / "3 plot ideas in short paragraphs"`}
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  onClick={() => onEnhance('Quantity & Format', `${quantity ? quantity + ' - ' : ''}${format}`, (v)=>{
                    // When enhanced, try to parse back quantity and format (best-effort)
                    setFormat(v)
                  })}
                  disabled={loading['Quantity & Format']}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {loading['Quantity & Format'] ? '⏳' : '✨'} Enhance Format with AI
                </button>
              </div>
              <p className="text-xs text-gray-500">Pick a number or specify your own format.</p>
            </div>

            <InputCard
              label="What is the base idea or scenario to expand on?"
              placeholder={`e.g.,\n- "Podcast episode on productivity hacks."\n- "Ad campaign for an eco-friendly water bottle."\n- "Story about a detective in a futuristic city."`}
              value={idea}
              onChange={setIdea}
              onEnhance={() => onEnhance('Base Idea / Scenario', idea, setIdea)}
              helpText="Paste the idea or describe the scenario to expand."
              multiline
              required
              loading={loading['Base Idea / Scenario']}
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
              <p className="text-sm text-gray-500 mt-2 text-center">You can refine any field before generating.</p>
            </div>
          </section>

          {/* Right: Preview */}
          <PreviewPanel value={preview} onChange={setPreview} />
        </div>
      </div>
    </div>
  )
}


