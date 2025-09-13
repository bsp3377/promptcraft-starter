import { 
  AlignLeft, 
  Scale, 
  Brain, 
  Grid3X3, 
  Shield,
  Search
} from 'lucide-react'
import CategoryPage from '../components/CategoryPage'

const techniques = [
  {
    id: 'summarization',
    title: 'Summarization Prompt',
    description: 'Condense sources into key points.',
    icon: <AlignLeft className="w-6 h-6" />
  },
  {
    id: 'compare-contrast',
    title: 'Compare & Contrast Prompt',
    description: 'List pros/cons.',
    icon: <Scale className="w-6 h-6" />
  },
  {
    id: 'chain-of-thought',
    title: 'Chain-of-Thought Prompt',
    description: 'Explain reasoning behind insights.',
    icon: <Brain className="w-6 h-6" />
  },
  {
    id: 'structured-output',
    title: 'Structured Output Prompt',
    description: 'Force tables, bullet lists.',
    icon: <Grid3X3 className="w-6 h-6" />
  },
  {
    id: 'critic-refiner',
    title: 'Critic & Refiner Prompt',
    description: 'Improve accuracy & reduce bias.',
    icon: <Shield className="w-6 h-6" />
  }
]

export default function Research() {
  return (
    <CategoryPage
      categoryId="research"
      categoryName="Research"
      categoryIcon={<Search className="w-4 h-4" />}
      description="Select a technique to analyze sources, extract insights, and structure findings efficiently."
      techniques={techniques}
    />
  )
}
