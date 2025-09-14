import { useNavigate } from 'react-router-dom'
import { 
  MessageSquare, 
  PenTool, 
  Image, 
  GraduationCap, 
  Code, 
  Mic, 
  Search, 
  TrendingUp, 
  Edit3,
  Video
} from 'lucide-react'

interface PromptCategory {
  id: string
  title: string
  description: string
  icon: React.ReactNode
}

const promptCategories: PromptCategory[] = [
  {
    id: 'chatbot',
    title: 'Chatbot Assistant',
    description: 'Conversational agents for support/onboarding',
    icon: <MessageSquare className="w-5 h-5" />
  },
  {
    id: 'copywriting',
    title: 'Copywriting',
    description: 'Ads, landing pages, emails',
    icon: <PenTool className="w-5 h-5" />
  },
  {
    id: 'image',
    title: 'Image Generation',
    description: 'Midjourney, DALL·E, Stable Diffusion',
    icon: <Image className="w-5 h-5" />
  },
  {
    id: 'video',
    title: 'Video Generation',
    description: 'Text-to-video prompts, cinematic control',
    icon: <Video className="w-5 h-5" />
  },
  {
    id: 'learning',
    title: 'Learning & Tutors',
    description: 'Study guides and lesson creation',
    icon: <GraduationCap className="w-5 h-5" />
  },
  {
    id: 'coding',
    title: 'Coding Assistant',
    description: 'Functions, debugging, refactoring',
    icon: <Code className="w-5 h-5" />
  },
  {
    id: 'podcast',
    title: 'Podcast & Scripts',
    description: 'Outlines, questions, scripts',
    icon: <Mic className="w-5 h-5" />
  },
  {
    id: 'research',
    title: 'Research',
    description: 'Summarize, compare, extract insights',
    icon: <Search className="w-5 h-5" />
  },
  {
    id: 'business',
    title: 'Business & Strategy',
    description: 'SWOT, competitors, GTM plans',
    icon: <TrendingUp className="w-5 h-5" />
  },
  {
    id: 'creative',
    title: 'Creative Writing',
    description: 'Plots, characters, vivid scenes',
    icon: <Edit3 className="w-5 h-5" />
  }
]

export default function Landing() {
  const navigate = useNavigate()

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'copywriting') {
      navigate('/category/copywriting')
    } else {
      navigate(`/${categoryId}`)
    }
  }

  return (
    <div className="py-12">
      {/* Hero Section */}
      <section className="text-center space-y-8 mb-24">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
          Turn your idea into the perfect AI prompt
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose from 20+ proven prompt styles. Beginner-friendly, powerful, and accurate.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button 
            onClick={() => navigate('/browse')}
            className="inline-flex items-center gap-3 bg-primary-600 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-primary-700 transition-colors"
          >
            <span className="text-xl">✨</span>
            Browse Prompt Types
          </button>
          <button 
            onClick={() => navigate('/templates')}
            className="inline-flex items-center gap-3 bg-gray-100 text-gray-800 px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-200 transition-colors"
          >
            <span className="text-xl">🖼️</span>
            Prompt Library
          </button>
        </div>
      </section>

      {/* Prompt Categories Section */}
      <section className="mb-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Prompt Categories</h2>
          <a href="#" className="text-gray-600 hover:text-gray-900">Explore popular techniques</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promptCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="text-gray-700 group-hover:text-primary-600 transition-colors">
                  {category.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{category.title}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <button className="bg-primary-600 text-white py-2 px-4 rounded-full font-medium hover:bg-primary-700 transition-colors flex items-center gap-2 text-sm">
                  <span className="text-xs">▶</span>
                  Use this prompt
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-gray-600 rounded-sm flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">Select prompt type</h3>
              <p className="text-gray-600">Pick from 20+ curated templates</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PenTool className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Enter details</h3>
              <p className="text-gray-600">Add goals, tone, constraints</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-600 rounded-sm"></div>
                  <span className="text-gray-600 text-lg">✨</span>
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">Get optimized prompt</h3>
              <p className="text-gray-600">Copy and use instantly</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}