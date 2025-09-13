import { 
  Camera, 
  Palette, 
  Layers, 
  Sparkles,
  Image
} from 'lucide-react'
import CategoryPage from '../components/CategoryPage'

const techniques = [
  {
    id: 'descriptive',
    title: 'Descriptive Prompt',
    description: 'Detailed visual descriptions and style.',
    icon: <Camera className="w-6 h-6" />
  },
  {
    id: 'style-transfer',
    title: 'Style Transfer Prompt',
    description: 'Reference specific artists or art movements.',
    icon: <Palette className="w-6 h-6" />
  },
  {
    id: 'composition',
    title: 'Composition Prompt',
    description: 'Control lighting, angle, and framing.',
    icon: <Layers className="w-6 h-6" />
  },
  {
    id: 'iterative',
    title: 'Iterative Prompt',
    description: 'Refine and improve through iterations.',
    icon: <Sparkles className="w-6 h-6" />
  }
]

export default function ImageGeneration() {
  return (
    <CategoryPage
      categoryId="image"
      categoryName="Image Generation"
      categoryIcon={<Image className="w-4 h-4" />}
      description="Select techniques for Midjourney, DALL·E, and Stable Diffusion to create stunning visuals."
      techniques={techniques}
    />
  )
}
