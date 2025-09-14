import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface PromptTechnique {
  id: string
  title: string
  description: string
  icon: React.ReactNode
}

interface CategoryPageProps {
  categoryId: string
  categoryName: string
  categoryIcon: React.ReactNode
  description: string
  techniques: PromptTechnique[]
}

export default function CategoryPage({ 
  categoryId, 
  categoryName, 
  categoryIcon, 
  description, 
  techniques 
}: CategoryPageProps) {
  const navigate = useNavigate()

  const handleTechniqueClick = (techniqueId: string) => {
    const builderRoutes: { [key: string]: string } = {
      'roleplay': '/builder/roleplay',
      'few-shot': '/builder/few-shot',
      'structured-output': '/builder/structured-output',
      'chain-of-thought': '/builder/chain-of-thought',
      'zero-shot': '/builder/zero-shot',
      'reflexion': '/builder/reflexion',
      'summarization': '/builder/summarization',
      'compare-contrast': '/builder/compare-contrast',
      'critic-refiner': '/builder/critic-refiner',
      'planning': '/builder/planning',
      'swot': '/builder/frameworks',
      'deliberation': '/builder/deliberation'
    }
    
    const route = builderRoutes[techniqueId]
    if (route) {
      navigate(route)
    } else {
      navigate('/wizard', { state: { category: categoryId, technique: techniqueId } })
    }
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
        <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-700 mb-6">
          {categoryIcon}
          {categoryName}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Choose a Prompt Technique for {categoryName}
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {description}
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
                <span className="text-xs">▶</span>
                Use this technique
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
