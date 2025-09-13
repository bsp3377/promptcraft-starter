import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, Square, Grid3X3, User } from 'lucide-react'

const techniques = [
  {
    id: 'descriptive',
    title: 'Descriptive Prompting',
    description: 'Detailed visuals with style keywords.',
    icon: <Camera className="w-6 h-6" />
  },
  {
    id: 'multi-shot',
    title: 'Multi-shot Examples',
    description: 'Show 2-3 strong image prompts.',
    icon: <Square className="w-6 h-6" />
  },
  {
    id: 'format-constrained',
    title: 'Format-constrained Prompt',
    description: 'Define resolution, lighting, aspect ratio.',
    icon: <Grid3X3 className="w-6 h-6" />
  },
  {
    id: 'role',
    title: 'Role Prompt',
    description: 'Act as a creative fashion photographer.',
    icon: <User className="w-6 h-6" />
  }
]

export default function ImageGeneration() {
  const navigate = useNavigate()

  const handleTechniqueClick = (techniqueId: string) => {
    // Map to specific builder routes for image generation techniques
    const builderRoutes: { [key: string]: string } = {
      'descriptive': '/builder/descriptive',
      'multi-shot': '/builder/multi-shot',
      'format-constrained': '/builder/format-constrained',
      'role': '/builder/roleplay' // Reuse roleplay builder for role prompts
    }
    
    const route = builderRoutes[techniqueId]
    if (route) {
      navigate(route)
    } else {
      navigate('/wizard', { state: { category: 'image', technique: techniqueId } })
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
        <div className="text-sm text-gray-600 mb-4">Image Generation</div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Choose a Prompt Technique for Image Generation
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Select a technique to craft precise image prompts for your generator of choice.
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
                {technique.id === 'format-constrained' && <span className="text-xs">▶</span>}
                Use this technique
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
