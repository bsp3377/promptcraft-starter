import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const CRITIC_REFINER_TEMPLATE = `Role (optional): {{Role}}
Task: {{Task}}
Critique criteria: {{Criteria}}
Refinement goal: {{Goal}}
Source text: "{{Text}}"

Final Critic & Refiner Prompt:
Act as a {{RoleOrDefault}}.
1) Critique the provided text against the criteria: {{Criteria}}.
2) List specific issues with examples and suggestions.
3) Rewrite the text incorporating fixes while preserving intent.
4) Return: a) Brief critique summary, b) Bullet list of issues, c) Refined version, d) Rationale for changes.
Keep responses concise and structured.`

const CRITERIA_OPTIONS = ['clarity', 'tone', 'grammar', 'accuracy', 'persuasiveness', 'structure', 'logic']

export default function CriticRefinerBuilder() {
  const navigate = useNavigate()
  const [role, setRole] = useState('')
  const [task, setTask] = useState('')
  const [criteria, setCriteria] = useState('')
  const [goal, setGoal] = useState('')
  const [text, setText] = useState('')
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
    if (!task.trim() || !criteria.trim() || !goal.trim() || !text.trim()) return

    setLoading((s)=>({...s, generate: true}));
    try {
      const compiled = CRITIC_REFINER_TEMPLATE
        .replaceAll('{{Role}}', role)
        .replaceAll('{{Task}}', task)
        .replaceAll('{{Criteria}}', criteria)
        .replaceAll('{{Goal}}', goal)
        .replaceAll('{{Text}}', text)
        .replaceAll('{{RoleOrDefault}}', role.trim() ? role : 'editor')

      const finalText = await polishFinalPrompt(compiled)
      setPreview(finalText)
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setLoading((s)=>({...s, generate: false}));
    }
  }

  const canGenerate = task.trim() && criteria.trim() && goal.trim() && text.trim()

  return (
    <div>
      <div className="py-12 max-w-7xl mx-auto px-4 md:px-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/category/research')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Research
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Critic & Refiner Prompt Builder</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Guide AI to first critique, then refine and improve the text with structured output.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Fill in the details</h2>

            <InputCard
              label="Who should the AI act as?"
              placeholder={`e.g., "Editor" / "Copywriting Coach" / "Code Reviewer" / "Business Consultant"`}
              value={role}
              onChange={setRole}
              onEnhance={() => onEnhance('Role', role, setRole)}
              helpText="Set a role to influence tone and conventions."
              loading={loading['Role']}
            />

            <InputCard
              label="What should the AI do?"
              placeholder={`- "Review and refine ad copy for better engagement."\n- "Critique and improve a research paper summary."\n- "Analyze and review Python code."`}
              value={task}
              onChange={setTask}
              onEnhance={() => onEnhance('Task', task, setTask)}
              helpText="Describe the critique and refinement scope."
              required
              loading={loading['Task']}
            />

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">What aspects should the AI critique?</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {CRITERIA_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setCriteria(criteria === opt ? '' : opt)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      criteria === opt ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={`e.g., "Clarity, tone, persuasiveness" / "Accuracy, structure" / "Logic, formatting"`}
                  value={criteria}
                  onChange={(e) => setCriteria(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  onClick={() => onEnhance('Criteria', criteria, setCriteria)}
                  disabled={loading['Criteria']}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {loading['Criteria'] ? '⏳' : '✨'} Enhance Criteria with AI
                </button>
              </div>
              <p className="text-xs text-gray-500">Choose a preset or specify your own criteria.</p>
            </div>

            <InputCard
              label="How should the AI improve the text after critique?"
              placeholder={`e.g., "Make it concise and persuasive" / "Rewrite in professional academic tone" / "Fix logic errors and format cleanly"`}
              value={goal}
              onChange={setGoal}
              onEnhance={() => onEnhance('Refinement goal', goal, setGoal)}
              helpText="Define the refinement objectives."
              required
              loading={loading['Refinement goal']}
            />

            <InputCard
              label="What text should the AI critique and refine?"
              placeholder={`e.g.,\n- "Our product is very good and cheap."\n- "Climate change is a small issue."\n- "Terd loop(): while True: print()"`}
              value={text}
              onChange={setText}
              onEnhance={() => onEnhance('Source text', text, setText)}
              helpText="Paste or write the source text."
              multiline
              required
              loading={loading['Source text']}
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


