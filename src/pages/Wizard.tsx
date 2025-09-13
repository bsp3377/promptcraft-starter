import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'

type Q = { id: string; label: string; placeholder?: string }

export default function Wizard() {
  const nav = useNavigate()
  const { state } = useLocation() as { state?: { idea: string; type: string } }
  const idea = state?.idea ?? ''
  const baseType = state?.type ?? 'Image'

  useEffect(() => {
    if (!idea) nav('/')
  }, [idea, nav])

  const questions: Q[] = useMemo(() => {
    // simple dynamic set
    if (baseType === 'Image') {
      return [
        { id: 'style', label: 'Style (e.g., studio, candid, cinematic)' },
        { id: 'lighting', label: 'Lighting (e.g., soft, natural, dramatic)' },
        { id: 'elements', label: 'Key elements/props' },
        { id: 'quality', label: 'Quality (resolution/aspect ratio)' },
      ]
    }
    if (baseType === 'Video') {
      return [
        { id: 'duration', label: 'Duration (e.g., 10s, 30s)' },
        { id: 'shot', label: 'Shot type (e.g., close-up, wide, POV)' },
        { id: 'music', label: 'Music/mood' },
        { id: 'captions', label: 'Captions or on-screen text?' },
      ]
    }
    if (baseType === 'App/Code') {
      return [
        { id: 'stack', label: 'Tech stack preference (React, Vue, Flutter, etc.)' },
        { id: 'features', label: 'Key features (auth, dashboard, payments, etc.)' },
        { id: 'data', label: 'Data model or integrations (Supabase, Stripe, etc.)' },
      ]
    }
    return [
      { id: 'tone', label: 'Tone/voice' },
      { id: 'length', label: 'Length/word count' },
      { id: 'audience', label: 'Target audience' },
    ]
  }, [baseType])

  const [answers, setAnswers] = useState<Record<string,string>>({})

  function handleNext() {
    nav('/output', { state: { idea, type: baseType, answers } })
  }

  return (
    <section className="py-10">
      <h2 className="text-2xl font-semibold">Quick questions</h2>
      <p className="text-gray-600 mt-1">We’ll tailor the final prompt from these.</p>

      <div className="mt-6 space-y-4">
        <div className="rounded-2xl border p-4">
          <div className="text-sm text-gray-500">Idea</div>
          <div className="font-medium">{idea}</div>
          <div className="text-xs text-gray-500 mt-1">Type: {baseType}</div>
        </div>

        {questions.map(q => (
          <div key={q.id} className="rounded-2xl border p-4">
            <label className="block text-sm mb-1">{q.label}</label>
            <input
              className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              placeholder={q.placeholder ?? 'Type your answer...'}
              value={answers[q.id] ?? ''}
              onChange={(e) => setAnswers(prev => ({...prev, [q.id]: e.target.value}))}
            />
          </div>
        ))}

        <div className="flex justify-end">
          <button onClick={handleNext} className="rounded-xl px-4 py-2 border bg-gray-900 text-white">
            Generate Prompt
          </button>
        </div>
      </div>
    </section>
  )
}
