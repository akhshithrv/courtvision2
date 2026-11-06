import React, { useState } from 'react';
import { COURT_ZONES } from '../../data/courtZones';
import { CourtZoneId, ShotRecord, ZoneStatAggregate } from '../../types/basketball';

interface HalfCourtSvgProps {
  zoneStats?: Record<CourtZoneId, ZoneStatAggregate>;
  selectedZoneId?: CourtZoneId | null;
  onSelectZone?: (zoneId: CourtZoneId) => void;
  shots?: ShotRecord[];
  onCourtClick?: (coords: { xPercent: number; yPercent: number }) => void;
  showHeatmap?: boolean;
  showShots?: boolean;
  interactive?: boolean;
  className?: string;
  isPinpointMode?: boolean;
}

export const HalfCourtSvg: React.FC<HalfCourtSvgProps> = ({
  zoneStats,
  selectedZoneId,
  onSelectZone,
  shots = [],
  onCourtClick,
  showHeatmap = true,
  showShots = true,
  interactive = true,
  className = '',
  isPinpointMode = false,
}) => {
  const [hoveredZone, setHoveredZone] = useState<CourtZoneId | null>(null);

  // Helper to get heat color based on FG%
  const getZoneFillColor = (zoneId: CourtZoneId): string => {
    if (selectedZoneId === zoneId) {
      return 'rgba(255, 87, 34, 0.45)'; // Vibrant infrared accent when selected
    }

    if (!showHeatmap || !zoneStats || !zoneStats[zoneId]) {
      return 'rgba(19, 27, 43, 0.6)';
    }

    const stat = zoneStats[zoneId];
    if (stat.attempts === 0) {
      return 'rgba(19, 27, 43, 0.5)';
    }

    const pct = stat.percentage;
    const is3Pt = stat.pointValue === 3;
    // Contextual thresholds: 3PT > 38% is elite, 2PT > 50% is elite
    const eliteThreshold = is3Pt ? 38 : 50;
    const goodThreshold = is3Pt ? 33 : 42;

    if (pct >= eliteThreshold) {
      return 'rgba(16, 185, 129, 0.40)'; // Hot Emerald
    } else if (pct >= goodThreshold) {
      return 'rgba(245, 158, 11, 0.35)'; // Warm Amber
    } else {
      return 'rgba(59, 130, 246, 0.35)'; // Cool Ice Blue
    }
  };

  const getZoneStrokeColor = (zoneId: CourtZoneId): string => {
    if (selectedZoneId === zoneId) return '#FF5722';
    if (hoveredZone === zoneId) return '#38BDF8';
    return '#334155';
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onCourtClick) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const xPercent = Math.max(0, Math.min(100, Math.round((clickX / rect.width) * 1000) / 10));
    const yPercent = Math.max(0, Math.min(100, Math.round((clickY / rect.height) * 1000) / 10));

    onCourtClick({ xPercent, yPercent });
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Court Container */}
      <div className="relative w-full max-w-[540px] aspect-[500/470] bg-[#0c121e] rounded-2xl p-2.5 sm:p-4 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Subtle Hardwood Court Grid Background Pattern */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255, 255, 255, 0.05) 20px)`,
          }}
        />

        <svg
          viewBox="0 0 500 470"
          className={`w-full h-full ${interactive ? 'cursor-crosshair' : ''}`}
          onClick={handleSvgClick}
        >
          <defs>
            {/* Basket Rim Glow */}
            <radialGradient id="rimGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF5722" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FF5722" stopOpacity="0" />
            </radialGradient>
            <filter id="shotShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Court Perimeter Background Fill */}
          <rect x="0" y="0" width="500" height="470" fill="#0f172a" rx="10" />

          {/* Interactive Zone Polygons */}
          <g id="court-zones" className="transition-opacity">
            {COURT_ZONES.map((zone) => {
              const isSelected = selectedZoneId === zone.id;
              const isHovered = hoveredZone === zone.id;
              const fill = getZoneFillColor(zone.id);
              const stroke = getZoneStrokeColor(zone.id);
              const strokeWidth = isSelected ? 2.5 : isHovered ? 2 : 1;

              return (
                <path
                  key={zone.id}
                  d={zone.svgPath}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeLinejoin="round"
                  className={`transition-colors duration-150 ${
                    interactive && !isPinpointMode
                      ? 'cursor-pointer hover:brightness-125'
                      : 'pointer-events-none'
                  }`}
                  onMouseEnter={() => setHoveredZone(zone.id)}
                  onMouseLeave={() => setHoveredZone(null)}
                  onClick={(e) => {
                    if (interactive && !isPinpointMode && onSelectZone) {
                      e.stopPropagation();
                      onSelectZone(zone.id);
                    }
                  }}
                />
              );
            })}
          </g>

          {/* Regulation Court Markings (Official Dimensions) */}
          <g id="court-lines" stroke="#475569" strokeWidth="2" fill="none" pointerEvents="none">
            {/* Outer Baseline & Sidelines */}
            <rect x="1" y="1" width="498" height="468" stroke="#334155" strokeWidth="2.5" />

            {/* Center Half-Court Line */}
            <line x1="0" y1="469" x2="500" y2="469" stroke="#64748B" strokeWidth="3" />

            {/* Center Court Outer Circle (6ft radius) */}
            <circle cx="250" cy="470" r="60" stroke="#475569" strokeWidth="2" />

            {/* The Key (16ft wide x 19ft deep from baseline: x=170 to 330, y=0 to 190) */}
            <rect x="170" y="0" width="160" height="190" stroke="#64748B" strokeWidth="2" />

            {/* Free Throw Circle Top (Solid) and Bottom (Dashed) */}
            <path d="M 170,190 A 60,60 0 0,0 330,190" stroke="#64748B" strokeWidth="2" />
            <path
              d="M 170,190 A 60,60 0 0,1 330,190"
              stroke="#64748B"
              strokeWidth="2"
              strokeDasharray="6 6"
            />

            {/* Free Throw Line */}
            <line x1="170" y1="190" x2="330" y2="190" stroke="#94A3B8" strokeWidth="2.5" />

            {/* Lane Hash Marks */}
            <line x1="162" y1="70" x2="170" y2="70" stroke="#475569" strokeWidth="2" />
            <line x1="162" y1="110" x2="170" y2="110" stroke="#475569" strokeWidth="2" />
            <line x1="162" y1="140" x2="170" y2="140" stroke="#475569" strokeWidth="2" />
            <line x1="330" y1="70" x2="338" y2="70" stroke="#475569" strokeWidth="2" />
            <line x1="330" y1="110" x2="338" y2="110" stroke="#475569" strokeWidth="2" />
            <line x1="330" y1="140" x2="338" y2="140" stroke="#475569" strokeWidth="2" />

            {/* Restricted Area Arc (4ft radius from basket center: (250, 52.5)) */}
            <path
              d="M 210,40 L 210,52.5 A 40,40 0 0,0 290,52.5 L 290,40"
              stroke="#94A3B8"
              strokeWidth="2"
            />

            {/* 3-Point Line: Corner straight lines (3ft from sideline, 14ft from baseline) */}
            <line x1="30" y1="0" x2="30" y2="140" stroke="#94A3B8" strokeWidth="2.5" />
            <line x1="470" y1="0" x2="470" y2="140" stroke="#94A3B8" strokeWidth="2.5" />

            {/* 3-Point Arc (radius 237.5 from rim: center at 250, 52.5) */}
            <path
              d="M 30,140 A 237.5,237.5 0 0,0 470,140"
              stroke="#94A3B8"
              strokeWidth="2.5"
            />

            {/* Backboard (6ft wide = 60 units, 4ft from baseline: y=40) */}
            <line x1="220" y1="40" x2="280" y2="40" stroke="#E2E8F0" strokeWidth="4" />

            {/* Rim Support and Ring (18 inch diameter = 15 units radius at (250, 52.5)) */}
            <line x1="250" y1="40" x2="250" y2="45" stroke="#FF5722" strokeWidth="3" />
            <circle cx="250" cy="52.5" r="9" stroke="#FF5722" strokeWidth="3" fill="#0f172a" />
            {/* Net indication */}
            <circle cx="250" cy="52.5" r="7" stroke="#ffffff" strokeWidth="1" strokeDasharray="2 2" fill="none" opacity="0.4" />
          </g>

          {/* Zone Badges & Percentage Overlays */}
          {showHeatmap &&
            COURT_ZONES.map((zone) => {
              const stat = zoneStats ? zoneStats[zone.id] : null;
              const hasAttempts = stat && stat.attempts > 0;
              const isSelected = selectedZoneId === zone.id;

              return (
                <g
                  key={`label-${zone.id}`}
                  className="pointer-events-none"
                  transform={`translate(${zone.labelCoords.x}, ${zone.labelCoords.y})`}
                >
                  <rect
                    x="-32"
                    y="-12"
                    width="64"
                    height="24"
                    rx="6"
                    fill={isSelected ? '#FF5722' : '#0B0F17'}
                    fillOpacity={isSelected ? 0.95 : 0.85}
                    stroke={isSelected ? '#FFFFFF' : '#334155'}
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="-1"
                    textAnchor="middle"
                    fill={isSelected ? '#FFFFFF' : '#94A3B8'}
                    fontSize="8.5"
                    fontWeight="600"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    {zone.shortName}
                  </text>
                  <text
                    x="0"
                    y="8"
                    textAnchor="middle"
                    fill={
                      isSelected
                        ? '#FFFFFF'
                        : hasAttempts && stat.percentage >= 45
                        ? '#34D399'
                        : '#CBD5E1'
                    }
                    fontSize="8"
                    fontWeight="700"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {hasAttempts ? `${stat.percentage}%` : '—'}
                  </text>
                </g>
              );
            })}

          {/* Individual Plotted Shots */}
          {showShots &&
            shots.map((shot) => {
              // shot coordinates are 0-100%, map to 500x470
              const cx = (shot.x / 100) * 500;
              const cy = (shot.y / 100) * 470;

              return (
                <g key={shot.id} filter="url(#shotShadow)">
                  {shot.isMade ? (
                    // Made shot: Glowing Emerald Circle
                    <g>
                      <circle cx={cx} cy={cy} r="6.5" fill="#10B981" fillOpacity="0.3" />
                      <circle cx={cx} cy={cy} r="4.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.2" />
                    </g>
                  ) : (
                    // Missed shot: Red X mark
                    <g stroke="#F43F5E" strokeWidth="2" strokeLinecap="round">
                      <line x1={cx - 4} y1={cy - 4} x2={cx + 4} y2={cy + 4} />
                      <line x1={cx + 4} y1={cy - 4} x2={cx - 4} y2={cy + 4} />
                    </g>
                  )}
                </g>
              );
            })}
        </svg>

        {/* Hover / Active Zone Tooltip Float */}
        {hoveredZone && zoneStats && zoneStats[hoveredZone] && (
          <div className="absolute bottom-3 left-3 bg-[#0F172A]/95 backdrop-blur-md border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 pointer-events-none shadow-lg">
            <span className="font-semibold text-white">
              {zoneStats[hoveredZone].name}
            </span>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
              <span>
                Makes: <strong className="text-emerald-400 font-mono">{zoneStats[hoveredZone].makes}</strong>/{zoneStats[hoveredZone].attempts}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono font-bold text-white">
                {zoneStats[hoveredZone].percentage}% FG
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Heatmap Legend */}
      {showHeatmap && (
        <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500/50 border border-emerald-500" />
            <span>Hot Zone (&gt;45%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500/50 border border-amber-500" />
            <span>Average (35–45%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-500/50 border border-blue-500" />
            <span>Cold Zone (&lt;35%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white" />
            <span>Made (FG)</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-400 font-bold">
            <span>✕</span>
            <span className="text-slate-400">Miss</span>
          </div>
        </div>
      )}
    </div>
  );
};
