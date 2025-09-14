import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Clapperboard, Film, Users, Key, Palette, Timer, MoveRight, Wrench } from 'lucide-react'

const techniques = [
  { id: 'storyboard', title: 'Storyboard Prompting', description: 'Scene-by-scene descriptions to maintain continuity.', icon: <Clapperboard className="w-6 h-6" /> },
  { id: 'cinematic', title: 'Shot-based / Cinematic Prompting', description: 'Use filmmaking language: shot type, camera movement.', icon: <Film className="w-6 h-6" /> },
  { id: 'consistent-characters', title: 'Consistent Character Prompting', description: 'Fixed identity anchors to keep characters stable.', icon: <Users className="w-6 h-6" /> },
  { id: 'keyframe', title: 'Keyframe Prompting (Anchor Frames)', description: 'Specify important frames and interpolate smoothly.', icon: <Key className="w-6 h-6" /> },
  { id: 'style-lock', title: 'Style Lock Prompting', description: 'Enforce consistent art style or mood across scenes.', icon: <Palette className="w-6 h-6" /> },
  { id: 'temporal-consistency', title: 'Temporal Consistency Prompting', description: 'Keep colors, lighting, and faces stable across frames.', icon: <Timer className="w-6 h-6" /> },
  { id: 'physics-motion', title: 'Physics & Motion Guidance', description: 'Direct how motion should look: smooth, realistic, stable.', icon: <MoveRight className="w-6 h-6" /> },
  { id: 'refinement', title: 'Refinement / Iterative Prompting', description: 'Start broad, then refine to reduce jitter and smooth motion.', icon: <Wrench className="w-6 h-6" /> },
]

export default function VideoGeneration() {
  const navigate = useNavigate()

  const handleTechniqueClick = (techniqueId: string) => {
    navigate('/wizard', { state: { category: 'video', technique: techniqueId } })
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
        <div className="text-sm text-gray-600 mb-4">Video Generation</div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Choose a Prompt Technique for Video Generation
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Build text-to-video prompts with continuity, cinematic control, stable characters, and smooth motion.
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
              <div className="text-gray-700 group-hover:text-primary-600 transition-colors">{technique.icon}</div>
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

