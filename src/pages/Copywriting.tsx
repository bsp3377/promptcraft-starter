import { 
  Target, 
  Users, 
  Sparkles, 
  FileText,
  PenTool
} from 'lucide-react'
import CategoryPage from '../components/CategoryPage'

const techniques = [
  {
    id: 'audience-based',
    title: 'Audience-based Prompt',
    description: 'Write for specific demographics.',
    icon: <Users className="w-6 h-6" />
  },
  {
    id: 'style-transfer',
    title: 'Style Transfer Prompt',
    description: 'Match brand voice and tone.',
    icon: <Sparkles className="w-6 h-6" />
  },
  {
    id: 'few-shot',
    title: 'Few-Shot Prompt',
    description: 'Provide examples of successful copy.',
    icon: <FileText className="w-6 h-6" />
  },
  {
    id: 'persuasion',
    title: 'Persuasion Prompt',
    description: 'Use psychological triggers and CTAs.',
    icon: <Target className="w-6 h-6" />
  }
]

export default function Copywriting() {
  return (
    <CategoryPage
      categoryId="copywriting"
      categoryName="Copywriting"
      categoryIcon={<PenTool className="w-4 h-4" />}
      description="Choose techniques to create compelling ads, landing pages, and marketing copy that converts."
      techniques={techniques}
    />
  )
}
