import {
  CheckCircle2,
  Clock,
  RotateCcw,
  Target,
  Trash2,
  X
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { COURT_ZONES, determineZoneFromCoordinates, estimateDistanceFeet, ZONE_MAP } from '../../data/courtZones';
import { CourtZoneId, SessionType, ShotRecord, WorkoutSession } from '../../types/basketball';
import { HalfCourtSvg } from '../Court/HalfCourtSvg';

interface WorkoutStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSession: (session: WorkoutSession) => void;
}

export const WorkoutStudioModal: React.FC<WorkoutStudioModalProps> = ({
  isOpen,
  onClose,
  onSaveSession,
}) => {
  const [title, setTitle] = useState('Afternoon Court Shootaround');
  const [sessionType, setSessionType] = useState<SessionType>('shooting_workout');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Shots state for this active session
  const [shots, setShots] = useState<ShotRecord[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<CourtZoneId>('corner_3_left');
  const [inputMode, setInputMode] = useState<'zone' | 'pinpoint'>('zone');
  const [pinpointShotType, setPinpointShotType] = useState<'made' | 'missed'>('made');
  const [showCelebration, setShowCelebration] = useState(false);

  // Compute live session stats
  const totalShots = shots.length;
  const makes = shots.filter((s) => s.isMade).length;
  const misses = totalShots - makes;
  const fgPct = totalShots > 0 ? Math.round((makes / totalShots) * 1000) / 10 : 0;

  const currentZone = useMemo(() => {
    return ZONE_MAP.get(selectedZoneId) || COURT_ZONES[0];
  }, [selectedZoneId]);

  const zoneShots = useMemo(() => {
    return shots.filter((s) => s.zoneId === selectedZoneId);
  }, [shots, selectedZoneId]);

  const zoneMakes = zoneShots.filter((s) => s.isMade).length;
  const zoneAttempts = zoneShots.length;
  const zonePct = zoneAttempts > 0 ? Math.round((zoneMakes / zoneAttempts) * 1000) / 10 : 0;

  // Aggregate stats per zone for this live session
  const liveZoneAggregates = useMemo(() => {
    const map: any = {};
    for (const z of COURT_ZONES) {
      const zShots = shots.filter((s) => s.zoneId === z.id);
      const zMakes = zShots.filter((s) => s.isMade).length;
      map[z.id] = {
        zoneId: z.id,
        name: z.name,
        category: z.category,
        pointValue: z.pointValue,
        makes: zMakes,
        attempts: zShots.length,
        percentage: zShots.length > 0 ? Math.round((zMakes / zShots.length) * 1000) / 10 : 0,
      };
    }
    return map;
  }, [shots]);

  if (!isOpen) return null;

  const handleAddZoneShots = (makeCount: number, missCount: number) => {
    const newShots: ShotRecord[] = [];
    const now = new Date().toISOString();
    const zone = ZONE_MAP.get(selectedZoneId);
    const coords = zone ? zone.labelCoords : { x: 250, y: 150 };
    // map SVG units to 0-100%
    const baseNormX = (coords.x / 500) * 100;
    const baseNormY = (coords.y / 470) * 100;

    for (let i = 0; i < makeCount; i++) {
      newShots.push({
        id: `shot_${Date.now()}_m_${i}_${Math.random().toString(36).substr(2, 4)}`,
        x: Math.max(2, Math.min(98, baseNormX + (Math.random() - 0.5) * 4)),
        y: Math.max(2, Math.min(96, baseNormY + (Math.random() - 0.5) * 4)),
        zoneId: selectedZoneId,
        isMade: true,
        distanceFt: zone?.pointValue === 3 ? 23.5 : 15,
        timestamp: now,
      });
    }

    for (let i = 0; i < missCount; i++) {
      newShots.push({
        id: `shot_${Date.now()}_miss_${i}_${Math.random().toString(36).substr(2, 4)}`,
        x: Math.max(2, Math.min(98, baseNormX + (Math.random() - 0.5) * 4)),
        y: Math.max(2, Math.min(96, baseNormY + (Math.random() - 0.5) * 4)),
        zoneId: selectedZoneId,
        isMade: false,
        distanceFt: zone?.pointValue === 3 ? 23.5 : 15,
        timestamp: now,
      });
    }

    setShots((prev) => [...prev, ...newShots]);
  };

  const handleCourtClick = (coords: { xPercent: number; yPercent: number }) => {
    const detectedZone = determineZoneFromCoordinates(coords.xPercent, coords.yPercent);
    const distanceFt = estimateDistanceFeet(coords.xPercent, coords.yPercent);

    if (inputMode === 'pinpoint') {
      const isMade = pinpointShotType === 'made';
      const newShot: ShotRecord = {
        id: `shot_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        x: coords.xPercent,
        y: coords.yPercent,
        zoneId: detectedZone,
        isMade,
        distanceFt,
        timestamp: new Date().toISOString(),
      };
      setShots((prev) => [...prev, newShot]);
      setSelectedZoneId(detectedZone);
    } else {
      setSelectedZoneId(detectedZone);
    }
  };

  const handleUndo = () => {
    setShots((prev) => prev.slice(0, prev.length - 1));
  };

  const handleClear = () => {
    if (shots.length === 0) return;
    if (confirm('Clear all logged shots in this session?')) {
      setShots([]);
    }
  };

  const handleSave = () => {
    if (shots.length === 0) {
      alert('Please log at least one shot before saving the workout.');
      return;
    }

    const session: WorkoutSession = {
      id: `sess_${Date.now()}`,
      title: title.trim() || 'Court Workout',
      date,
      sessionType,
      durationMinutes: Number(durationMinutes) || 30,
      shots,
      notes: notes.trim(),
    };

    setShowCelebration(true);
    setTimeout(() => {
      onSaveSession(session);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0d1424] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#090d16]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF5722]/15 border border-[#FF5722]/40 flex items-center justify-center text-[#FF5722]">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Log Basketball Session
              </h2>
              <p className="text-xs text-slate-400">
                Interactive Court Shot Chart &amp; Field Goal Tracker
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Top Session Config Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-[#131b2e] p-3.5 rounded-xl border border-slate-800/80">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Session Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-[#090d16] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#FF5722]"
                placeholder="e.g. 3PT Spot-Up Challenge"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Session Type
              </label>
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value as SessionType)}
                className="w-full px-3 py-1.5 text-xs bg-[#090d16] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#FF5722]"
              >
                <option value="shooting_workout">Shooting Workout</option>
                <option value="game">5v5 Live Game</option>
                <option value="scrimmage">Pickup / Scrimmage</option>
                <option value="skills_drill">Skills &amp; Drills</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-[#090d16] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#FF5722]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Duration (Mins)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-[#090d16] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#FF5722]"
                />
                <Clock className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Interactive Court + Input Controls Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Court Visualization */}
            <div className="lg:col-span-7 flex flex-col items-center">
              {/* Input Mode Selector Bar */}
              <div className="w-full flex items-center justify-between mb-3 bg-[#131b2e] p-1.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setInputMode('zone')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      inputMode === 'zone'
                        ? 'bg-[#FF5722] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Zone Stepper
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode('pinpoint')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      inputMode === 'pinpoint'
                        ? 'bg-[#FF5722] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Tap-to-Drop Shot
                  </button>
                </div>

                {inputMode === 'pinpoint' ? (
                  <div className="flex items-center gap-1 bg-[#090d16] p-1 rounded-lg border border-slate-700">
                    <button
                      type="button"
                      onClick={() => setPinpointShotType('made')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-md flex items-center gap-1 ${
                        pinpointShotType === 'made'
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-400 hover:text-emerald-400'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-white" />
                      Made
                    </button>
                    <button
                      type="button"
                      onClick={() => setPinpointShotType('missed')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-md flex items-center gap-1 ${
                        pinpointShotType === 'missed'
                          ? 'bg-rose-600 text-white'
                          : 'text-slate-400 hover:text-rose-400'
                      }`}
                    >
                      <span className="font-bold">✕</span>
                      Missed
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400 px-2">
                    Click court zone to select
                  </span>
                )}
              </div>

              {/* The Vector Court Component */}
              <HalfCourtSvg
                zoneStats={liveZoneAggregates}
                selectedZoneId={selectedZoneId}
                onSelectZone={(zoneId) => setSelectedZoneId(zoneId)}
                shots={shots}
                onCourtClick={handleCourtClick}
                isPinpointMode={inputMode === 'pinpoint'}
                className="w-full"
              />
            </div>

            {/* Right Column: Logging Controls & Live Session Stats */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Live Session Scoreboard */}
              <div className="bg-[#131b2e] rounded-xl p-4 border border-slate-800 shadow-md">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-semibold text-slate-300">
                    Session Field Goal Stats
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleUndo}
                      disabled={shots.length === 0}
                      className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none rounded-md flex items-center gap-1 transition-colors"
                      title="Undo last shot"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Undo
                    </button>
                    <button
                      type="button"
                      onClick={handleClear}
                      disabled={shots.length === 0}
                      className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 disabled:opacity-30 disabled:pointer-events-none rounded-md transition-colors"
                      title="Clear session shots"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center pt-3">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider">
                      Makes (FG)
                    </span>
                    <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                      {makes}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider">
                      Misses
                    </span>
                    <span className="text-2xl font-bold font-mono text-rose-400 tabular-nums">
                      {misses}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider">
                      Total Shots
                    </span>
                    <span className="text-2xl font-bold font-mono text-white tabular-nums">
                      {totalShots}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider">
                      FG %
                    </span>
                    <span className="text-2xl font-bold font-mono text-[#00E5FF] tabular-nums">
                      {totalShots > 0 ? `${fgPct}%` : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Zone Controller */}
              <div className="bg-[#131b2e] rounded-xl p-4 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                      Selected Zone
                    </span>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      {currentZone.name}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {currentZone.typicalDistance}
                  </span>
                </div>

                <div className="p-3 bg-[#090d16] rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Current Zone Accuracy:</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-emerald-400 font-bold">{zoneMakes}</span>
                    <span className="text-slate-500">/</span>
                    <span className="text-slate-300">{zoneAttempts}</span>
                    <span className="text-white font-bold ml-1">({zonePct}%)</span>
                  </div>
                </div>

                {/* Quick Add Buttons for this zone */}
                <div className="space-y-2 pt-1">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddZoneShots(1, 0)}
                      className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/30 active:scale-[0.98] transition-all"
                    >
                      <span className="text-lg">+1</span> Make (FG)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddZoneShots(0, 1)}
                      className="py-3 px-4 bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-950/30 active:scale-[0.98] transition-all"
                    >
                      <span className="text-lg">+1</span> Miss
                    </button>
                  </div>

                  {/* Batch Buttons */}
                  <div className="grid grid-cols-4 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleAddZoneShots(5, 0)}
                      className="py-1.5 text-xs font-mono font-medium text-emerald-400 bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-800/40 rounded-lg transition-colors"
                    >
                      +5 Makes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddZoneShots(0, 5)}
                      className="py-1.5 text-xs font-mono font-medium text-rose-400 bg-rose-950/30 hover:bg-rose-900/40 border border-rose-800/40 rounded-lg transition-colors"
                    >
                      +5 Misses
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddZoneShots(10, 0)}
                      className="py-1.5 text-xs font-mono font-medium text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/50 rounded-lg transition-colors"
                    >
                      +10 Makes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddZoneShots(7, 3)}
                      className="py-1.5 text-xs font-mono font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                      title="Log 7 makes and 3 misses"
                    >
                      +7/10
                    </button>
                  </div>
                </div>

                {/* Quick Zone Picker Dropdown */}
                <div className="pt-2">
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Or switch court zone:
                  </label>
                  <select
                    value={selectedZoneId}
                    onChange={(e) => setSelectedZoneId(e.target.value as CourtZoneId)}
                    className="w-full px-3 py-1.5 text-xs bg-[#090d16] border border-slate-700 rounded-lg text-white focus:outline-none"
                  >
                    {COURT_ZONES.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name} ({z.typicalDistance})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Workout Notes */}
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Workout Notes &amp; Observations
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-[#131b2e] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#FF5722] placeholder-slate-500"
                  placeholder="e.g. Arc was high, great lift from right corner, work on left hand pull-up..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-[#090d16]">
          <div className="text-xs text-slate-400">
            <span>
              Total Logged: <strong className="text-white font-mono">{shots.length}</strong> shots
            </span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>
              Current FG: <strong className="text-[#00E5FF] font-mono">{fgPct}%</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 bg-[#FF5722] hover:bg-[#F4511E] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#FF5722]/20 active:scale-[0.98] transition-all flex items-center gap-2"
            >
              {showCelebration ? (
                <>
                  <CheckCircle2 className="w-4 h-4 animate-bounce" />
                  Saving Session...
                </>
              ) : (
                'Save & Complete Workout'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
