import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import ImageUpload from '../components/ImageUpload'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const FORMAT_CONSTRAINED_TEMPLATE = `Create a format-constrained image prompt with the following specifications:

Subject: {{Subject}}
Resolution: {{Resolution}}
Aspect Ratio: {{AspectRatio}}
Lighting: {{Lighting}}
Style: {{Style}}
Technical Requirements: {{TechnicalRequirements}}

{{ImageReference}}

Format Constraints:
{{FormatConstraints}}

Output Guidelines:
{{OutputGuidelines}}

Instructions:
- Follow all format constraints strictly
- Ensure technical requirements are met
- Maintain consistency with specified parameters
- Optimize for the target format and resolution
{{ImageGuidelines}}`

export default function FormatConstrainedBuilder() {
  const navigate = useNavigate()
  const [subject, setSubject] = useState('')
  const [resolution, setResolution] = useState('')
  const [aspectRatio, setAspectRatio] = useState('')
  const [lighting, setLighting] = useState('')
  const [style, setStyle] = useState('')
  const [technicalRequirements, setTechnicalRequirements] = useState('')
  const [formatConstraints, setFormatConstraints] = useState('')
  const [outputGuidelines, setOutputGuidelines] = useState('')
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
    if (!subject.trim() || !resolution.trim() || !aspectRatio.trim()) return

    setLoading((s)=>({...s, generate: true}));
    try {
      const imageReference = referenceImage 
        ? `Reference Image: Use the attached image as a reference for style, composition, and visual elements while maintaining the specified technical constraints and format requirements.`
        : ''
      
      const imageGuidelines = referenceImage
        ? `- Use the reference image to guide style and composition within the specified constraints
- Ensure the reference style is adapted to meet all technical requirements
- Maintain the reference image's visual quality while respecting format limitations`
        : ''

      const compiled = FORMAT_CONSTRAINED_TEMPLATE
        .replaceAll('{{Subject}}', subject)
        .replaceAll('{{Resolution}}', resolution)
        .replaceAll('{{AspectRatio}}', aspectRatio)
        .replaceAll('{{Lighting}}', lighting)
        .replaceAll('{{Style}}', style)
        .replaceAll('{{TechnicalRequirements}}', technicalRequirements)
        .replaceAll('{{ImageReference}}', imageReference)
        .replaceAll('{{FormatConstraints}}', formatConstraints)
        .replaceAll('{{OutputGuidelines}}', outputGuidelines)
        .replaceAll('{{ImageGuidelines}}', imageGuidelines)

      const finalText = await polishFinalPrompt(compiled)
      setPreview(finalText)
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setLoading((s)=>({...s, generate: false}));
    }
  }

  const canGenerate = subject.trim() && resolution.trim() && aspectRatio.trim()

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
            Format-constrained Prompt Builder
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Create image prompts with specific technical constraints including resolution, aspect ratio, lighting, and other format requirements.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Fill in the details</h2>

            <InputCard
              label="Subject"
              placeholder="e.g., A futuristic cityscape"
              value={subject}
              onChange={setSubject}
              onEnhance={() => onEnhance('Subject', subject, setSubject)}
              helpText="Describe the main subject or scene."
              required
              loading={loading['Subject']}
            />

            <InputCard
              label="Resolution"
              placeholder="e.g., 4K (3840x2160), 1080p (1920x1080), 8K (7680x4320)"
              value={resolution}
              onChange={setResolution}
              onEnhance={() => onEnhance('Resolution', resolution, setResolution)}
              helpText="Specify the target resolution for the image."
              required
              loading={loading['Resolution']}
            />

            <InputCard
              label="Aspect Ratio"
              placeholder="e.g., 16:9, 1:1, 4:3, 21:9, 3:2"
              value={aspectRatio}
              onChange={setAspectRatio}
              onEnhance={() => onEnhance('Aspect Ratio', aspectRatio, setAspectRatio)}
              helpText="Define the aspect ratio for the image."
              required
              loading={loading['Aspect Ratio']}
            />

            <InputCard
              label="Lighting"
              placeholder="e.g., Golden hour, studio lighting, natural daylight, dramatic shadows"
              value={lighting}
              onChange={setLighting}
              onEnhance={() => onEnhance('Lighting', lighting, setLighting)}
              helpText="Specify the lighting requirements."
              loading={loading['Lighting']}
            />

            <InputCard
              label="Style"
              placeholder="e.g., Photorealistic, digital art, oil painting, minimalist"
              value={style}
              onChange={setStyle}
              onEnhance={() => onEnhance('Style', style, setStyle)}
              helpText="Define the artistic style or visual approach."
              loading={loading['Style']}
            />

            <InputCard
              label="Technical Requirements"
              placeholder="e.g., High detail, professional quality, specific color profile, file format"
              value={technicalRequirements}
              onChange={setTechnicalRequirements}
              onEnhance={() => onEnhance('Technical Requirements', technicalRequirements, setTechnicalRequirements)}
              helpText="Add any specific technical specifications."
              loading={loading['Technical Requirements']}
            />

            <InputCard
              label="Format Constraints"
              placeholder="e.g., Must be suitable for print, web-optimized, mobile-friendly, specific platform requirements"
              value={formatConstraints}
              onChange={setFormatConstraints}
              onEnhance={() => onEnhance('Format Constraints', formatConstraints, setFormatConstraints)}
              helpText="Define any specific format or platform constraints."
              multiline
              loading={loading['Format Constraints']}
            />

            <InputCard
              label="Output Guidelines"
              placeholder="e.g., Include specific keywords, avoid certain elements, focus on particular aspects"
              value={outputGuidelines}
              onChange={setOutputGuidelines}
              onEnhance={() => onEnhance('Output Guidelines', outputGuidelines, setOutputGuidelines)}
              helpText="Add any additional guidelines for the output."
              multiline
              loading={loading['Output Guidelines']}
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
