import {
  ArrowDownToLine,
  BarChart3,
  Calendar,
  Check,
  Download,
  Filter,
  Flame,
  PieChart,
  RefreshCw,
  TrendingUp,
  Upload
} from 'lucide-react';
import React, { useMemo, useRef, useState } from 'react';
import { useBasketball } from '../../context/BasketballContext';
import { COURT_ZONES, ZONE_MAP } from '../../data/courtZones';
import { CourtZoneId, SessionType, ShotRecord, ZoneStatAggregate } from '../../types/basketball';

export const TrendsAnalyticsExplorer: React.FC = () => {
  const { sessions, resetToDemoData, exportData, importData } = useBasketball();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [sessionFilter, setSessionFilter] = useState<'all' | SessionType>('all');
  const [sortField, setSortField] = useState<'attempts' | 'percentage' | 'makes'>('attempts');
  const [sortAsc, setSortAsc] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter sessions by time range and session type
  const filteredSessions = useMemo(() => {
    const now = new Date().getTime();
    const daysLimit =
      timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 9999;
    const cutoff = now - daysLimit * 24 * 60 * 60 * 1000;

    return sessions.filter((s) => {
      const sessionTime = new Date(s.date).getTime();
      const inTime = sessionTime >= cutoff;
      const inType = sessionFilter === 'all' || s.sessionType === sessionFilter;
      return inTime && inType;
    });
  }, [sessions, timeRange, sessionFilter]);

  // Aggregate all shots in filtered range
  const filteredShots: ShotRecord[] = useMemo(() => {
    return filteredSessions.flatMap((s) => s.shots);
  }, [filteredSessions]);

  const totalShots = filteredShots.length;
  const totalMakes = filteredShots.filter((s) => s.isMade).length;
  const overallFg = totalShots > 0 ? Math.round((totalMakes / totalShots) * 1000) / 10 : 0;

  // Group shots by shot distance buckets:
  // 1. At Rim (0-4ft)
  // 2. Short Mid (4-14ft)
  // 3. Long Mid (14ft - 3PT line)
  // 4. 3-Pointers (22ft+)
  const distanceBuckets = useMemo(() => {
    const buckets = {
      rim: { name: 'At Rim (0-4ft)', attempts: 0, makes: 0 },
      shortMid: { name: 'Short Mid-Range (4-14ft)', attempts: 0, makes: 0 },
      longMid: { name: 'Long Mid-Range (14-22ft)', attempts: 0, makes: 0 },
      threePt: { name: '3-Pointers (22ft+)', attempts: 0, makes: 0 },
    };

    for (const shot of filteredShots) {
      const zone = ZONE_MAP.get(shot.zoneId);
      if (!zone) continue;

      if (shot.zoneId === 'restricted_area') {
        buckets.rim.attempts++;
        if (shot.isMade) buckets.rim.makes++;
      } else if (zone.category === 'paint') {
        buckets.shortMid.attempts++;
        if (shot.isMade) buckets.shortMid.makes++;
      } else if (zone.category === 'three_point') {
        buckets.threePt.attempts++;
        if (shot.isMade) buckets.threePt.makes++;
      } else {
        // mid range
        if (shot.distanceFt <= 15) {
          buckets.shortMid.attempts++;
          if (shot.isMade) buckets.shortMid.makes++;
        } else {
          buckets.longMid.attempts++;
          if (shot.isMade) buckets.longMid.makes++;
        }
      }
    }

    return Object.entries(buckets).map(([key, data]) => ({
      key,
      name: data.name,
      attempts: data.attempts,
      makes: data.makes,
      percentage: data.attempts > 0 ? Math.round((data.makes / data.attempts) * 1000) / 10 : 0,
      share: totalShots > 0 ? Math.round((data.attempts / totalShots) * 1000) / 10 : 0,
    }));
  }, [filteredShots, totalShots]);

  // Zone by zone performance table
  const zoneTableData = useMemo(() => {
    const data: ZoneStatAggregate[] = COURT_ZONES.map((zone) => {
      const zShots = filteredShots.filter((s) => s.zoneId === zone.id);
      const zMakes = zShots.filter((s) => s.isMade).length;
      return {
        zoneId: zone.id,
        name: zone.name,
        category: zone.category,
        pointValue: zone.pointValue,
        makes: zMakes,
        attempts: zShots.length,
        percentage: zShots.length > 0 ? Math.round((zMakes / zShots.length) * 1000) / 10 : 0,
      };
    });

    data.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      return sortAsc ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
    });

    return data;
  }, [filteredShots, sortField, sortAsc]);

  // Chronological session trend points for SVG Line Chart
  const trendPoints = useMemo(() => {
    // Reverse chronological to chronological
    const sorted = [...filteredSessions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return sorted.map((s) => {
      const sAttempts = s.shots.length;
      const sMakes = s.shots.filter((x) => x.isMade).length;
      const sFg = sAttempts > 0 ? Math.round((sMakes / sAttempts) * 1000) / 10 : 0;

      // 3PT for this session
      const threes = s.shots.filter((x) => ZONE_MAP.get(x.zoneId)?.pointValue === 3);
      const threeMakes = threes.filter((x) => x.isMade).length;
      const threeFg = threes.length > 0 ? Math.round((threeMakes / threes.length) * 1000) / 10 : 0;

      return {
        id: s.id,
        date: s.date.slice(5),
        title: s.title,
        attempts: sAttempts,
        makes: sMakes,
        fgPct: sFg,
        threePct: threeFg,
        threeAttempts: threes.length,
      };
    });
  }, [filteredSessions]);

  // SVG dimensions for shooting trajectory chart
  const chartWidth = 700;
  const chartHeight = 240;
  const padding = { top: 25, right: 30, bottom: 40, left: 45 };

  const svgChart = useMemo(() => {
    if (trendPoints.length === 0) return { fgPath: '', threePath: '', coords: [] };

    const plotWidth = chartWidth - padding.left - padding.right;
    const plotHeight = chartHeight - padding.top - padding.bottom;

    const coords = trendPoints.map((pt, idx) => {
      const x =
        trendPoints.length === 1
          ? padding.left + plotWidth / 2
          : padding.left + (idx / (trendPoints.length - 1)) * plotWidth;

      // y scale: 20% to 80% FG
      const normFg = (pt.fgPct - 20) / (80 - 20);
      const yFg = padding.top + (1 - Math.max(0, Math.min(1, normFg))) * plotHeight;

      const norm3 = (pt.threePct - 20) / (80 - 20);
      const y3 = padding.top + (1 - Math.max(0, Math.min(1, norm3))) * plotHeight;

      return { x, yFg, y3, pt };
    });

    let fgPath = `M ${coords[0].x} ${coords[0].yFg}`;
    let threePath = `M ${coords[0].x} ${coords[0].y3}`;
    for (let i = 1; i < coords.length; i++) {
      fgPath += ` L ${coords[i].x} ${coords[i].yFg}`;
      threePath += ` L ${coords[i].x} ${coords[i].y3}`;
    }

    return { fgPath, threePath, coords };
  }, [trendPoints]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importData(content);
      if (success) {
        setImportStatus('Data successfully imported!');
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus('Invalid JSON backup file.');
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-8">
      {/* Header & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#FF5722]" />
            Performance &amp; Shooting Trends Explorer
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Deep analytics across workout volume, shooting trajectory, and zone efficiencies
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Range */}
          <div className="flex items-center gap-1 p-1 bg-[#131b2e] rounded-xl border border-slate-800">
            {(['7d', '30d', '90d', 'all'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  timeRange === r
                    ? 'bg-[#FF5722] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : r === '90d' ? '90 Days' : 'All Time'}
              </button>
            ))}
          </div>

          {/* Session Type Filter */}
          <select
            value={sessionFilter}
            onChange={(e) => setSessionFilter(e.target.value as any)}
            className="px-3 py-2 text-xs bg-[#131b2e] border border-slate-800 rounded-xl text-white focus:outline-none"
          >
            <option value="all">All Session Types</option>
            <option value="shooting_workout">Shooting Workouts</option>
            <option value="game">Live 5v5 Games</option>
            <option value="scrimmage">Scrimmages</option>
            <option value="skills_drill">Skills Drills</option>
          </select>
        </div>
      </div>

      {/* Primary KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-5 shadow-md">
          <span className="text-xs text-slate-400 block mb-1">Total Shots Logged</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-white tabular-nums">
              {totalShots}
            </span>
            <span className="text-xs font-mono text-emerald-400">
              ({totalMakes} makes)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Across {filteredSessions.length} recorded sessions</p>
        </div>

        <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-5 shadow-md">
          <span className="text-xs text-slate-400 block mb-1">True Field Goal %</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-[#00E5FF] tabular-nums">
              {totalShots > 0 ? `${overallFg}%` : '—'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Calculated from all court zones</p>
        </div>

        <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-5 shadow-md">
          <span className="text-xs text-slate-400 block mb-1">3-Point Percentage</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-[#FF5722] tabular-nums">
              {distanceBuckets.find((b) => b.key === 'threePt')?.percentage}%
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ({distanceBuckets.find((b) => b.key === 'threePt')?.attempts} shots)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">From corners and beyond the arc</p>
        </div>

        <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-5 shadow-md">
          <span className="text-xs text-slate-400 block mb-1">Rim &amp; Paint Accuracy</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-emerald-400 tabular-nums">
              {distanceBuckets.find((b) => b.key === 'rim')?.percentage}%
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ({distanceBuckets.find((b) => b.key === 'rim')?.attempts} shots)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Restricted area layup/dunk efficiency</p>
        </div>
      </div>

      {/* Shooting Trajectory Chart (FG% and 3PT% over time) */}
      <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#00E5FF]" />
              Shooting Percentage Trajectory Over Sessions
            </h2>
            <p className="text-xs text-slate-400">
              Progression curve of Overall FG% vs 3-Point % across workout sessions
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-200">
              <span className="w-3 h-1 bg-[#00E5FF] rounded" />
              Overall FG %
            </span>
            <span className="flex items-center gap-1.5 text-slate-200">
              <span className="w-3 h-1 bg-[#FF5722] rounded" />
              3PT %
            </span>
          </div>
        </div>

        {trendPoints.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">
            No session data recorded in this time range.
          </div>
        ) : (
          <div className="w-full overflow-x-auto py-2">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full min-w-[550px] h-[240px]"
            >
              {/* Horizontal grid lines: 30%, 40%, 50%, 60%, 70% */}
              {[30, 40, 50, 60, 70].map((pct) => {
                const norm = (pct - 20) / (80 - 20);
                const y =
                  padding.top + (1 - norm) * (chartHeight - padding.top - padding.bottom);

                return (
                  <g key={pct}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={chartWidth - padding.right}
                      y2={y}
                      stroke="#1e293b"
                      strokeWidth="1"
                    />
                    <text
                      x={padding.left - 8}
                      y={y + 3}
                      textAnchor="end"
                      fill="#64748B"
                      fontSize="10"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {pct}%
                    </text>
                  </g>
                );
              })}

              {/* FG Path Line */}
              <path
                d={svgChart.fgPath}
                fill="none"
                stroke="#00E5FF"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* 3PT Path Line */}
              <path
                d={svgChart.threePath}
                fill="none"
                stroke="#FF5722"
                strokeWidth="2.5"
                strokeDasharray="4 2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Points */}
              {svgChart.coords.map((c, i) => (
                <g key={i}>
                  {/* FG Point */}
                  <circle
                    cx={c.x}
                    cy={c.yFg}
                    r="4.5"
                    fill="#00E5FF"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                  <text
                    x={c.x}
                    y={c.yFg - 8}
                    textAnchor="middle"
                    fill="#00E5FF"
                    fontSize="9.5"
                    fontWeight="bold"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {c.pt.fgPct}%
                  </text>

                  {/* Date Label on Bottom */}
                  <text
                    x={c.x}
                    y={chartHeight - 12}
                    textAnchor="middle"
                    fill="#94A3B8"
                    fontSize="9.5"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    {c.pt.date}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        )}
      </div>

      {/* Shot Distance Distribution Cards */}
      <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
          <PieChart className="w-4 h-4 text-emerald-400" />
          Shot Distribution &amp; Distance Breakdown
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {distanceBuckets.map((bucket) => (
            <div
              key={bucket.key}
              className="bg-[#090d16] p-4 rounded-xl border border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{bucket.name}</span>
                <span className="font-mono text-slate-400">{bucket.share}% of shots</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF5722] to-[#00E5FF]"
                  style={{ width: `${Math.min(100, bucket.share)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">
                  Makes: <strong className="text-white font-mono">{bucket.makes}/{bucket.attempts}</strong>
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  {bucket.percentage}% FG
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone-by-Zone Performance Table */}
      <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white">
              Zone-by-Zone Efficiency Table
            </h2>
            <p className="text-xs text-slate-400">
              Detailed shooting splits sorted by volume or accuracy
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Sort by:</span>
            <button
              onClick={() => {
                if (sortField === 'attempts') setSortAsc(!sortAsc);
                else { setSortField('attempts'); setSortAsc(false); }
              }}
              className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                sortField === 'attempts'
                  ? 'bg-slate-800 border-slate-600 text-white'
                  : 'border-slate-800 text-slate-400'
              }`}
            >
              Volume {sortField === 'attempts' && (sortAsc ? '▲' : '▼')}
            </button>
            <button
              onClick={() => {
                if (sortField === 'percentage') setSortAsc(!sortAsc);
                else { setSortField('percentage'); setSortAsc(false); }
              }}
              className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                sortField === 'percentage'
                  ? 'bg-slate-800 border-slate-600 text-white'
                  : 'border-slate-800 text-slate-400'
              }`}
            >
              FG % {sortField === 'percentage' && (sortAsc ? '▲' : '▼')}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-[#090d16] border-y border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Court Zone</th>
                <th className="py-2.5 px-3">Shot Value</th>
                <th className="py-2.5 px-3">Attempts</th>
                <th className="py-2.5 px-3">Makes</th>
                <th className="py-2.5 px-3">FG %</th>
                <th className="py-2.5 px-3">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {zoneTableData.map((row) => {
                const isElite = (row.pointValue === 3 && row.percentage >= 38) || (row.pointValue === 2 && row.percentage >= 50);
                const isCold = row.attempts > 0 && row.percentage < 33;

                return (
                  <tr key={row.zoneId} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 px-3 font-sans font-medium text-white">
                      {row.name}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {row.pointValue} Points
                    </td>
                    <td className="py-3 px-3 tabular-nums text-white">
                      {row.attempts}
                    </td>
                    <td className="py-3 px-3 tabular-nums text-emerald-400">
                      {row.makes}
                    </td>
                    <td className="py-3 px-3 tabular-nums font-bold text-white">
                      {row.attempts > 0 ? `${row.percentage}%` : '—'}
                    </td>
                    <td className="py-3 px-3 font-sans">
                      {row.attempts === 0 ? (
                        <span className="text-slate-500">Unattempted</span>
                      ) : isElite ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5" /> Elite
                        </span>
                      ) : isCold ? (
                        <span className="text-blue-400 font-medium">Cold</span>
                      ) : (
                        <span className="text-amber-400 font-medium">Standard</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Backup & Maintenance Strip */}
      <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Download className="w-4 h-4 text-[#FF5722]" />
            Data Management &amp; JSON Backup
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Export all workouts to a JSON file or restore from a previous backup
          </p>
          {importStatus && (
            <p className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> {importStatus}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            Import Backup
          </button>
          <button
            type="button"
            onClick={exportData}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
            Export JSON
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset to initial demo basketball data?')) {
                resetToDemoData();
              }
            }}
            className="px-3.5 py-2 text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-950/40 rounded-xl border border-rose-900/40 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Demo Data
          </button>
        </div>
      </div>
    </div>
  );
};
