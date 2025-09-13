import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const MULTI_SHOT_TEMPLATE = `Role (optional): {{Role}}
Examples:
1) Input: "{{Example1Input}}" Output: "{{Example1Output}}"
2) Input: "{{Example2Input}}" → Output: "{{Example2Output}}"
3) Input: "{{Example3Input}}" → Output: "{{Example3Output}}"
New request: "{{NewRequest}}"
Final multi-shot prompt: "Act as a {{Role}}. Study the reference pairs and mirror their correction style (minimal edits, preserve meaning). For the new request, return only the corrected sentence and a brief rationale (<=20 words). If the input is already correct, confirm and offer one alternative phrasing. Avoid changing proper nouns or tone."`

export default function MultiShotBuilder() {
  const navigate = useNavigate()
  const [role, setRole] = useState('Grammar Corrector')
  const [example1Input, setExample1Input] = useState('He go to school.')
  const [example1Output, setExample1Output] = useState('He goes to school.')
  const [example2Input, setExample2Input] = useState('I can has pizza?')
  const [example2Output, setExample2Output] = useState('I can have pizza.')
  const [example3Input, setExample3Input] = useState('He are happy.')
  const [example3Output, setExample3Output] = useState('He is happy.')
  const [newRequest, setNewRequest] = useState('Correct grammar in this new sentence: She don\'t like pizza.')
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
    if (!example1Input.trim() || !example1Output.trim() || !example2Input.trim() || !example2Output.trim()) return

    setLoading(true)
    try {
      const compiled = MULTI_SHOT_TEMPLATE
        .replaceAll('{{Role}}', role || 'AI Assistant')
        .replaceAll('{{Example1Input}}', example1Input)
        .replaceAll('{{Example1Output}}', example1Output)
        .replaceAll('{{Example2Input}}', example2Input)
        .replaceAll('{{Example2Output}}', example2Output)
        .replaceAll('{{Example3Input}}', example3Input)
        .replaceAll('{{Example3Output}}', example3Output)
        .replaceAll('{{NewRequest}}', newRequest)
      
      const finalText = await polishFinalPrompt(compiled)
      setPreview(finalText)
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const canGenerate = example1Input.trim() && example1Output.trim() && example2Input.trim() && example2Output.trim()

  return (
    <div className="py-12">
      {/* Back Navigation */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/image')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Multi-Shot Prompt Builder
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Provide multiple input-output examples to guide the AI's response style. Enhance each example and create the final optimized prompt.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Fill in the details</h2>
          
          <InputCard
            label="Who should the AI act as? (Optional)"
            placeholder="e.g., Grammar Corrector / Coding Assistant / Product Description Writer"
            value={role}
            onChange={setRole}
            onEnhance={() => handleEnhance('Role', role, setRole)}
            helpText="Set a role to anchor expertise and tone, or leave blank."
          />

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <label className="font-medium text-gray-900">
                First reference example (input → output)
              </label>
              <button
                onClick={() => handleEnhance('Example 1', `${example1Input} → ${example1Output}`, (value) => {
                  const parts = value.split(' → ')
                  if (parts.length === 2) {
                    setExample1Input(parts[0].trim())
                    setExample1Output(parts[1].trim())
                  }
                })}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                ✨ Enhance Example 1 with AI
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Input</label>
                <textarea
                  value={example1Input}
                  onChange={(e) => setExample1Input(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Output</label>
                <textarea
                  value={example1Output}
                  onChange={(e) => setExample1Output(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                  rows={2}
                />
              </div>
            </div>
            
            <p className="text-sm text-gray-500">Provide a concise before/after pair.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <label className="font-medium text-gray-900">
                Second reference example (input → output)
              </label>
              <button
                onClick={() => handleEnhance('Example 2', `${example2Input} → ${example2Output}`, (value) => {
                  const parts = value.split(' → ')
                  if (parts.length === 2) {
                    setExample2Input(parts[0].trim())
                    setExample2Output(parts[1].trim())
                  }
                })}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                ✨ Enhance Example 2 with AI
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Input</label>
                <textarea
                  value={example2Input}
                  onChange={(e) => setExample2Input(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Output</label>
                <textarea
                  value={example2Output}
                  onChange={(e) => setExample2Output(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                  rows={2}
                />
              </div>
            </div>
            
            <p className="text-sm text-gray-500">Keep format consistent with Example 1.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <label className="font-medium text-gray-900">
                Third reference example (input → output) (Optional)
              </label>
              <button
                onClick={() => handleEnhance('Example 3', `${example3Input} → ${example3Output}`, (value) => {
                  const parts = value.split(' → ')
                  if (parts.length === 2) {
                    setExample3Input(parts[0].trim())
                    setExample3Output(parts[1].trim())
                  }
                })}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                ✨ Enhance Example 3 with AI
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Input</label>
                <textarea
                  value={example3Input}
                  onChange={(e) => setExample3Input(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Output</label>
                <textarea
                  value={example3Output}
                  onChange={(e) => setExample3Output(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                  rows={2}
                />
              </div>
            </div>
            
            <p className="text-sm text-gray-500">Add a third pair to improve consistency.</p>
          </div>

          <InputCard
            label="What should the AI do now using the examples?"
            placeholder="e.g., Correct grammar in this new sentence: She don't like pizza."
            value={newRequest}
            onChange={setNewRequest}
            onEnhance={() => handleEnhance('New Request', newRequest, setNewRequest)}
            helpText="Describe the new task clearly; the AI will mimic the examples."
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
