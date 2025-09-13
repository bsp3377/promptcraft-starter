import { 
  User, 
  Users, 
  List, 
  RotateCcw,
  GraduationCap
} from 'lucide-react'
import CategoryPage from '../components/CategoryPage'

const techniques = [
  {
    id: 'roleplay',
    title: 'Roleplay Prompt',
    description: 'Act as a friendly math tutor.',
    icon: <User className="w-6 h-6" />
  },
  {
    id: 'audience-based',
    title: 'Audience-based Prompt',
    description: 'Explain for a 10-year-old / beginner.',
    icon: <Users className="w-6 h-6" />
  },
  {
    id: 'chain-of-thought',
    title: 'Chain-of-Thought Prompt',
    description: 'Step-by-step reasoning in answers.',
    icon: <List className="w-6 h-6" />
  },
  {
    id: 'self-consistency',
    title: 'Self-Consistency Prompt',
    description: 'Generate multiple explanations & choose best.',
    icon: <RotateCcw className="w-6 h-6" />
  }
]

export default function LearningTutors() {
  return (
    <CategoryPage
      categoryId="learning"
      categoryName="Learning & Tutors"
      categoryIcon={<GraduationCap className="w-4 h-4" />}
      description="Select a technique to craft clear, effective tutoring prompts for any subject or learner level."
      techniques={techniques}
    />
  )
}
