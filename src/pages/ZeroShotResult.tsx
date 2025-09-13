import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

export default function ZeroShotResult() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState('')
  const [showExample, setShowExample] = useState(false)

  useEffect(() => {
    const promptParam = searchParams.get('prompt')
    if (promptParam) {
      setPrompt(decodeURIComponent(promptParam))
    }
  }, [searchParams])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const exampleOutput = `You are a Grammar Corrector.
Task: Correct grammar errors in sentences.

Examples:
Input: "He go to school." → Output: "He goes to school."
Input: "I can has pizza?" → Output: "I can have pizza."

Output: Provide corrected sentences only.`

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Optimized Prompt
          </h1>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Prompt Box */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Final Zero-Shot Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-64 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="Your optimized prompt will appear here..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
            >
              📋 Copy Prompt
            </button>
            <button
              onClick={() => setPrompt(prompt)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              ↺ Edit Again
            </button>
            <button
              onClick={() => setShowExample(!showExample)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors font-medium"
            >
              ▶ See Example Output
            </button>
          </div>

          {/* Example Output (Collapsible) */}
          {showExample && (
            <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Output</h3>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {exampleOutput}
                </pre>
              </div>
            </div>
          )}

          {/* Success Message */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Prompt enhanced and ready to use!
            </div>
          </div>
        </div>

        {/* Back to Builder */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/builder/zero-shot')}
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            ← Back to Zero-Shot Builder
          </button>
        </div>
      </div>
    </div>
  )
}
