import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import ImageUpload from '../components/ImageUpload'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const MULTI_SHOT_TEMPLATE = `Create image prompts using the following examples as reference:

Examples:
{{Examples}}

{{ImageReference}}

Style Guidelines:
{{StyleGuidelines}}

Output Format:
{{OutputFormat}}

Instructions:
- Follow the pattern and style demonstrated in the examples
- Maintain consistency with the provided format
- Adapt the structure to your specific needs
- Keep the same level of detail and specificity
{{ImageGuidelines}}`

export default function MultiShotBuilder() {
  const navigate = useNavigate()
  const [examples, setExamples] = useState('')
  const [styleGuidelines, setStyleGuidelines] = useState('')
  const [outputFormat, setOutputFormat] = useState('')
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
    if (!examples.trim() || !outputFormat.trim()) return

    setLoading((s)=>({...s, generate: true}));
    try {
      const imageReference = referenceImage 
        ? `Reference Image: Use the attached image as a visual reference to understand the style, composition, and visual elements that should be incorporated into the generated prompts.`
        : ''
      
      const imageGuidelines = referenceImage
        ? `- Use the reference image to inform the style and visual approach
- Ensure generated prompts align with the reference image's aesthetic
- Adapt the reference style to match the example patterns provided`
        : ''

      const compiled = MULTI_SHOT_TEMPLATE
        .replaceAll('{{Examples}}', examples)
        .replaceAll('{{ImageReference}}', imageReference)
        .replaceAll('{{StyleGuidelines}}', styleGuidelines)
        .replaceAll('{{OutputFormat}}', outputFormat)
        .replaceAll('{{ImageGuidelines}}', imageGuidelines)

      const finalText = await polishFinalPrompt(compiled)
      setPreview(finalText)
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setLoading((s)=>({...s, generate: false}));
    }
  }

  const canGenerate = examples.trim() && outputFormat.trim()

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
            Multi-shot Examples Builder
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Create image prompts by providing 2-3 strong examples that demonstrate the style and format you want to follow.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Fill in the details</h2>

            <InputCard
              label="Examples"
              placeholder={`Example 1: "A serene mountain lake at sunset, golden hour lighting, photorealistic style, 4K resolution, peaceful atmosphere"

Example 2: "Urban street scene at night, neon lights reflecting on wet pavement, cinematic lighting, high contrast, moody atmosphere"

Example 3: "Close-up portrait of an elderly woman, soft natural lighting, shallow depth of field, warm color palette, intimate mood"`}
              value={examples}
              onChange={setExamples}
              onEnhance={() => onEnhance('Examples', examples, setExamples)}
              helpText="Provide 2-3 strong image prompt examples that demonstrate the style you want to follow."
              required
              multiline
              loading={loading['Examples']}
            />

            <InputCard
              label="Style Guidelines"
              placeholder="e.g., Always include lighting description, use specific artistic styles, maintain consistent detail level"
              value={styleGuidelines}
              onChange={setStyleGuidelines}
              onEnhance={() => onEnhance('Style Guidelines', styleGuidelines, setStyleGuidelines)}
              helpText="Describe the key patterns or guidelines from your examples."
              loading={loading['Style Guidelines']}
            />

            <InputCard
              label="Output Format"
              placeholder="e.g., Single detailed prompt, Multiple variations, Structured format with sections"
              value={outputFormat}
              onChange={setOutputFormat}
              onEnhance={() => onEnhance('Output Format', outputFormat, setOutputFormat)}
              helpText="Specify how you want the final prompts to be formatted."
              required
              loading={loading['Output Format']}
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
