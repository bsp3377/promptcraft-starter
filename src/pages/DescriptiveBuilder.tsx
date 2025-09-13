import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import ImageUpload from '../components/ImageUpload'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const DESCRIPTIVE_TEMPLATE = `Create a detailed image prompt with the following specifications:

Subject: {{Subject}}
Style: {{Style}}
Composition: {{Composition}}
Lighting: {{Lighting}}
Mood: {{Mood}}
Technical Details: {{TechnicalDetails}}

{{ImageReference}}

Additional Context:
{{AdditionalContext}}

Guidelines:
- Be specific and descriptive
- Include artistic style keywords
- Specify composition and framing
- Detail lighting and atmosphere
- Add technical specifications if needed
{{ImageGuidelines}}`

export default function DescriptiveBuilder() {
  const navigate = useNavigate()
  const [subject, setSubject] = useState('')
  const [style, setStyle] = useState('')
  const [composition, setComposition] = useState('')
  const [lighting, setLighting] = useState('')
  const [mood, setMood] = useState('')
  const [technicalDetails, setTechnicalDetails] = useState('')
  const [additionalContext, setAdditionalContext] = useState('')
  const [referenceImage, setReferenceImage] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState<{[k:string]:boolean}>({})

  const onEnhance = async (label: string, value: string, setter: (v:string)=>void) => {
    try {
      setLoading((s)=>({...s, [label]: true}));
      const improved = await enhanceField(label, value);
      setter(improved || value);
    } finally {
      setLoading((s)=>({...s, [label]: false}));
    }
  }

  const onGenerate = async () => {
    if (!subject.trim() || !style.trim()) return

    setLoading((s)=>({...s, generate: true}));
    try {
      const imageReference = referenceImage 
        ? `Reference Image: Use the attached image as a style and composition reference. Analyze the visual elements, color palette, lighting, and artistic style to inform the prompt generation.`
        : ''
      
      const imageGuidelines = referenceImage
        ? `- Use the reference image to guide style, composition, and visual elements
- Maintain consistency with the reference image's artistic approach
- Adapt the reference style to match the specified subject and requirements`
        : ''

      const compiled = DESCRIPTIVE_TEMPLATE
        .replaceAll('{{Subject}}', subject)
        .replaceAll('{{Style}}', style)
        .replaceAll('{{Composition}}', composition)
        .replaceAll('{{Lighting}}', lighting)
        .replaceAll('{{Mood}}', mood)
        .replaceAll('{{TechnicalDetails}}', technicalDetails)
        .replaceAll('{{ImageReference}}', imageReference)
        .replaceAll('{{AdditionalContext}}', additionalContext)
        .replaceAll('{{ImageGuidelines}}', imageGuidelines)

      const finalText = await polishFinalPrompt(compiled)
      setPreview(finalText)
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setLoading((s)=>({...s, generate: false}));
    }
  }

  const canGenerate = subject.trim() && style.trim()

  return (
    <div>
      <div className="py-12 max-w-7xl mx-auto px-4 md:px-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/image')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Image Generation
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Descriptive Prompt Builder
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Create detailed image prompts with specific visual descriptions, style keywords, and technical specifications.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Fill in the details</h2>

            <InputCard
              label="Subject"
              placeholder="e.g., A majestic mountain landscape"
              value={subject}
              onChange={setSubject}
              onEnhance={() => onEnhance('Subject', subject, setSubject)}
              helpText="Describe the main subject or focal point of your image."
              required
              loading={loading['Subject']}
            />

            <InputCard
              label="Style"
              placeholder="e.g., Photorealistic, oil painting, digital art"
              value={style}
              onChange={setStyle}
              onEnhance={() => onEnhance('Style', style, setStyle)}
              helpText="Specify the artistic style or medium."
              required
              loading={loading['Style']}
            />

            <InputCard
              label="Composition"
              placeholder="e.g., Rule of thirds, centered, wide angle"
              value={composition}
              onChange={setComposition}
              onEnhance={() => onEnhance('Composition', composition, setComposition)}
              helpText="Define the framing and composition approach."
              loading={loading['Composition']}
            />

            <InputCard
              label="Lighting"
              placeholder="e.g., Golden hour, dramatic shadows, soft natural light"
              value={lighting}
              onChange={setLighting}
              onEnhance={() => onEnhance('Lighting', lighting, setLighting)}
              helpText="Describe the lighting conditions and atmosphere."
              loading={loading['Lighting']}
            />

            <InputCard
              label="Mood"
              placeholder="e.g., Serene, mysterious, energetic, peaceful"
              value={mood}
              onChange={setMood}
              onEnhance={() => onEnhance('Mood', mood, setMood)}
              helpText="Set the emotional tone and atmosphere."
              loading={loading['Mood']}
            />

            <InputCard
              label="Technical Details"
              placeholder="e.g., 4K resolution, high detail, professional photography"
              value={technicalDetails}
              onChange={setTechnicalDetails}
              onEnhance={() => onEnhance('Technical Details', technicalDetails, setTechnicalDetails)}
              helpText="Add any technical specifications or quality requirements."
              loading={loading['Technical Details']}
            />

            <InputCard
              label="Additional Context"
              placeholder="e.g., Color palette, specific elements to include, camera settings"
              value={additionalContext}
              onChange={setAdditionalContext}
              onEnhance={() => onEnhance('Additional Context', additionalContext, setAdditionalContext)}
              helpText="Any additional details or specific requirements."
              multiline
              loading={loading['Additional Context']}
            />

            <ImageUpload
              onImageChange={setReferenceImage}
              currentImage={referenceImage}
            />

            <div className="pt-4">
              <PrimaryButton
                onClick={onGenerate}
                disabled={!canGenerate || loading['generate']}
                loading={loading['generate']}
                className="w-full"
              >
                ⚡ Generate Final Prompt
              </PrimaryButton>
              <p className="text-sm text-gray-500 mt-2 text-center">
                You can update fields anytime before generating.
              </p>
            </div>
          </section>

          {/* Right: Preview */}
          <PreviewPanel value={preview} onChange={setPreview} />
        </div>
      </div>
    </div>
  )
}
