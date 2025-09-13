import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const STRUCTURED_OUTPUT_TEMPLATE = `You are a {{Role}}.
Task: {{Task}}.

Input Data:
{{InputData}}

Output Structure:
{{OutputFormat}}

Rules:
- Return ONLY using the exact structure above.
- Ensure valid syntax (e.g., valid JSON if JSON is requested).
- Do not include any extra commentary outside the structure.`

const OUTPUT_FORMATS = {
  JSON: '{\n  "Title": "",\n  "Summary": "",\n  "KeyPoints": []\n}',
  Table: '| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|',
  Bullets: '• Point 1\n• Point 2\n• Point 3',
  Markdown: '# Title\n\n## Subtitle\n\n- Item 1\n- Item 2',
  Custom: ''
}

export default function StructuredOutputBuilder() {
  const navigate = useNavigate()
  const [role, setRole] = useState('')
  const [task, setTask] = useState('')
  const [outputFormat, setOutputFormat] = useState(OUTPUT_FORMATS.JSON)
  const [inputData, setInputData] = useState('')
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState('JSON')

  const handleEnhance = async (fieldLabel: string, value: string, setter: (value: string) => void) => {
    try {
      const improved = await enhanceField(fieldLabel, value)
      setter(improved)
    } catch (error) {
      console.error('Enhancement failed:', error)
    }
  }

  const handleFormatChange = (format: string) => {
    setSelectedFormat(format)
    if (format !== 'Custom') {
      setOutputFormat(OUTPUT_FORMATS[format as keyof typeof OUTPUT_FORMATS])
    }
  }

  const handleGenerate = async () => {
    if (!role.trim() || !task.trim() || !outputFormat.trim()) return

    setLoading(true)
    try {
      const compiled = STRUCTURED_OUTPUT_TEMPLATE
        .replaceAll('{{Role}}', role)
        .replaceAll('{{Task}}', task)
        .replaceAll('{{InputData}}', inputData || 'No specific input data provided')
        .replaceAll('{{OutputFormat}}', outputFormat)
      
      const finalText = await polishFinalPrompt(compiled)
      setPreview(finalText)
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const canGenerate = role.trim() && task.trim() && outputFormat.trim()

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
          Structured Output Prompt Builder
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Force AI to respond in JSON, table, bullet list, or a custom structure. Fill in the fields, enhance them with AI, and generate your final optimized prompt.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Fill in the details</h2>
          
          <InputCard
            label="Who should the AI act as? (Optional)"
            placeholder="e.g., Financial Analyst / Research Assistant / Medical Report Writer / Coding Helper"
            value={role}
            onChange={setRole}
            onEnhance={() => handleEnhance('Role', role, setRole)}
            helpText="Set a role to guide tone and expertise."
          />

          <InputCard
            label="What is the AI's job?"
            placeholder="e.g., Summarize financial data into JSON / Extract insights from research papers"
            value={task}
            onChange={setTask}
            onEnhance={() => handleEnhance('Task', task, setTask)}
            helpText="Describe the specific task requiring a structured output."
            required
          />

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <label className="font-medium text-gray-900">
                What structure should the output follow?
              </label>
              <button
                onClick={() => handleEnhance('Output Format', outputFormat, setOutputFormat)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                ✨ Enhance Format with AI
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.keys(OUTPUT_FORMATS).map((format) => (
                <button
                  key={format}
                  onClick={() => handleFormatChange(format)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedFormat === format
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>
            
            <textarea
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              placeholder="Provide a schema or layout. Use valid JSON or describe columns/bullets."
              className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none font-mono text-sm"
            />
            <p className="text-sm text-gray-500 mt-2">Provide a schema or layout. Use valid JSON or describe columns/bullets.</p>
          </div>

          <InputCard
            label="What input should the AI handle?"
            placeholder="e.g., List of expenses with categories / Article about climate change"
            value={inputData}
            onChange={setInputData}
            onEnhance={() => handleEnhance('Input Data', inputData, setInputData)}
            helpText="Paste the exact text, data, or schema for the model to structure."
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
  )
}