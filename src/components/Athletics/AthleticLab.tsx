import {
  Award,
  Calendar,
  ChevronUp,
  Info,
  Plus,
  Trash2,
  TrendingUp,
  X,
  Zap
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useBasketball } from '../../context/BasketballContext';
import { AthleticMetricRecord } from '../../types/basketball';

export const AthleticLab: React.FC = () => {
  const { athleticRecords, addAthleticRecord, deleteAthleticRecord, bestVerticalJump, bestSprintTime } =
    useBasketball();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [standingVert, setStandingVert] = useState(30.0);
  const [maxVert, setMaxVert] = useState(33.0);
  const [sprintTime, setSprintTime] = useState(3.35);
  const [laneAgility, setLaneAgility] = useState(11.2);
  const [testDate, setTestDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');

  // Sorted records by date
  const sortedRecords = useMemo(() => {
    return [...athleticRecords].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [athleticRecords]);

  // Baseline to PR calculation
  const vertImprovement = useMemo(() => {
    if (sortedRecords.length < 2) return 0;
    const first = sortedRecords[0].maxApproachVerticalInches;
    const latest = sortedRecords[sortedRecords.length - 1].maxApproachVerticalInches;
    return Math.round((latest - first) * 10) / 10;
  }, [sortedRecords]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: AthleticMetricRecord = {
      id: `ath_${Date.now()}`,
      date: testDate,
      standingVerticalInches: Number(standingVert),
      maxApproachVerticalInches: Number(maxVert),
      sprintThreeQuarterSeconds: Number(sprintTime),
      laneAgilitySeconds: laneAgility ? Number(laneAgility) : undefined,
      notes: notes.trim() || undefined,
    };
    addAthleticRecord(newRecord);
    setIsModalOpen(false);
    setNotes('');
  };

  // SVG Chart Dimensions
  const chartWidth = 600;
  const chartHeight = 220;
  const padding = { top: 20, right: 30, bottom: 35, left: 45 };

  // Generate SVG Points for Vertical Jump
  const chartData = useMemo(() => {
    if (sortedRecords.length === 0) return { path: '', points: [] };

    const minVert = 24;
    const maxVertVal = 38;
    const plotWidth = chartWidth - padding.left - padding.right;
    const plotHeight = chartHeight - padding.top - padding.bottom;

    const points = sortedRecords.map((r, i) => {
      const x =
        sortedRecords.length === 1
          ? padding.left + plotWidth / 2
          : padding.left + (i / (sortedRecords.length - 1)) * plotWidth;
      const normalizedY =
        (r.maxApproachVerticalInches - minVert) / (maxVertVal - minVert);
      const y = padding.top + (1 - normalizedY) * plotHeight;
      return { x, y, record: r };
    });

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }

    return { path, points };
  }, [sortedRecords]);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Athletic Benchmarks &amp; Combine Lab
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Track measurable vertical jump gains, 75-foot sprint speed, and combine agility benchmarks
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="self-start md:self-auto px-4 py-2.5 bg-[#FF5722] hover:bg-[#F4511E] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#FF5722]/20 active:scale-[0.98] transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Log Athletic Combine Test
        </button>
      </div>

      {/* KPI Highlight Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Max Approach Vertical */}
        <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Max Running Vertical</span>
            <Zap className="w-4 h-4 text-[#FF5722]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
              {bestVerticalJump > 0 ? `${bestVerticalJump}"` : '—'}
            </span>
            {vertImprovement > 0 && (
              <span className="text-xs font-bold text-emerald-400 flex items-center">
                <ChevronUp className="w-3.5 h-3.5" /> +{vertImprovement}" gain
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Personal best touch height
          </p>
        </div>

        {/* Standing Vertical */}
        <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Standing No-Step Vert</span>
            <TrendingUp className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
              {sortedRecords.length > 0
                ? `${sortedRecords[sortedRecords.length - 1].standingVerticalInches}"`
                : '—'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Explosive two-foot takeoff
          </p>
        </div>

        {/* 3/4 Court Sprint */}
        <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>3/4 Court Sprint (75ft)</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
              {bestSprintTime < 90 ? `${bestSprintTime}s` : '—'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            NBA Combine standard test
          </p>
        </div>

        {/* Combine Agility */}
        <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Lane Agility Shuttle</span>
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
              {sortedRecords.length > 0 && sortedRecords[sortedRecords.length - 1].laneAgilitySeconds
                ? `${sortedRecords[sortedRecords.length - 1].laneAgilitySeconds}s`
                : '—'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Paint perimeter lateral speed
          </p>
        </div>
      </div>

      {/* Vertical Jump Progression Chart */}
      <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#FF5722]" />
              Vertical Jump Progression (Inches)
            </h2>
            <p className="text-xs text-slate-400">
              Track height gains across testing dates against standard athletic milestones
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5722]" />
              Max Approach Vert
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-4 h-0.5 bg-slate-600 border-t border-dashed" />
              Dunk Threshold (32")
            </span>
          </div>
        </div>

        {/* SVG Curve Chart */}
        <div className="w-full overflow-x-auto py-2">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full min-w-[500px] h-[220px]"
          >
            {/* Grid Lines */}
            {[26, 28, 30, 32, 34, 36].map((tick) => {
              const normalizedY = (tick - 24) / (38 - 24);
              const y =
                padding.top +
                (1 - normalizedY) * (chartHeight - padding.top - padding.bottom);
              const isThreshold = tick === 32;

              return (
                <g key={tick}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={chartWidth - padding.right}
                    y2={y}
                    stroke={isThreshold ? '#F59E0B' : '#1e293b'}
                    strokeWidth={isThreshold ? '1.5' : '1'}
                    strokeDasharray={isThreshold ? '4 4' : undefined}
                    opacity={isThreshold ? 0.6 : 0.8}
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 3}
                    textAnchor="end"
                    fill={isThreshold ? '#F59E0B' : '#64748B'}
                    fontSize="10"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {tick}"
                  </text>
                  {isThreshold && (
                    <text
                      x={chartWidth - padding.right - 4}
                      y={y - 4}
                      textAnchor="end"
                      fill="#F59E0B"
                      fontSize="9"
                      fontWeight="600"
                    >
                      Dunk Level (32")
                    </text>
                  )}
                </g>
              );
            })}

            {/* Gradient fill under curve */}
            <defs>
              <linearGradient id="vertGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF5722" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#FF5722" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area Fill */}
            {chartData.points.length > 1 && (
              <path
                d={`${chartData.path} L ${
                  chartData.points[chartData.points.length - 1].x
                } ${chartHeight - padding.bottom} L ${chartData.points[0].x} ${
                  chartHeight - padding.bottom
                } Z`}
                fill="url(#vertGrad)"
              />
            )}

            {/* Path Line */}
            <path
              d={chartData.path}
              fill="none"
              stroke="#FF5722"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Points & Data Labels */}
            {chartData.points.map((pt, idx) => (
              <g key={idx}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  fill="#FF5722"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {pt.record.maxApproachVerticalInches}"
                </text>
                <text
                  x={pt.x}
                  y={chartHeight - 12}
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize="9.5"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                >
                  {pt.record.date.slice(5)}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Historical Benchmarks Table */}
      <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <h2 className="text-base font-bold text-white">
            Historical Combine Test Logs
          </h2>
          <span className="text-xs text-slate-400">
            {sortedRecords.length} records logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-[#090d16] border-y border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Standing Vert</th>
                <th className="py-2.5 px-3">Max Approach Vert</th>
                <th className="py-2.5 px-3">3/4 Court Sprint</th>
                <th className="py-2.5 px-3">Lane Agility</th>
                <th className="py-2.5 px-3">Notes</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {sortedRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 px-3 font-sans font-medium text-white">
                    {r.date}
                  </td>
                  <td className="py-3 px-3 tabular-nums text-slate-200">
                    {r.standingVerticalInches}"
                  </td>
                  <td className="py-3 px-3 tabular-nums font-bold text-[#FF5722]">
                    {r.maxApproachVerticalInches}"
                  </td>
                  <td className="py-3 px-3 tabular-nums text-emerald-400">
                    {r.sprintThreeQuarterSeconds}s
                  </td>
                  <td className="py-3 px-3 tabular-nums text-slate-300">
                    {r.laneAgilitySeconds ? `${r.laneAgilitySeconds}s` : '—'}
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-400 max-w-[200px] truncate">
                    {r.notes || '—'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => deleteAthleticRecord(r.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-rose-950/20 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Athletic Combine Test Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#0d1424] border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FF5722]" />
                Record Athletic Combine Test
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Test Date
                </label>
                <input
                  type="date"
                  required
                  value={testDate}
                  onChange={(e) => setTestDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#131b2e] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Max Running Vert (in)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="10"
                    max="55"
                    required
                    value={maxVert}
                    onChange={(e) => setMaxVert(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs font-mono bg-[#131b2e] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#FF5722]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Standing Vert (in)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="10"
                    max="50"
                    required
                    value={standingVert}
                    onChange={(e) => setStandingVert(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs font-mono bg-[#131b2e] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#FF5722]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    3/4 Court Sprint (sec)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="2.5"
                    max="6.0"
                    required
                    value={sprintTime}
                    onChange={(e) => setSprintTime(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs font-mono bg-[#131b2e] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#FF5722]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Lane Agility (sec)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="8.0"
                    max="20.0"
                    value={laneAgility}
                    onChange={(e) => setLaneAgility(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs font-mono bg-[#131b2e] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#FF5722]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Combine Notes / Conditioning Context
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Done after leg workout, felt high bounce..."
                  className="w-full px-3 py-1.5 text-xs bg-[#131b2e] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FF5722] hover:bg-[#F4511E] text-white text-xs font-bold rounded-xl shadow-lg transition-all"
                >
                  Save Benchmark
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
