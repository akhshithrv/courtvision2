import {
  Activity,
  ArrowRight,
  Award,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Dumbbell,
  Eye,
  Flame,
  Plus,
  Target,
  Trash2,
  TrendingUp,
  X,
  Zap
} from 'lucide-react';
import React, { useState } from 'react';
import { useBasketball } from '../../context/BasketballContext';
import { COURT_ZONES } from '../../data/courtZones';
import { CourtZoneId, WorkoutSession } from '../../types/basketball';
import { HalfCourtSvg } from '../Court/HalfCourtSvg';

interface DashboardOverviewProps {
  onOpenNewWorkout: () => void;
  onNavigateTab: (tab: 'dashboard' | 'court_studio' | 'drills' | 'athletics' | 'trends') => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onOpenNewWorkout,
  onNavigateTab,
}) => {
  const {
    sessions,
    deleteSession,
    allShotsCount,
    allMakesCount,
    overallFgPercentage,
    twoPointStats,
    threePointStats,
    zoneAggregates,
    streakDays,
    bestVerticalJump,
    bestSprintTime,
  } = useBasketball();

  const [selectedZone, setSelectedZone] = useState<CourtZoneId | null>(null);
  const [inspectingSession, setInspectingSession] = useState<WorkoutSession | null>(null);

  // Recent 5 workouts
  const recentSessions = sessions.slice(0, 5);

  const selectedZoneData = selectedZone ? zoneAggregates[selectedZone] : null;

  return (
    <div className="space-y-8">
      {/* Hero Welcome & Quick Stats Banner */}
      <div className="relative bg-gradient-to-r from-[#101726] via-[#141C2E] to-[#1a233a] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF5722]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#FF5722]">
              <Flame className="w-4 h-4 fill-current" />
              <span>CourtVision Performance Analytics</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Elevate Your Game. Track Every Shot.
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Real-time court shot charting, field goal percentages, ball-handling workouts, and combine athletic benchmarks.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenNewWorkout}
              className="w-full sm:w-auto px-5 py-3 bg-[#FF5722] hover:bg-[#F4511E] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#FF5722]/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Log New Workout
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('drills')}
              className="w-full sm:w-auto px-5 py-3 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700/80 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Target className="w-4 h-4 text-[#00E5FF]" />
              Start Skill Drill
            </button>
          </div>
        </div>
      </div>

      {/* KPI Ribbons: 5 Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Metric 1: Overall FG% */}
        <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Overall FG %
          </span>
          <div className="my-2">
            <span className="text-3xl font-mono font-extrabold text-[#00E5FF] tabular-nums">
              {allShotsCount > 0 ? `${overallFgPercentage}%` : '—'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            <strong className="text-white">{allMakesCount}</strong> makes / {allShotsCount}
          </div>
        </div>

        {/* Metric 2: 3-Point % */}
        <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            3-Point %
          </span>
          <div className="my-2">
            <span className="text-3xl font-mono font-extrabold text-[#FF5722] tabular-nums">
              {threePointStats.attempts > 0 ? `${threePointStats.percentage}%` : '—'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            <strong className="text-white">{threePointStats.makes}</strong> / {threePointStats.attempts} shots
          </div>
        </div>

        {/* Metric 3: 2-Point % */}
        <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            2-Point %
          </span>
          <div className="my-2">
            <span className="text-3xl font-mono font-extrabold text-emerald-400 tabular-nums">
              {twoPointStats.attempts > 0 ? `${twoPointStats.percentage}%` : '—'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            <strong className="text-white">{twoPointStats.makes}</strong> / {twoPointStats.attempts} shots
          </div>
        </div>

        {/* Metric 4: Streak */}
        <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-[#FF5722]" /> Practice Streak
          </span>
          <div className="my-2">
            <span className="text-3xl font-mono font-extrabold text-white tabular-nums">
              {streakDays} <span className="text-base text-slate-400 font-normal">days</span>
            </span>
          </div>
          <div className="text-[11px] text-emerald-400 font-medium">
            Active training rhythm
          </div>
        </div>

        {/* Metric 5: Peak Vertical Jump */}
        <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-4 shadow-md col-span-2 md:col-span-1 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-purple-400" /> Max Vertical PR
          </span>
          <div className="my-2">
            <span className="text-3xl font-mono font-extrabold text-white tabular-nums">
              {bestVerticalJump > 0 ? `${bestVerticalJump}"` : '—'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            Sprint: <strong className="text-white font-mono">{bestSprintTime}s</strong>
          </div>
        </div>
      </div>

      {/* Main Split: Court Heatmap vs Recent Workout Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Court Heatmap */}
        <div className="lg:col-span-6 bg-[#131b2e] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-[#FF5722]" />
                All-Time Shooting Heatmap
              </h2>
              <p className="text-xs text-slate-400">
                Click any zone to inspect makes, attempts, and shot distance
              </p>
            </div>
            {selectedZone && (
              <button
                onClick={() => setSelectedZone(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Clear Selection
              </button>
            )}
          </div>

          <HalfCourtSvg
            zoneStats={zoneAggregates}
            selectedZoneId={selectedZone}
            onSelectZone={(zoneId) => setSelectedZone(zoneId)}
            showHeatmap={true}
            showShots={false}
            interactive={true}
            className="w-full"
          />

          {/* Selected Zone Deep Dive Card */}
          {selectedZoneData && (
            <div className="bg-[#090d16] p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] uppercase tracking-wider">
                  Zone Breakdown
                </span>
                <h4 className="text-sm font-bold text-white">{selectedZoneData.name}</h4>
              </div>
              <div className="flex items-center gap-4 text-right font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block">Makes / Taken</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {selectedZoneData.makes} / {selectedZoneData.attempts}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Accuracy</span>
                  <span className="text-white font-bold text-base">
                    {selectedZoneData.percentage}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Recent Workout Sessions Timeline */}
        <div className="lg:col-span-6 bg-[#131b2e] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#00E5FF]" />
                Recent Workout &amp; Game Sessions
              </h2>
              <p className="text-xs text-slate-400">
                Click any workout to view its individual court shot chart
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('trends')}
              className="text-xs font-semibold text-[#FF5722] hover:underline flex items-center gap-1"
            >
              View Trends <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentSessions.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-500">
              No workouts logged yet. Click "+ Log New Workout" to record your first session!
            </div>
          ) : (
            <div className="divide-y divide-slate-800/70">
              {recentSessions.map((session) => {
                const sMakes = session.shots.filter((s) => s.isMade).length;
                const sAttempts = session.shots.length;
                const sFg = sAttempts > 0 ? Math.round((sMakes / sAttempts) * 1000) / 10 : 0;

                return (
                  <div
                    key={session.id}
                    className="py-3.5 flex items-center justify-between gap-3 group hover:bg-slate-800/30 px-2 rounded-xl transition-colors cursor-pointer"
                    onClick={() => setInspectingSession(session)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white truncate">
                          {session.title}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 capitalize">
                          · {session.sessionType.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>{session.date}</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {session.durationMinutes}m
                        </span>
                        {session.notes && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="truncate italic text-slate-500 max-w-[150px]">
                              "{session.notes}"
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="font-mono text-base font-bold text-white block">
                          {sFg}%
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {sMakes}/{sAttempts} FG
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete session "${session.title}"?`)) {
                            deleteSession(session.id);
                          }
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/20 transition-colors"
                        title="Delete workout"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={onOpenNewWorkout}
              className="w-full py-2.5 bg-slate-800 hover:bg-[#FF5722] text-slate-300 hover:text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Log Another Session
            </button>
          </div>
        </div>
      </div>

      {/* Inspect Session Shot Chart Modal */}
      {inspectingSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-[#0d1424] border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#FF5722]">
                  Session Shot Chart Breakdown
                </span>
                <h3 className="text-lg font-bold text-white">
                  {inspectingSession.title}
                </h3>
                <span className="text-xs text-slate-400">
                  {inspectingSession.date} · {inspectingSession.durationMinutes} mins · {inspectingSession.shots.length} shots recorded
                </span>
              </div>
              <button
                onClick={() => setInspectingSession(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-center">
              <HalfCourtSvg
                shots={inspectingSession.shots}
                showHeatmap={true}
                showShots={true}
                interactive={false}
                className="w-full max-w-md"
              />
            </div>

            {inspectingSession.notes && (
              <div className="p-3 bg-[#131b2e] rounded-xl border border-slate-800 text-xs text-slate-300 italic">
                "{inspectingSession.notes}"
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectingSession(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
