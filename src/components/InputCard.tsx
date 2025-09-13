import { useState } from 'react'
import { Sparkles } from 'lucide-react'

interface InputCardProps {
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
  helpText?: string
  onEnhance: () => Promise<void>
  loading?: boolean
  required?: boolean
}

export default function InputCard({
  label,
  placeholder,
  value,
  onChange,
  multiline = false,
  helpText,
  onEnhance,
  loading = false,
  required = false
}: InputCardProps) {
  const [isEnhancing, setIsEnhancing] = useState(false)

  const handleEnhance = async () => {
    if (isEnhancing || !value.trim()) return
    
    setIsEnhancing(true)
    try {
      await onEnhance()
    } catch (error) {
      console.error('Enhancement failed:', error)
    } finally {
      setIsEnhancing(false)
    }
  }

  const InputComponent = multiline ? 'textarea' : 'input'

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <label className="font-medium text-gray-900">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <button
          onClick={handleEnhance}
          disabled={isEnhancing || !value.trim()}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label={`Enhance ${label} field with AI`}
        >
          <Sparkles className="w-4 h-4" />
          {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
        </button>
      </div>
      
      <InputComponent
        type={multiline ? undefined : 'text'}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
        rows={multiline ? 4 : undefined}
      />
      
      {helpText && (
        <p className="text-sm text-gray-500 mt-2">{helpText}</p>
      )}
    </div>
  )
}
