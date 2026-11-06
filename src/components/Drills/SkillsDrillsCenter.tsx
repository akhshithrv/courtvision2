import {
  Award,
  ChevronRight,
  Dumbbell,
  Flame,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Timer,
  Trash2,
  X
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useBasketball } from '../../context/BasketballContext';
import { STANDARD_DRILLS } from '../../data/drillDefinitions';
import { DrillCategory, DrillDefinition, DrillLog } from '../../types/basketball';

export const SkillsDrillsCenter: React.FC = () => {
  const { drillLogs, addDrillLog, deleteDrillLog } = useBasketball();
  const [selectedCategory, setSelectedCategory] = useState<'all' | DrillCategory>('all');
  const [activeDrill, setActiveDrill] = useState<DrillDefinition | null>(null);

  // Active Drill Runner State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [runnerNotes, setRunnerNotes] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  // Filtered drills
  const filteredDrills = useMemo(() => {
    if (selectedCategory === 'all') return STANDARD_DRILLS;
    return STANDARD_DRILLS.filter((d) => d.category === selectedCategory);
  }, [selectedCategory]);

  // Personal Bests per drill
  const personalBests = useMemo(() => {
    const map = new Map<string, number>();
    for (const log of drillLogs) {
      const prev = map.get(log.drillId) || 0;
      if (log.completedValue > prev) {
        map.set(log.drillId, log.completedValue);
      }
    }
    return map;
  }, [drillLogs]);

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleStartDrill = (drill: DrillDefinition) => {
    setActiveDrill(drill);
    setTimerSeconds(0);
    setIsTimerRunning(true);
    setCurrentScore(0);
    setRunnerNotes('');
    setIsFinished(false);
  };

  const handleFinishDrill = () => {
    if (!activeDrill) return;
    setIsTimerRunning(false);
    setIsFinished(true);

    const percentageScore =
      activeDrill.targetCount > 0
        ? Math.min(100, Math.round((currentScore / activeDrill.targetCount) * 1000) / 10)
        : 100;

    const newLog: DrillLog = {
      id: `dlog_${Date.now()}`,
      drillId: activeDrill.id,
      drillName: activeDrill.name,
      category: activeDrill.category,
      date: new Date().toISOString().slice(0, 10),
      completedValue: currentScore,
      targetValue: activeDrill.targetCount,
      percentageScore,
      durationSeconds: timerSeconds,
      notes: runnerNotes.trim() || undefined,
    };

    addDrillLog(newLog);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      {/* Header & Category Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Basketball Skills &amp; Drill Center
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Structured spot-up shooting routines, heavy ball-handling workouts, and agility tests
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#131b2e] rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#FF5722] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Workouts
          </button>
          <button
            onClick={() => setSelectedCategory('shooting')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              selectedCategory === 'shooting'
                ? 'bg-[#FF5722] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Shooting Drills
          </button>
          <button
            onClick={() => setSelectedCategory('ball_handling')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              selectedCategory === 'ball_handling'
                ? 'bg-[#FF5722] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ball-Handling
          </button>
          <button
            onClick={() => setSelectedCategory('conditioning')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              selectedCategory === 'conditioning'
                ? 'bg-[#FF5722] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Conditioning
          </button>
        </div>
      </div>

      {/* Drill Library Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDrills.map((drill) => {
          const pb = personalBests.get(drill.id);
          const isShooting = drill.category === 'shooting';

          return (
            <div
              key={drill.id}
              className="bg-[#131b2e] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider ${
                      isShooting
                        ? 'text-[#FF5722]'
                        : drill.category === 'ball_handling'
                        ? 'text-[#00E5FF]'
                        : 'text-emerald-400'
                    }`}
                  >
                    {drill.category.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-mono font-medium text-slate-400 px-2 py-0.5 rounded bg-[#090d16] border border-slate-800">
                    {drill.difficulty}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-white transition-colors">
                  {drill.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {drill.description}
                </p>

                {/* Drill Target & Instructions */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                  <span>
                    Goal: <strong className="text-white font-mono">{drill.targetCount} {drill.unit}</strong>
                  </span>
                  {pb !== undefined ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                      <Award className="w-3.5 h-3.5" />
                      PR: {pb} {drill.unit}
                    </span>
                  ) : (
                    <span className="text-slate-500 text-[11px]">No PR yet</span>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3">
                <button
                  type="button"
                  onClick={() => handleStartDrill(drill)}
                  className="w-full py-2.5 px-4 bg-slate-800/90 hover:bg-[#FF5722] text-slate-200 hover:text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Start Workout Drill
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completed Drill History Feed */}
      <div className="bg-[#131b2e] rounded-2xl border border-slate-800 p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-[#FF5722]" />
            <h2 className="text-base font-bold text-white">
              Recent Drill Log History
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            {drillLogs.length} total drill sessions
          </span>
        </div>

        {drillLogs.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-500">
            No drill logs recorded yet. Pick a drill above and start your workout!
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {drillLogs.slice(0, 10).map((log) => (
              <div
                key={log.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-800/20 px-2 rounded-xl transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      {log.drillName}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      · {log.date}
                    </span>
                  </div>
                  {log.notes && (
                    <p className="text-xs text-slate-400 mt-0.5 italic">
                      "{log.notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Score</span>
                    <span className="font-mono text-sm font-bold text-white">
                      <strong className="text-emerald-400">{log.completedValue}</strong> / {log.targetValue}
                      {log.percentageScore !== undefined && (
                        <span className="text-xs text-slate-400 ml-1.5">
                          ({log.percentageScore}%)
                        </span>
                      )}
                    </span>
                  </div>
                  {log.durationSeconds !== undefined && log.durationSeconds > 0 && (
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Time</span>
                      <span className="font-mono text-xs text-slate-300">
                        {formatSeconds(log.durationSeconds)}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => deleteDrillLog(log.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/20 transition-colors"
                    title="Delete log"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Drill Runner Modal */}
      {activeDrill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#0d1424] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5722]">
                  Active Training Session
                </span>
                <h3 className="text-lg font-bold text-white">
                  {activeDrill.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveDrill(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drill Instructions Snippet */}
            <div className="bg-[#131b2e] p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <span className="font-semibold text-white block">Instructions:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                {activeDrill.instructions.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>

            {/* Timer & Counter Display */}
            <div className="grid grid-cols-2 gap-4 text-center">
              {/* Timer Box */}
              <div className="bg-[#090d16] p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                  <Timer className="w-3.5 h-3.5" /> Stopwatch
                </span>
                <span className="text-3xl font-mono font-bold text-[#00E5FF] tabular-nums">
                  {formatSeconds(timerSeconds)}
                </span>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                  >
                    {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimerSeconds(0)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Rep / Shot Score Box */}
              <div className="bg-[#090d16] p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
                <span className="text-[11px] text-slate-400 mb-1">
                  Completed {activeDrill.unit}
                </span>
                <span className="text-3xl font-mono font-bold text-white tabular-nums">
                  {currentScore} <span className="text-base text-slate-500 font-normal">/ {activeDrill.targetCount}</span>
                </span>
                <div className="flex items-center gap-1.5 mt-3">
                  <button
                    type="button"
                    onClick={() => setCurrentScore((prev) => Math.max(0, prev - 1))}
                    className="px-2.5 py-1.5 text-xs font-mono font-bold bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
                  >
                    -1
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentScore((prev) => prev + 1)}
                    className="px-3.5 py-1.5 text-xs font-mono font-bold bg-[#FF5722] text-white rounded-lg hover:bg-[#F4511E]"
                  >
                    +1
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentScore((prev) => prev + 5)}
                    className="px-2.5 py-1.5 text-xs font-mono font-bold bg-slate-800 text-white rounded-lg hover:bg-slate-700"
                  >
                    +5
                  </button>
                </div>
              </div>
            </div>

            {/* Drill Notes */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Workout Session Notes
              </label>
              <input
                type="text"
                value={runnerNotes}
                onChange={(e) => setRunnerNotes(e.target.value)}
                placeholder="e.g. Great rhythm, hit 15 in a row..."
                className="w-full px-3 py-2 text-xs bg-[#131b2e] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#FF5722]"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveDrill(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={() => {
                  handleFinishDrill();
                  setActiveDrill(null);
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-950/40 transition-all"
              >
                Complete &amp; Log Drill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
