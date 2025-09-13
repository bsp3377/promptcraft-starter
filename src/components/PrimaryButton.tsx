import { ReactNode } from 'react'

interface PrimaryButtonProps {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  className?: string
}

export default function PrimaryButton({ 
  children, 
  onClick, 
  disabled = false, 
  loading = false,
  className = ''
}: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}
