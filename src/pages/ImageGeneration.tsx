import { 
  Camera, 
  Square, 
  Grid3X3, 
  User,
  Image
} from 'lucide-react'
import CategoryPage from '../components/CategoryPage'

const techniques = [
  {
    id: 'descriptive',
    title: 'Descriptive Prompting',
    description: 'Detailed visuals with style keywords.',
    icon: <Camera className="w-6 h-6" />
  },
  {
    id: 'multi-shot',
    title: 'Multi-shot Examples',
    description: 'Show 2-3 strong image prompts.',
    icon: <Square className="w-6 h-6" />
  },
  {
    id: 'format-constrained',
    title: 'Format-constrained Prompt',
    description: 'Define resolution, lighting, aspect ratio.',
    icon: <Grid3X3 className="w-6 h-6" />
  },
  {
    id: 'role',
    title: 'Role Prompt',
    description: 'Act as a creative fashion photographer.',
    icon: <User className="w-6 h-6" />
  }
]

export default function ImageGeneration() {
  return (
    <CategoryPage
      categoryId="image"
      categoryName="Image Generation"
      categoryIcon={<Image className="w-4 h-4" />}
      description="Select a technique to craft precise image prompts for your generator of choice."
      techniques={techniques}
    />
  )
}
