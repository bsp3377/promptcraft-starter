import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App'
import Landing from './pages/Landing'
import Wizard from './pages/Wizard'
import Output from './pages/Output'
import BusinessStrategy from './pages/BusinessStrategy'
import CodingAssistant from './pages/CodingAssistant'
import CreativeWriting from './pages/CreativeWriting'
import ChatbotAssistant from './pages/ChatbotAssistant'
import LearningTutors from './pages/LearningTutors'
import Research from './pages/Research'
import PodcastScripts from './pages/PodcastScripts'
import Copywriting from './pages/Copywriting'
import ImageGeneration from './pages/ImageGeneration'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'wizard', element: <Wizard /> },
      { path: 'output', element: <Output /> },
      { path: 'business', element: <BusinessStrategy /> },
      { path: 'coding', element: <CodingAssistant /> },
      { path: 'creative', element: <CreativeWriting /> },
      { path: 'chatbot', element: <ChatbotAssistant /> },
      { path: 'learning', element: <LearningTutors /> },
      { path: 'research', element: <Research /> },
      { path: 'podcast', element: <PodcastScripts /> },
      { path: 'copywriting', element: <Copywriting /> },
      { path: 'image', element: <ImageGeneration /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
