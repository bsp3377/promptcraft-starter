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
import VideoGeneration from './pages/VideoGeneration'
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
import SummarizationBuilder from './pages/SummarizationBuilder'
import CompareBuilder from './pages/CompareBuilder'
import CriticRefinerBuilder from './pages/CriticRefinerBuilder'
import PlanningBuilder from './pages/PlanningBuilder'
import FrameworksBuilder from './pages/FrameworksBuilder'
import DeliberationBuilder from './pages/DeliberationBuilder'
import OpenEndedBuilder from './pages/OpenEndedBuilder'
import TreeOfThoughtBuilder from './pages/TreeOfThoughtBuilder'
import RefinementWritingBuilder from './pages/RefinementWritingBuilder'
import Browse from './pages/Browse'
import Auth from './pages/Auth'
import StoryboardBuilder from './pages/StoryboardBuilder'
import CinematicBuilder from './pages/CinematicBuilder'
import CharacterConsistencyBuilder from './pages/CharacterConsistencyBuilder'
import KeyframeBuilder from './pages/KeyframeBuilder'
import StyleLockBuilder from './pages/StyleLockBuilder'
import TemporalConsistencyBuilder from './pages/TemporalConsistencyBuilder'
import MotionGuidanceBuilder from './pages/MotionGuidanceBuilder'
import RefinementVideoBuilder from './pages/RefinementVideoBuilder'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'wizard', element: <Wizard /> },
      { path: 'browse', element: <Browse /> },
      { path: 'auth', element: <Auth /> },
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
      { path: 'video', element: <VideoGeneration /> },
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
      { path: 'builder/summarization', element: <SummarizationBuilder /> },
      { path: 'builder/compare-contrast', element: <CompareBuilder /> },
      { path: 'builder/critic-refiner', element: <CriticRefinerBuilder /> },
      { path: 'builder/planning', element: <PlanningBuilder /> },
      { path: 'builder/frameworks', element: <FrameworksBuilder /> },
      { path: 'builder/deliberation', element: <DeliberationBuilder /> },
      { path: 'builder/open-ended', element: <OpenEndedBuilder /> },
      { path: 'builder/tree-of-thought', element: <TreeOfThoughtBuilder /> },
      { path: 'builder/refinement-writing', element: <RefinementWritingBuilder /> },
      { path: 'builder/zero-shot', element: <ZeroShotBuilder /> },
      { path: 'builder/zero-shot/result', element: <ZeroShotResult /> },
      { path: 'builder/reflexion', element: <ReflexionBuilder /> },
      { path: 'builder/storyboard', element: <StoryboardBuilder /> },
      { path: 'builder/cinematic', element: <CinematicBuilder /> },
      { path: 'builder/character-consistency', element: <CharacterConsistencyBuilder /> },
      { path: 'builder/keyframe', element: <KeyframeBuilder /> },
      { path: 'builder/style-lock', element: <StyleLockBuilder /> },
      { path: 'builder/temporal-consistency', element: <TemporalConsistencyBuilder /> },
      { path: 'builder/motion-guidance', element: <MotionGuidanceBuilder /> },
      { path: 'builder/refinement-video', element: <RefinementVideoBuilder /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
