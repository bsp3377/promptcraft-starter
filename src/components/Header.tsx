import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'

export default function Header() {
  const [email, setEmail] = useState<string | null>(null)
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null))
    const { data: sub } = supabase.auth.onAuthStateChange((_, s) => setEmail(s?.user?.email ?? null))
    return () => { sub.subscription.unsubscribe() }
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="font-semibold text-lg">PromptCraft</span>
        </Link>
        <nav className="flex items-center gap-6">
          <a href="#how-it-works" className="text-gray-700 hover:text-gray-900">How it works</a>
          <Link to="/templates" className="text-gray-700 hover:text-gray-900">Template Library</Link>
          <Link to="/history" className="text-gray-700 hover:text-gray-900">History</Link>
          {email ? (
            <button onClick={() => supabase.auth.signOut()} className="text-gray-700 hover:text-gray-900">Sign out ({email})</button>
          ) : (
            <Link to="/auth" className="text-gray-700 hover:text-gray-900">Sign in</Link>
          )}
          <Link to="/wizard" className="inline-flex items-center rounded-full px-5 py-2.5 bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors">
            Start Now
          </Link>
        </nav>
      </div>
    </header>
  )
}
