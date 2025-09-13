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
import RoleplayBuilder from './pages/RoleplayBuilder'
import FewShotBuilder from './pages/FewShotBuilder'
import StructuredOutputBuilder from './pages/StructuredOutputBuilder'
import ChainOfThoughtBuilder from './pages/ChainOfThoughtBuilder'
import DescriptiveBuilder from './pages/DescriptiveBuilder'
import MultiShotBuilder from './pages/MultiShotBuilder'
import FormatConstrainedBuilder from './pages/FormatConstrainedBuilder'
import StyleTransferBuilder from './pages/StyleTransferBuilder'
import FewShotCopywritingBuilder from './pages/FewShotCopywritingBuilder'
import AudienceBasedBuilder from './pages/AudienceBasedBuilder'
import RefinementBuilder from './pages/RefinementBuilder'
import ZeroShotBuilder from './pages/ZeroShotBuilder'
import ZeroShotResult from './pages/ZeroShotResult'
import ReflexionBuilder from './pages/ReflexionBuilder'
import ZeroShotCodingBuilder from './pages/ZeroShotCodingBuilder'
import ReflexionCodingBuilder from './pages/ReflexionCodingBuilder'
import StyleTransferPodcastBuilder from './pages/StyleTransferPodcastBuilder'
import CreativeExpansionBuilder from './pages/CreativeExpansionBuilder'

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
      { path: 'category/podcast-scripts', element: <PodcastScripts /> },
      { path: 'copywriting', element: <Copywriting /> },
      { path: 'image', element: <ImageGeneration /> },
      { path: 'builder/roleplay', element: <RoleplayBuilder /> },
      { path: 'builder/few-shot', element: <FewShotBuilder /> },
      { path: 'builder/structured-output', element: <StructuredOutputBuilder /> },
      { path: 'builder/chain-of-thought', element: <ChainOfThoughtBuilder /> },
      { path: 'builder/descriptive', element: <DescriptiveBuilder /> },
      { path: 'builder/multi-shot', element: <MultiShotBuilder /> },
      { path: 'builder/format-constrained', element: <FormatConstrainedBuilder /> },
      { path: 'category/copywriting', element: <Copywriting /> },
      { path: 'copywriting/style-transfer', element: <StyleTransferBuilder /> },
      { path: 'copywriting/few-shot', element: <FewShotCopywritingBuilder /> },
      { path: 'copywriting/audience-based', element: <AudienceBasedBuilder /> },
      { path: 'copywriting/refinement', element: <RefinementBuilder /> },
      { path: 'builder/zero-shot', element: <ZeroShotBuilder /> },
      { path: 'builder/zero-shot/result', element: <ZeroShotResult /> },
      { path: 'builder/reflexion', element: <ReflexionBuilder /> },
      { path: 'coding/zero-shot', element: <ZeroShotCodingBuilder /> },
      { path: 'coding/reflexion', element: <ReflexionCodingBuilder /> },
      { path: 'podcast-scripts/style-transfer', element: <StyleTransferPodcastBuilder /> },
      { path: 'podcast-scripts/creative-expansion', element: <CreativeExpansionBuilder /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
