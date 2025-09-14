import { useState } from 'react'
import { Copy, RotateCcw, Save } from 'lucide-react'
import { savePrompt } from '../lib/supabase'

interface PreviewPanelProps {
  value: string
  onChange: (value: string) => void
  meta?: { category?: string; technique?: string; title?: string }
}

export default function PreviewPanel({ value, onChange, meta }: PreviewPanelProps) {
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

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
    // Re-focus the textarea so the user can continue editing immediately
    const el = document.querySelector<HTMLTextAreaElement>('textarea[data-preview]')
    el?.focus()
  }

  const handleSave = async () => {
    if (!value.trim()) return
    try {
      setSaving(true)
      await savePrompt({
        title: meta?.title || 'Untitled prompt',
        body: value,
        category: meta?.category || 'general',
        technique: meta?.technique || 'custom'
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      console.error(e)
      alert('Sign in to save prompts.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-fit">
      <h3 className="font-semibold text-lg text-gray-900 mb-4">Prompt Preview</h3>
      
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Your generated prompt will appear here after clicking 'Generate Final Prompt'. You can edit this text directly."
        className="w-full h-96 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none font-mono text-sm"
        data-preview
      />
      
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-60"
          disabled={saving}
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Prompt'}
        </button>
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
