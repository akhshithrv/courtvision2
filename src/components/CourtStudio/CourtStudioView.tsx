import {
  Check,
  ChevronDown,
  Eye,
  Filter,
  Flame,
  Layers,
  MapPin,
  Maximize2,
  Plus,
  RotateCcw,
  Sparkles,
  Target
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useBasketball } from '../../context/BasketballContext';
import { COURT_ZONES, ZONE_MAP } from '../../data/courtZones';
import { CourtZoneId, ShotRecord } from '../../types/basketball';
import { HalfCourtSvg } from '../Court/HalfCourtSvg';

interface CourtStudioViewProps {
  onOpenNewWorkout: () => void;
}

export const CourtStudioView: React.FC<CourtStudioViewProps> = ({ onOpenNewWorkout }) => {
  const { sessions, zoneAggregates } = useBasketball();
  const [selectedZoneId, setSelectedZoneId] = useState<CourtZoneId | null>(null);
  const [viewFilter, setViewFilter] = useState<'all' | 'makes' | 'misses'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'three' | 'mid' | 'paint'>('all');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showIndividualShots, setShowIndividualShots] = useState(true);

  // Aggregate all shots
  const allShots: ShotRecord[] = useMemo(() => {
    return sessions.flatMap((s) => s.shots);
  }, [sessions]);

  // Filter shots
  const filteredShots = useMemo(() => {
    return allShots.filter((shot) => {
      // Zone match if selected
      if (selectedZoneId && shot.zoneId !== selectedZoneId) return false;

      // Make / Miss filter
      if (viewFilter === 'makes' && !shot.isMade) return false;
      if (viewFilter === 'misses' && shot.isMade) return false;

      // Category filter
      if (categoryFilter !== 'all') {
        const zone = ZONE_MAP.get(shot.zoneId);
        if (categoryFilter === 'three' && zone?.category !== 'three_point') return false;
        if (categoryFilter === 'mid' && zone?.category !== 'mid_range') return false;
        if (categoryFilter === 'paint' && zone?.category !== 'paint') return false;
      }

      return true;
    });
  }, [allShots, selectedZoneId, viewFilter, categoryFilter]);

  const activeZone = selectedZoneId ? ZONE_MAP.get(selectedZoneId) : null;
  const activeZoneStats = selectedZoneId ? zoneAggregates[selectedZoneId] : null;

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-[#FF5722]" />
            Interactive Court Studio &amp; Shot Dispersion
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Visualize your personal shooting chart across all 14 half-court zones with make/miss markers
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewWorkout}
          className="self-start md:self-auto px-4 py-2.5 bg-[#FF5722] hover:bg-[#F4511E] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#FF5722]/20 active:scale-[0.98] transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Record Workout Shots
        </button>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: The Large Interactive Court */}
        <div className="lg:col-span-8 bg-[#131b2e] border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col items-center">
          {/* Quick Display Controls */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Layers:</span>
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors flex items-center gap-1.5 ${
                  showHeatmap
                    ? 'bg-slate-800 border-slate-600 text-white'
                    : 'border-slate-800 text-slate-500'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-[#FF5722]" />
                Zone Heatmap
              </button>
              <button
                onClick={() => setShowIndividualShots(!showIndividualShots)}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors flex items-center gap-1.5 ${
                  showIndividualShots
                    ? 'bg-slate-800 border-slate-600 text-white'
                    : 'border-slate-800 text-slate-500'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-[#00E5FF]" />
                Shot Pins ({filteredShots.length})
              </button>
            </div>

            {/* Filter by Make / Miss */}
            <div className="flex items-center gap-1 p-1 bg-[#090d16] rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setViewFilter('all')}
                className={`px-2.5 py-1 rounded-md font-semibold ${
                  viewFilter === 'all' ? 'bg-[#FF5722] text-white' : 'text-slate-400'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setViewFilter('makes')}
                className={`px-2.5 py-1 rounded-md font-semibold ${
                  viewFilter === 'makes' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                Makes Only
              </button>
              <button
                onClick={() => setViewFilter('misses')}
                className={`px-2.5 py-1 rounded-md font-semibold ${
                  viewFilter === 'misses' ? 'bg-rose-600 text-white' : 'text-slate-400'
                }`}
              >
                Misses Only
              </button>
            </div>
          </div>

          {/* The Court */}
          <HalfCourtSvg
            zoneStats={zoneAggregates}
            selectedZoneId={selectedZoneId}
            onSelectZone={(zoneId) =>
              setSelectedZoneId((prev) => (prev === zoneId ? null : zoneId))
            }
            shots={filteredShots}
            showHeatmap={showHeatmap}
            showShots={showIndividualShots}
            interactive={true}
            className="w-full"
          />
        </div>

        {/* Right Column: Zone Inspector & Quick Breakdown */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Zone Detail Card */}
          <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF5722]">
                Court Zone Inspector
              </span>
              {selectedZoneId && (
                <button
                  onClick={() => setSelectedZoneId(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Reset
                </button>
              )}
            </div>

            {activeZone && activeZoneStats ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {activeZone.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <span>Distance: {activeZone.typicalDistance}</span>
                    <span aria-hidden="true">·</span>
                    <span>Value: {activeZone.pointValue} Points</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-[#090d16] p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] uppercase text-slate-500 block mb-1">
                      Accuracy
                    </span>
                    <span className="text-2xl font-mono font-bold text-emerald-400">
                      {activeZoneStats.percentage}%
                    </span>
                  </div>
                  <div className="bg-[#090d16] p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] uppercase text-slate-500 block mb-1">
                      Made / Taken
                    </span>
                    <span className="text-2xl font-mono font-bold text-white">
                      {activeZoneStats.makes} <span className="text-sm text-slate-500">/ {activeZoneStats.attempts}</span>
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700 text-xs text-slate-300">
                  <p>
                    {activeZoneStats.percentage >= 45
                      ? '🔥 Highly efficient scoring area for you. Maintain shot frequency from this spot.'
                      : activeZoneStats.attempts === 0
                      ? 'ℹ️ No attempts recorded yet from this zone.'
                      : '🎯 Below average percentage. Consider focusing on spot-up shooting reps in practice.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                <MapPin className="w-6 h-6 mx-auto text-slate-600" />
                <p>Click any zone on the court diagram to view specific field goal stats and shot distances.</p>
              </div>
            )}
          </div>

          {/* Court Zones Directory */}
          <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Quick Zone Selector
            </h4>
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              {COURT_ZONES.map((z) => {
                const stat = zoneAggregates[z.id];
                const isSelected = selectedZoneId === z.id;

                return (
                  <button
                    key={z.id}
                    onClick={() => setSelectedZoneId(isSelected ? null : z.id)}
                    className={`w-full px-3 py-2 rounded-xl text-left text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-[#FF5722] text-white font-bold'
                        : 'bg-[#090d16] hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <span>{z.name}</span>
                    <span className="font-mono tabular-nums">
                      {stat ? `${stat.percentage}% (${stat.makes}/${stat.attempts})` : '—'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
