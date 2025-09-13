import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const REFLEXION_CODING_TEMPLATE = `Role (optional): {{Role}}
Task: {{Task}}
Refinement criteria: {{CriteriaList}}
Problem / scenario: {{ScenarioOrInput}}

Final reflexion coding prompt:
- Act as {{RoleOrDefault}}.
- First, produce an initial solution to the coding task.
- Then, perform a self-critique focusing on the selected criteria: {{CriteriaList}}.
- Finally, deliver an improved solution that addresses the critique.
- Keep responses structured and concise.`

const CODING_CRITIQUE_OPTIONS = ['performance', 'security', 'readability', 'maintainability', 'error-handling', 'testing', 'documentation', 'best-practices']

export default function ReflexionCodingBuilder() {
  const navigate = useNavigate()
  const [role, setRole] = useState('')
  const [task, setTask] = useState('')
  const [criteria, setCriteria] = useState('')
  const [selectedChips, setSelectedChips] = useState<string[]>([])
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

  const handleChipToggle = (chip: string) => {
    setSelectedChips(prev => 
      prev.includes(chip) 
        ? prev.filter(c => c !== chip)
        : [...prev, chip]
    )
  }

  const onGenerate = async () => {
    if (!task.trim() || (!criteria.trim() && selectedChips.length === 0) || !scenario.trim()) return

    setLoading((s)=>({...s, generate: true}));
    try {
      const allCriteria = [...selectedChips, ...(criteria ? [criteria] : [])].join(', ')
      const roleOrDefault = role.trim() || 'a senior code reviewer'
      
      const compiled = REFLEXION_CODING_TEMPLATE
        .replaceAll('{{Role}}', role || '(not specified)')
        .replaceAll('{{Task}}', task)
        .replaceAll('{{CriteriaList}}', allCriteria || 'code quality and best practices')
        .replaceAll('{{ScenarioOrInput}}', scenario)
        .replaceAll('{{RoleOrDefault}}', roleOrDefault)

      const finalText = await polishFinalPrompt(compiled)
      setPreview(finalText)
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setLoading((s)=>({...s, generate: false}));
    }
  }

  const canGenerate = task.trim() && (criteria.trim() || selectedChips.length > 0) && scenario.trim()

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
            Reflexion Coding Builder
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Guide AI to generate → critique → improve code solutions. Fill in each field and let AI enhance your input.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Fill in the details</h2>

            <InputCard
              label="Who should the AI act as? (Optional)"
              placeholder="e.g., 'Senior Code Reviewer' / 'Security Expert' / 'Performance Engineer' / 'Tech Lead'"
              value={role}
              onChange={setRole}
              onEnhance={() => onEnhance('Role', role, setRole)}
              helpText="Set a role to guide coding expertise and review standards."
              loading={loading['Role']}
            />

            <InputCard
              label="What coding task should the AI complete and improve?"
              placeholder={`- "Write a Python function to process user data, then critique and improve it."
- "Create a React component for data visualization, review it, and optimize."
- "Implement a sorting algorithm, analyze performance, and enhance it."
- "Build a REST API endpoint, check security, and refactor."`}
              value={task}
              onChange={setTask}
              onEnhance={() => onEnhance('Task', task, setTask)}
              helpText="Describe the full coding workflow: generate → critique → improve."
              multiline
              required
              loading={loading['Task']}
            />

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                What should the AI focus on while critiquing the code?
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {CODING_CRITIQUE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleChipToggle(option)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedChips.includes(option)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., 'Memory efficiency and scalability' / 'Security vulnerabilities' / 'Code readability and maintainability'"
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
              <p className="text-xs text-gray-500">Pick focus areas or write your own criteria.</p>
            </div>

            <InputCard
              label="What code or problem should the AI refine?"
              placeholder={`- "def process_data(data): return data.sort()"
- "const fetchUser = async (id) => { return fetch('/api/users/' + id) }"
- "A buggy Python loop that doesn't handle edge cases."
- "React component with performance issues."`}
              value={scenario}
              onChange={setScenario}
              onEnhance={() => onEnhance('Scenario', scenario, setScenario)}
              helpText="Provide the exact code, problem, or scenario to improve."
              multiline
              required
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
