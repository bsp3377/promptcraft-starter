import { useLocation, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'

export default function Output() {
  const nav = useNavigate()
  const { state } = useLocation() as { state?: { idea: string; type: string; answers: Record<string,string> } }
  const idea = state?.idea ?? ''
  const type = state?.type ?? ''
  const answers = state?.answers ?? {}

  if (!idea) {
    nav('/')
  }

  const prompt = useMemo(() => {
    const entries = Object.entries(answers).filter(([,v]) => v?.trim())
    const bullet = entries.map(([k,v]) => `- ${k}: ${v}`).join('\n')
    return `Role: Expert ${type || 'Creator'}
Task: Create based on the idea.
Idea: ${idea}

Guidelines:
${bullet || '- (no extra details provided)'}

Output: Provide a concise, high-quality result following the above.`
  }, [answers, idea, type])

  function copy() {
    navigator.clipboard.writeText(prompt)
    alert('Copied prompt to clipboard!')
  }

  return (
    <section className="py-10 space-y-4">
      <h2 className="text-2xl font-semibold">Perfect prompt</h2>
      <p className="text-gray-600">Copy and use this prompt in your favorite AI tool.</p>

      <div className="rounded-2xl border p-4">
        <pre className="whitespace-pre-wrap text-sm">{prompt}</pre>
      </div>

      <div className="flex gap-2">
        <button onClick={copy} className="rounded-xl px-4 py-2 border bg-gray-900 text-white">Copy</button>
        <button onClick={() => nav('/')} className="rounded-xl px-4 py-2 border">Start over</button>
      </div>
    </section>
  )
}
