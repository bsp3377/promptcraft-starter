import { 
  AlignLeft, 
  Scale, 
  Shield,
  Search
} from 'lucide-react'
import CategoryPage from '../components/CategoryPage'

const techniques = [
  {
    id: 'summarization',
    title: 'Summarization Prompt',
    description: 'Condense long text into concise summaries.',
    icon: <AlignLeft className="w-6 h-6" />
  },
  {
    id: 'compare',
    title: 'Compare & Contrast Prompt',
    description: 'Highlight similarities, differences, pros/cons.',
    icon: <Scale className="w-6 h-6" />
  },
  {
    id: 'critic-refiner',
    title: 'Critic & Refiner Prompt',
    description: 'First critique, then refine for improvement.',
    icon: <Shield className="w-6 h-6" />
  }
]

export default function Research() {
  return (
    <CategoryPage
      categoryId="research"
      categoryName="Research"
      categoryIcon={<Search className="w-4 h-4" />}
      description="Summarize, compare, and refine insights with clarity."
      techniques={techniques}
    />
  )
}
