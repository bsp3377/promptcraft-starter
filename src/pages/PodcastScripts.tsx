import { 
  User, 
  Sparkles, 
  FileText, 
  Lightbulb,
  Mic
} from 'lucide-react'
import CategoryPage from '../components/CategoryPage'

const techniques = [
  {
    id: 'roleplay',
    title: 'Roleplay Prompt',
    description: 'Act as a podcast scriptwriter.',
    icon: <User className="w-6 h-6" />
  },
  {
    id: 'style-transfer',
    title: 'Style Transfer Prompt',
    description: 'Set tone: inspirational, fun, serious.',
    icon: <Sparkles className="w-6 h-6" />
  },
  {
    id: 'few-shot',
    title: 'Few-Shot Prompt',
    description: 'Provide example episode scripts.',
    icon: <FileText className="w-6 h-6" />
  },
  {
    id: 'creative-expansion',
    title: 'Creative Expansion Prompt',
    description: 'Brainstorm 10 hooks before writing.',
    icon: <Lightbulb className="w-6 h-6" />
  }
]

export default function PodcastScripts() {
  return (
    <CategoryPage
      categoryId="podcast"
      categoryName="Podcast & Scripts"
      categoryIcon={<Mic className="w-4 h-4" />}
      description="Select a technique to craft episodes, outlines, and scripts with the right tone and structure."
      techniques={techniques}
    />
  )
}
