import { 
  BookOpen, 
  Infinity, 
  Quote, 
  TreePine, 
  Edit3,
  PenTool
} from 'lucide-react'
import CategoryPage from '../components/CategoryPage'

const techniques = [
  {
    id: 'roleplay',
    title: 'Roleplay Prompt',
    description: 'Act as a fantasy novelist.',
    icon: <BookOpen className="w-6 h-6" />
  },
  {
    id: 'open-ended',
    title: 'Open-ended Prompt',
    description: 'Explore multiple story paths.',
    icon: <Infinity className="w-6 h-6" />
  },
  {
    id: 'few-shot',
    title: 'Few-Shot Prompt',
    description: 'Provide writing samples for style.',
    icon: <Quote className="w-6 h-6" />
  },
  {
    id: 'tree-of-thought',
    title: 'Tree-of-Thought Prompt',
    description: 'Branch storylines & pick best.',
    icon: <TreePine className="w-6 h-6" />
  },
  {
    id: 'refinement',
    title: 'Refinement Prompt',
    description: 'Generate draft → critique → improve.',
    icon: <Edit3 className="w-6 h-6" />
  }
]

export default function CreativeWriting() {
  return (
    <CategoryPage
      categoryId="creative"
      categoryName="Creative Writing"
      categoryIcon={<PenTool className="w-4 h-4" />}
      description="Choose a technique to ideate plotlines, shape voices, and iterate on stories fast."
      techniques={techniques}
    />
  )
}
