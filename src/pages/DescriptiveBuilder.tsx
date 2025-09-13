import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InputCard from '../components/InputCard'
import PreviewPanel from '../components/PreviewPanel'
import PrimaryButton from '../components/PrimaryButton'
import { enhanceField, polishFinalPrompt } from '../lib/gemini'

const DESCRIPTIVE_TEMPLATE = `Subject: {{Subject}}
Setting: {{Setting}}
Style & Mood: {{Style}} ({{StyleType}})
Details & Attributes: {{Details}}
Format & Specs: {{Specs}}
Final descriptive prompt: "{{Subject}} {{Setting}} {{Style}} {{Details}} {{Specs}}"`

export default function DescriptiveBuilder() {
  const navigate = useNavigate()
  const [subject, setSubject] = useState('A modern house')
  const [setting, setSetting] = useState('Sunset at the beach')
  const [style, setStyle] = useState('Cinematic, moody lighting')
  const [styleType, setStyleType] = useState('cinematic')
  const [details, setDetails] = useState('Ultra-sharp details, soft natural light, DSLR quality')
  const [specs, setSpecs] = useState('4K resolution, 16:9 aspect ratio')
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)

  const styleOptions = ['cinematic', 'realistic', 'cartoon', 'abstract', 'pastel', 'noir', 'cyberpunk']

  const handleEnhance = async (fieldLabel: string, value: string, setter: (value: string) => void) => {
    try {
      const improved = await enhanceField(fieldLabel, value)
      setter(improved)
    } catch (error) {
      console.error('Enhancement failed:', error)
    }
  }

  const handleGenerate = async () => {
    if (!subject.trim() || !setting.trim() || !style.trim()) return

    setLoading(true)
    try {
      const compiled = DESCRIPTIVE_TEMPLATE
        .replaceAll('{{Subject}}', subject)
        .replaceAll('{{Setting}}', setting)
        .replaceAll('{{Style}}', style)
        .replaceAll('{{StyleType}}', styleType)
        .replaceAll('{{Details}}', details)
        .replaceAll('{{Specs}}', specs)
      
      const finalText = await polishFinalPrompt(compiled)
      setPreview(finalText)
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const canGenerate = subject.trim() && setting.trim() && style.trim()

  return (
    <div className="py-12">
      {/* Back Navigation */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/image')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Descriptive Prompt Builder
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Craft vivid, detailed prompts for image or video generation. Fill in each field and enhance with AI.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Fill in the details</h2>
          
          <InputCard
            label="What is the main subject?"
            placeholder="e.g., A modern house / A female model in a red dress / A futuristic city skyline"
            value={subject}
            onChange={setSubject}
            onEnhance={() => handleEnhance('Subject', subject, setSubject)}
            helpText="Be specific about the subject type, attributes, and pose if relevant."
            required
          />

          <InputCard
            label="Where does it take place?"
            placeholder="e.g., Sunset at the beach / Busy Tokyo street / Snow-covered mountain village"
            value={setting}
            onChange={setSetting}
            onEnhance={() => handleEnhance('Setting', setting, setSetting)}
            helpText="Add time of day, weather, season, and notable landmarks."
            required
          />

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <label className="font-medium text-gray-900">
                What style, mood, or vibe should it have?
              </label>
              <button
                onClick={() => handleEnhance('Style', style, setStyle)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                ✨ Enhance Style with AI
              </button>
            </div>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="e.g., Cinematic, moody lighting / Minimalist, pastel colors / Hyper-realistic, futuristic sci-fi look"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
              <button
                onClick={() => setStyleType('cinematic')}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Cinematic
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {styleOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setStyleType(option)
                    setStyle(option === 'cinematic' ? 'Cinematic, moody lighting' :
                             option === 'realistic' ? 'Hyper-realistic, detailed' :
                             option === 'cartoon' ? 'Cartoon style, vibrant colors' :
                             option === 'abstract' ? 'Abstract, artistic interpretation' :
                             option === 'pastel' ? 'Soft pastel colors, dreamy' :
                             option === 'noir' ? 'Film noir, black and white' :
                             'Cyberpunk, neon colors')
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    styleType === option
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            
            <p className="text-sm text-gray-500">Use the dropdown for quick picks: cinematic, realistic, cartoon, abstract, pastel, noir, cyberpunk.</p>
          </div>

          <InputCard
            label="What extra details should be included?"
            placeholder="e.g., Ultra-sharp details, soft natural light, DSLR quality / Wearing sneakers, carrying a coffee cup / Flying cars, neon signs"
            value={details}
            onChange={setDetails}
            onEnhance={() => handleEnhance('Details', details, setDetails)}
            helpText="Mention lighting, lens, materials, clothing, motion, foreground/background elements."
            required
          />

          <InputCard
            label="Any technical requirements? (Optional)"
            placeholder="e.g., 4K resolution, 16:9 aspect ratio / Square format, ultra-detailed / Digital painting, oil-painting texture"
            value={specs}
            onChange={setSpecs}
            onEnhance={() => handleEnhance('Specs', specs, setSpecs)}
            helpText="Include resolution, aspect ratio, engine, sampler, seed, or medium if relevant."
          />

          <div className="pt-4">
            <PrimaryButton
              onClick={handleGenerate}
              disabled={!canGenerate}
              loading={loading}
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
  )
}
