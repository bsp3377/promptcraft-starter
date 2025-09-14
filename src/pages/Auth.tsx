import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <div className="py-12 max-w-lg mx-auto px-4 md:px-8">
      <h1 className="text-3xl font-bold mb-6">Sign in</h1>
      <p className="text-gray-600 mb-6">We’ll send a magic link to your email.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="you@example.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
        <button className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700">Send magic link</button>
      </form>
      {sent && <p className="text-green-700 mt-4">Check your inbox for the sign-in link.</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  )
}


