import {
  Activity,
  BarChart3,
  Dumbbell,
  Flame,
  LayoutDashboard,
  Plus,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';
import React, { useState } from 'react';
import { TrendsAnalyticsExplorer } from './components/Analytics/TrendsAnalyticsExplorer';
import { AthleticLab } from './components/Athletics/AthleticLab';
import { CourtStudioView } from './components/CourtStudio/CourtStudioView';
import { DashboardOverview } from './components/Dashboard/DashboardOverview';
import { SkillsDrillsCenter } from './components/Drills/SkillsDrillsCenter';
import { WorkoutStudioModal } from './components/WorkoutStudio/WorkoutStudioModal';
import { BasketballProvider, useBasketball } from './context/BasketballContext';
import { WorkoutSession } from './types/basketball';

type TabView = 'dashboard' | 'court_studio' | 'drills' | 'athletics' | 'trends';

function CourtVisionApp() {
  const [activeTab, setActiveTab] = useState<TabView>('dashboard');
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const { addSession } = useBasketball();

  const handleSaveWorkout = (session: WorkoutSession) => {
    addSession(session);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-[#FF5722] selection:text-white pb-20 md:pb-10">
      {/* Top Bar Contract (Strict 1-Row, 3-Zone Architecture) */}
      <header className="sticky top-0 z-40 bg-[#0B0F17]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element Brand Wordmark */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 text-left text-lg font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-[#FF5722] flex items-center justify-center text-white shadow-md shadow-[#FF5722]/30 group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4 fill-current" />
            </div>
            <span>
              Court<span className="text-[#FF5722]">Vision</span>
            </span>
          </button>

          {/* Zone 2: 4-5 Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-400">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'dashboard'
                  ? 'text-white border-[#FF5722]'
                  : 'border-transparent text-slate-400'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('court_studio')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'court_studio'
                  ? 'text-white border-[#FF5722]'
                  : 'border-transparent text-slate-400'
              }`}
            >
              Court Studio
            </button>
            <button
              onClick={() => setActiveTab('drills')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'drills'
                  ? 'text-white border-[#FF5722]'
                  : 'border-transparent text-slate-400'
              }`}
            >
              Skills &amp; Drills
            </button>
            <button
              onClick={() => setActiveTab('athletics')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'athletics'
                  ? 'text-white border-[#FF5722]'
                  : 'border-transparent text-slate-400'
              }`}
            >
              Athletic Lab
            </button>
            <button
              onClick={() => setActiveTab('trends')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'trends'
                  ? 'text-white border-[#FF5722]'
                  : 'border-transparent text-slate-400'
              }`}
            >
              Trends
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsWorkoutModalOpen(true)}
              className="px-4 py-2 bg-[#FF5722] hover:bg-[#F4511E] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#FF5722]/20 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Log Workout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            onOpenNewWorkout={() => setIsWorkoutModalOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}
        {activeTab === 'court_studio' && (
          <CourtStudioView onOpenNewWorkout={() => setIsWorkoutModalOpen(true)} />
        )}
        {activeTab === 'drills' && <SkillsDrillsCenter />}
        {activeTab === 'athletics' && <AthleticLab />}
        {activeTab === 'trends' && <TrendsAnalyticsExplorer />}
      </main>

      {/* Interactive Workout Studio Modal */}
      <WorkoutStudioModal
        isOpen={isWorkoutModalOpen}
        onClose={() => setIsWorkoutModalOpen(false)}
        onSaveSession={handleSaveWorkout}
      />

      {/* Mobile Fixed Bottom Tab Bar (Thumb Zone Navigation) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F17]/95 backdrop-blur-md border-t border-slate-800 grid grid-cols-5 items-center h-16 px-1">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'dashboard' ? 'text-[#FF5722]' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('court_studio')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'court_studio' ? 'text-[#FF5722]' : 'text-slate-400'
          }`}
        >
          <Target className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Court</span>
        </button>

        <button
          onClick={() => setIsWorkoutModalOpen(true)}
          className="flex flex-col items-center justify-center min-h-[44px] text-white"
        >
          <div className="w-10 h-10 rounded-full bg-[#FF5722] flex items-center justify-center shadow-lg shadow-[#FF5722]/30 active:scale-95 transition-transform -mt-4">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-1">Log</span>
        </button>

        <button
          onClick={() => setActiveTab('drills')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'drills' ? 'text-[#FF5722]' : 'text-slate-400'
          }`}
        >
          <Dumbbell className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Drills</span>
        </button>

        <button
          onClick={() => setActiveTab('trends')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'trends' ? 'text-[#FF5722]' : 'text-slate-400'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Trends</span>
        </button>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <BasketballProvider>
      <CourtVisionApp />
    </BasketballProvider>
  );
}
