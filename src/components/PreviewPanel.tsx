import { useState } from 'react'
import { Copy, RotateCcw } from 'lucide-react'

interface PreviewPanelProps {
  value: string
  onChange: (value: string) => void
}

export default function PreviewPanel({ value, onChange }: PreviewPanelProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleEditAgain = () => {
    // This keeps the textarea editable, so onChange will handle updates
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-fit">
      <h3 className="font-semibold text-lg text-gray-900 mb-4">Prompt Preview</h3>
      
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Your generated prompt will appear here after clicking 'Generate Final Prompt'. You can edit this text directly."
        className="w-full h-96 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none font-mono text-sm"
      />
      
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Copy className="w-4 h-4" />
          {copied ? 'Copied!' : 'Copy Prompt'}
        </button>
        
        <button
          onClick={handleEditAgain}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Edit Again
        </button>
      </div>
    </div>
  )
}
