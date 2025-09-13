import { 
  Calendar, 
  Grid3X3, 
  User, 
  Brain, 
  FileText,
  Briefcase
} from 'lucide-react'
import CategoryPage from '../components/CategoryPage'

const techniques = [
  {
    id: 'planning',
    title: 'Planning Prompt',
    description: 'Step-by-step business strategy.',
    icon: <Calendar className="w-6 h-6" />
  },
  {
    id: 'swot',
    title: 'SWOT/Framework Prompt',
    description: 'Structured SWOT, PESTLE, GTM.',
    icon: <Grid3X3 className="w-6 h-6" />
  },
  {
    id: 'roleplay',
    title: 'Roleplay Prompt',
    description: 'Act as a consultant.',
    icon: <User className="w-6 h-6" />
  },
  {
    id: 'chain-of-thought',
    title: 'Chain-of-Thought Prompt',
    description: 'Detailed reasoning for strategy.',
    icon: <Brain className="w-6 h-6" />
  },
  {
    id: 'deliberation',
    title: 'Deliberation Prompt',
    description: 'Generate → critique → refine.',
    icon: <FileText className="w-6 h-6" />
  }
]

export default function BusinessStrategy() {
  return (
    <CategoryPage
      categoryId="business"
      categoryName="Business & Strategy"
      categoryIcon={<Briefcase className="w-4 h-4" />}
      description="Pick a technique to plan strategies, evaluate options, and iterate on decisions with clarity."
      techniques={techniques}
    />
  )
}
