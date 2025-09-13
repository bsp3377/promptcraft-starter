import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] bg-white">
      <Header />
      <main className="max-w-7xl mx-auto w-full px-4 md:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
