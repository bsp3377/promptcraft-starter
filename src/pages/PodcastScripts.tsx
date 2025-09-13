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
    id: 'style-transfer',
    title: 'Style Transfer Prompt',
    description: 'Rewrite script or copy in a specific tone.',
    icon: <Sparkles className="w-6 h-6" />
  },
  {
    id: 'creative-expansion',
    title: 'Creative Expansion Prompt',
    description: 'Generate multiple creative options before final script.',
    icon: <Lightbulb className="w-6 h-6" />
  },
  
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
