import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const SUMMARIZATION_TEMPLATE = `Role (optional): {{Role}}
Task: {{Task}}
Output format: {{Format}}
Source text: "{{Text}}"

Final Summarization Prompt:
Act as a {{RoleOrDefault}}. Read the source text carefully and produce a concise summary in {{Format}} format.
Preserve key facts, dates, and numbers. Eliminate filler.
If the source has sections, reflect them in the structure.
Include 1–2 critical caveats if relevant.
Return only the summary in the requested format.`

const FORMAT_OPTIONS = ['Bullet Points', 'Paragraph', 'Table', 'Executive Summary']

export default function SummarizationBuilder() {
  const navigate = useNavigate()
  const [role, setRole] = useState('')
  const [task, setTask] = useState('')
  const [format, setFormat] = useState('')
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
    if (!task.trim() || !format.trim() || !text.trim()) return

    setLoading((s)=>({...s, generate: true}));
    try {
      const compiled = SUMMARIZATION_TEMPLATE
        .replaceAll('{{Role}}', role)
        .replaceAll('{{Task}}', task)
        .replaceAll('{{Format}}', format)
        .replaceAll('{{Text}}', text)
        .replaceAll('{{RoleOrDefault}}', role.trim() ? role : 'research assistant')

      const finalText = await polishFinalPrompt(compiled)
      setPreview(finalText)
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setLoading((s)=>({...s, generate: false}));
    }
  }

  const canGenerate = task.trim() && format.trim() && text.trim()

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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Summarization Prompt Builder</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Condense articles, reports, or notes into concise summaries. Fill the fields and enhance with AI.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Fill in the details</h2>

            <InputCard
              label="Who should the AI act as?"
              placeholder={`e.g., "Research Assistant" / "Journalist" / "Study Guide Creator" / "Business Analyst"`}
              value={role}
              onChange={setRole}
              onEnhance={() => onEnhance('Role', role, setRole)}
              helpText="Set a role to influence tone and conventions."
              loading={loading['Role']}
            />

            <InputCard
              label="What should the AI do?"
              placeholder={`- "Summarize a long article into 5 bullet points."\n- "Condense meeting notes into key action items."\n- "Provide a one-paragraph summary of a research paper."`}
              value={task}
              onChange={setTask}
              onEnhance={() => onEnhance('Task', task, setTask)}
              helpText="Describe the summarization goal and scope."
              required
              loading={loading['Task']}
            />

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">How should the summary be structured?</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {FORMAT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setFormat(format === opt ? '' : opt)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      format === opt ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={`e.g., "Bullet points" / "One paragraph" / "Executive summary" / "Table of main ideas"`}
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  onClick={() => onEnhance('Format/Output', format, setFormat)}
                  disabled={loading['Format/Output']}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {loading['Format/Output'] ? '⏳' : '✨'} Enhance Output with AI
                </button>
              </div>
              <p className="text-xs text-gray-500">Choose a preset or specify your own format.</p>
            </div>

            <InputCard
              label="What text should be summarized?"
              placeholder={`e.g.,\n- "Full news article text."\n- "Meeting transcript."\n- "Research report excerpt."\n- "Chapter from a history book."`}
              value={text}
              onChange={setText}
              onEnhance={() => onEnhance('Source text', text, setText)}
              helpText="Paste or describe the source content to summarize."
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


