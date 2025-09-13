import { 
  Hexagon, 
  Braces, 
  Brain, 
  RotateCcw, 
  ChevronsLeftRight,
  Code
} from 'lucide-react'
import CategoryPage from '../components/CategoryPage'

const techniques = [
  {
    id: 'zero-shot',
    title: '>_ Zero-Shot Prompt',
    description: 'Direct code instructions (e.g., write function).',
    icon: <Hexagon className="w-6 h-6" />
  },
  {
    id: 'few-shot',
    title: '{} Few-Shot Prompt',
    description: 'Provide code patterns/examples.',
    icon: <Braces className="w-6 h-6" />
  },
  {
    id: 'chain-of-thought',
    title: 'Chain-of-Thought Prompt',
    description: 'Explain debugging step-by-step.',
    icon: <Brain className="w-6 h-6" />
  },
  {
    id: 'reflexion',
    title: 'Reflexion Prompt',
    description: 'Generate → check → correct code.',
    icon: <RotateCcw className="w-6 h-6" />
  },
  {
    id: 'structured-output',
    title: '<> Structured Output Prompt',
    description: 'Reply only in code blocks with comments.',
    icon: <ChevronsLeftRight className="w-6 h-6" />
  }
]

export default function CodingAssistant() {
  return (
    <CategoryPage
      categoryId="coding"
      categoryName="Coding Assistant"
      categoryIcon={<Code className="w-4 h-4" />}
      description="Select a technique to scaffold code generation, debugging, and structured responses for your coding tasks."
      techniques={techniques}
    />
  )
}
