import { useNavigate } from 'react-router-dom'
import { ArrowLeft, PenTool, Target, Users, RefreshCw } from 'lucide-react'

const techniques = [
  {
    id: 'style-transfer',
    title: 'Style Transfer Prompt',
    description: 'Rewrite text in casual, professional, or persuasive tone.',
    icon: <PenTool className="w-6 h-6" />
  },
  {
    id: 'few-shot',
    title: 'Few-Shot Prompt',
    description: 'Learn from good/bad ad examples to imitate style.',
    icon: <Target className="w-6 h-6" />
  },
  {
    id: 'audience-based',
    title: 'Audience-Based Prompt',
    description: 'Write for specific groups like CEOs, students, or parents.',
    icon: <Users className="w-6 h-6" />
  },
  {
    id: 'refinement',
    title: 'Refinement Prompt',
    description: 'Critique & rewrite text for better conversion.',
    icon: <RefreshCw className="w-6 h-6" />
  }
]

export default function Copywriting() {
  const navigate = useNavigate()

  const handleTechniqueClick = (techniqueId: string) => {
    navigate(`/copywriting/${techniqueId}`)
  }

  return (
    <div className="py-12">
      {/* Back Navigation */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
        </button>
      </div>

      {/* Category Header */}
      <div className="text-center mb-12">
        <div className="text-sm text-gray-600 mb-4">✍️ Copywriting</div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Choose a Prompt Technique for Copywriting
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Select the right style to generate high-performing ad copy and content.
        </p>
      </div>

      {/* Techniques Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techniques.map((technique) => (
          <div
            key={technique.id}
            className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => handleTechniqueClick(technique.id)}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="text-gray-700 group-hover:text-primary-600 transition-colors">
                {technique.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{technique.title}</h3>
                <p className="text-sm text-gray-600 italic">"{technique.description}"</p>
              </div>
            </div>
            <div className="flex justify-end">
              <button className="bg-primary-600 text-white py-2 px-4 rounded-full font-medium hover:bg-primary-700 transition-colors flex items-center gap-2 text-sm">
                Use this technique
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}