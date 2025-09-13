import { Link, useLocation } from 'react-router-dom'

const builderLinks = [
  { path: '/builder/roleplay', label: 'Roleplay Builder' },
  { path: '/builder/few-shot', label: 'Few-Shot Builder' },
  { path: '/builder/structured-output', label: 'Structured Output' },
  { path: '/builder/chain-of-thought', label: 'Chain-of-Thought' },
  { path: '/builder/descriptive', label: 'Descriptive Builder' },
  { path: '/builder/multi-shot', label: 'Multi-Shot Builder' },
]

export default function BuilderHeader() {
  const location = useLocation()

  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-semibold text-lg">PromptCraft</span>
          </Link>
          
          <nav className="flex items-center gap-1 overflow-x-auto">
            {builderLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  location.pathname === link.path
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <Link 
            to="/" 
            className="inline-flex items-center rounded-full px-5 py-2.5 bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
          >
            New Prompt
          </Link>
        </div>
      </div>
    </div>
  )
}
