import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

type Technique = { id: string; title: string; route: string; category: string; description: string }

const TECHNIQUES: Technique[] = [
  // Chatbot / Core
  { id: 'roleplay', title: 'Roleplay', route: '/builder/roleplay', category: 'Chatbot / General', description: 'Act as a role or persona to complete tasks.' },
  { id: 'few-shot', title: 'Few-Shot', route: '/builder/few-shot', category: 'Chatbot / General', description: 'Learn style from examples.' },
  { id: 'structured-output', title: 'Structured Output', route: '/builder/structured-output', category: 'Chatbot / General', description: 'Force JSON, tables, or lists.' },
  { id: 'chain-of-thought', title: 'Chain-of-Thought', route: '/builder/chain-of-thought', category: 'Chatbot / General', description: 'Show reasoning then answer.' },
  { id: 'zero-shot', title: 'Zero-Shot', route: '/builder/zero-shot', category: 'Chatbot / General', description: 'Direct task without examples.' },
  { id: 'reflexion', title: 'Reflexion', route: '/builder/reflexion', category: 'Chatbot / General', description: 'Generate → critique → improve.' },

  // Image Generation
  { id: 'descriptive', title: 'Descriptive (Image)', route: '/builder/descriptive', category: 'Image', description: 'Detailed visuals with style keywords.' },
  { id: 'multi-shot', title: 'Multi-shot (Image)', route: '/builder/multi-shot', category: 'Image', description: 'Use multiple examples.' },
  { id: 'format-constrained', title: 'Format-Constrained (Image)', route: '/builder/format-constrained', category: 'Image', description: 'Resolution, lighting, aspect.' },

  // Copywriting
  { id: 'cw-style', title: 'Copywriting: Style Transfer', route: '/copywriting/style-transfer', category: 'Copywriting', description: 'Rewrite tone and style.' },
  { id: 'cw-fs', title: 'Copywriting: Few-Shot', route: '/copywriting/few-shot', category: 'Copywriting', description: 'Learn from ad examples.' },
  { id: 'cw-aud', title: 'Copywriting: Audience-Based', route: '/copywriting/audience-based', category: 'Copywriting', description: 'Write for specific audiences.' },
  { id: 'cw-ref', title: 'Copywriting: Refinement', route: '/copywriting/refinement', category: 'Copywriting', description: 'Critique & rewrite.' },

  // Video Generation
  { id: 'storyboard', title: 'Storyboard (Video)', route: '/builder/storyboard', category: 'Video', description: 'Scene-by-scene plan.' },
  { id: 'cinematic', title: 'Cinematic (Video)', route: '/builder/cinematic', category: 'Video', description: 'Shots and camera moves.' },
  { id: 'character-consistency', title: 'Character Consistency (Video)', route: '/builder/character-consistency', category: 'Video', description: 'Stable character identity.' },
  { id: 'keyframe', title: 'Keyframe (Video)', route: '/builder/keyframe', category: 'Video', description: 'Anchor frames & interpolate.' },
  { id: 'style-lock', title: 'Style Lock (Video)', route: '/builder/style-lock', category: 'Video', description: 'Enforce visual style.' },
  { id: 'temporal-consistency', title: 'Temporal Consistency (Video)', route: '/builder/temporal-consistency', category: 'Video', description: 'Stable colors and motion.' },
  { id: 'motion-guidance', title: 'Motion Guidance (Video)', route: '/builder/motion-guidance', category: 'Video', description: 'Physically plausible movement.' },
  { id: 'video-refinement', title: 'Refinement (Video)', route: '/builder/refinement-video', category: 'Video', description: 'Iterative improvements.' },

  // Research
  { id: 'summarization', title: 'Summarization', route: '/builder/summarization', category: 'Research', description: 'Condense sources to key points.' },
  { id: 'compare', title: 'Compare & Contrast', route: '/builder/compare-contrast', category: 'Research', description: 'Pros/cons side-by-side.' },
  { id: 'critic-refiner', title: 'Critic & Refiner', route: '/builder/critic-refiner', category: 'Research', description: 'Improve accuracy & reduce bias.' },

  // Business & Strategy
  { id: 'planning', title: 'Planning', route: '/builder/planning', category: 'Business & Strategy', description: 'Step-by-step strategy plan.' },
  { id: 'frameworks', title: 'SWOT/Frameworks', route: '/builder/frameworks', category: 'Business & Strategy', description: 'SWOT, PESTLE, GTM.' },
  { id: 'deliberation', title: 'Deliberation', route: '/builder/deliberation', category: 'Business & Strategy', description: 'Generate → critique → refine.' },

  // Creative Writing
  { id: 'open-ended', title: 'Open-ended', route: '/builder/open-ended', category: 'Creative Writing', description: 'Explore multiple paths.' },
  { id: 'tree', title: 'Tree-of-Thought', route: '/builder/tree-of-thought', category: 'Creative Writing', description: 'Branch and choose best.' },
  { id: 'cw-ref', title: 'Refinement (Writing)', route: '/builder/refinement-writing', category: 'Creative Writing', description: 'Draft → critique → rewrite.' },
]

export default function Browse() {
  const navigate = useNavigate()
  return (
    <div className="py-12">
      <div className="mb-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Browse Prompt Types</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">All builders available in PromptCraft. Pick one to start generating instantly.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 md:px-8">
        {TECHNIQUES.map(t => (
          <div key={t.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate(t.route)}>
            <div className="text-sm text-gray-500 mb-2">{t.category}</div>
            <h3 className="font-semibold text-lg mb-2">{t.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{t.description}</p>
            <div className="flex justify-end">
              <button className="bg-primary-600 text-white py-2 px-4 rounded-full font-medium hover:bg-primary-700 transition-colors text-sm">Open Builder</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


