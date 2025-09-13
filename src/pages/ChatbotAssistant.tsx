import { 
  Headphones, 
  MessageSquare, 
  List, 
  Brain,
  MessageCircle
} from 'lucide-react'
import CategoryPage from '../components/CategoryPage'

const techniques = [
  {
    id: 'roleplay',
    title: 'Roleplay Prompt',
    description: 'Act as a helpful support agent...',
    icon: <Headphones className="w-6 h-6" />
  },
  {
    id: 'few-shot',
    title: 'Few-Shot Prompt',
    description: 'Provide 2-3 example dialogues.',
    icon: <MessageSquare className="w-6 h-6" />
  },
  {
    id: 'structured-output',
    title: 'Structured Output Prompt',
    description: 'Enforce JSON or bullet-point responses.',
    icon: <List className="w-6 h-6" />
  },
  {
    id: 'chain-of-thought',
    title: 'Chain-of-Thought Prompt',
    description: 'Explain reasoning step-by-step for troubleshooting.',
    icon: <Brain className="w-6 h-6" />
  }
]

export default function ChatbotAssistant() {
  return (
    <CategoryPage
      categoryId="chatbot"
      categoryName="Chatbot Assistant"
      categoryIcon={<MessageCircle className="w-4 h-4" />}
      description="Select the right prompt style to create accurate and helpful chatbot prompts."
      techniques={techniques}
    />
  )
}
