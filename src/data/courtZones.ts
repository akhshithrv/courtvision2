import { CourtZoneId, ZoneDefinition } from '../types/basketball';

/**
 * Standard half-court coordinate space:
 * Width: 500 units (representing 50ft width, 10 units = 1 ft)
 * Height: 470 units (representing 47ft length, 10 units = 1 ft)
 * Rim center: x = 250, y = 55
 * Baseline: y = 0
 * Center line: y = 470
 */

export const COURT_ZONES: ZoneDefinition[] = [
  {
    id: 'restricted_area',
    name: 'Restricted Area (At the Rim)',
    shortName: 'Rim',
    category: 'paint',
    pointValue: 2,
    typicalDistance: '0-4 ft',
    svgPath: 'M 210,40 L 210,55 A 40,40 0 0,0 290,55 L 290,40 Z',
    labelCoords: { x: 250, y: 68 },
  },
  {
    id: 'paint_non_ra',
    name: 'Paint (Floater / Non-RA)',
    shortName: 'In Paint',
    category: 'paint',
    pointValue: 2,
    typicalDistance: '4-12 ft',
    svgPath: 'M 170,0 L 330,0 L 330,190 L 170,190 Z',
    labelCoords: { x: 250, y: 135 },
  },
  {
    id: 'mid_center_ft',
    name: 'Free Throw / High Post',
    shortName: 'Free Throw',
    category: 'mid_range',
    pointValue: 2,
    typicalDistance: '14-16 ft',
    svgPath: 'M 170,190 A 60,60 0 0,0 330,190 L 330,250 L 170,250 Z',
    labelCoords: { x: 250, y: 220 },
  },
  {
    id: 'mid_left_elbow',
    name: 'Left Elbow Mid-Range',
    shortName: 'L Elbow',
    category: 'mid_range',
    pointValue: 2,
    typicalDistance: '15-18 ft',
    svgPath: 'M 80,140 L 170,140 L 170,250 L 100,240 Z',
    labelCoords: { x: 130, y: 195 },
  },
  {
    id: 'mid_right_elbow',
    name: 'Right Elbow Mid-Range',
    shortName: 'R Elbow',
    category: 'mid_range',
    pointValue: 2,
    typicalDistance: '15-18 ft',
    svgPath: 'M 330,140 L 420,140 L 400,240 L 330,250 Z',
    labelCoords: { x: 370, y: 195 },
  },
  {
    id: 'mid_left_baseline',
    name: 'Left Baseline Mid-Range',
    shortName: 'L Base Mid',
    category: 'mid_range',
    pointValue: 2,
    typicalDistance: '10-16 ft',
    svgPath: 'M 30,0 L 170,0 L 170,140 L 30,140 Z',
    labelCoords: { x: 100, y: 70 },
  },
  {
    id: 'mid_right_baseline',
    name: 'Right Baseline Mid-Range',
    shortName: 'R Base Mid',
    category: 'mid_range',
    pointValue: 2,
    typicalDistance: '10-16 ft',
    svgPath: 'M 330,0 L 470,0 L 470,140 L 330,140 Z',
    labelCoords: { x: 400, y: 70 },
  },
  {
    id: 'mid_left_wing',
    name: 'Left Wing Mid-Range',
    shortName: 'L Wing Mid',
    category: 'mid_range',
    pointValue: 2,
    typicalDistance: '16-21 ft',
    svgPath: 'M 30,140 L 80,140 L 100,240 L 170,250 L 170,285 A 237.5,237.5 0 0,1 30,140 Z',
    labelCoords: { x: 95, y: 250 },
  },
  {
    id: 'mid_right_wing',
    name: 'Right Wing Mid-Range',
    shortName: 'R Wing Mid',
    category: 'mid_range',
    pointValue: 2,
    typicalDistance: '16-21 ft',
    svgPath: 'M 470,140 A 237.5,237.5 0 0,1 330,285 L 330,250 L 400,240 L 420,140 L 470,140 Z',
    labelCoords: { x: 405, y: 250 },
  },
  {
    id: 'corner_3_left',
    name: 'Left Corner 3',
    shortName: 'L Corner 3',
    category: 'three_point',
    pointValue: 3,
    typicalDistance: '22 ft',
    svgPath: 'M 0,0 L 30,0 L 30,140 L 0,140 Z',
    labelCoords: { x: 15, y: 70 },
  },
  {
    id: 'corner_3_right',
    name: 'Right Corner 3',
    shortName: 'R Corner 3',
    category: 'three_point',
    pointValue: 3,
    typicalDistance: '22 ft',
    svgPath: 'M 470,0 L 500,0 L 500,140 L 470,140 Z',
    labelCoords: { x: 485, y: 70 },
  },
  {
    id: 'wing_3_left',
    name: 'Left Wing 3-Pointer',
    shortName: 'L Wing 3',
    category: 'three_point',
    pointValue: 3,
    typicalDistance: '23.75+ ft',
    svgPath: 'M 0,140 L 30,140 A 237.5,237.5 0 0,0 180,310 L 0,420 Z',
    labelCoords: { x: 70, y: 340 },
  },
  {
    id: 'wing_3_right',
    name: 'Right Wing 3-Pointer',
    shortName: 'R Wing 3',
    category: 'three_point',
    pointValue: 3,
    typicalDistance: '23.75+ ft',
    svgPath: 'M 500,140 L 470,140 A 237.5,237.5 0 0,1 320,310 L 500,420 Z',
    labelCoords: { x: 430, y: 340 },
  },
  {
    id: 'top_3_key',
    name: 'Top of the Key 3-Pointer',
    shortName: 'Top Key 3',
    category: 'three_point',
    pointValue: 3,
    typicalDistance: '24-26 ft',
    svgPath: 'M 180,310 A 237.5,237.5 0 0,0 320,310 L 500,420 L 500,470 L 0,470 L 0,420 Z',
    labelCoords: { x: 250, y: 375 },
  },
];

export const ZONE_MAP = new Map<CourtZoneId, ZoneDefinition>(
  COURT_ZONES.map((zone) => [zone.id, zone])
);

/**
 * Determine the closest zone based on normalized click coordinates (0-100%)
 */
export function determineZoneFromCoordinates(xPercent: number, yPercent: number): CourtZoneId {
  // Convert 0-100% to 500 x 470 court coordinates
  const x = (xPercent / 100) * 500;
  const y = (yPercent / 100) * 470;

  const dxRim = x - 250;
  const dyRim = y - 55;
  const distFromRim = Math.sqrt(dxRim * dxRim + dyRim * dyRim);

  // Restricted Area: within 42 units of rim and in front of backboard
  if (distFromRim <= 42 && y >= 38) {
    return 'restricted_area';
  }

  // Paint: between x=170 and x=330, and y<=190
  if (x >= 170 && x <= 330 && y <= 190) {
    return 'paint_non_ra';
  }

  // Corner 3s:
  if (x <= 30 && y <= 140) return 'corner_3_left';
  if (x >= 470 && y <= 140) return 'corner_3_right';

  // 3-point check (distance > 237.5 units)
  const isThreePoint = distFromRim >= 237.5 || (y <= 140 && (x <= 30 || x >= 470));
  if (isThreePoint) {
    if (x < 170) return 'wing_3_left';
    if (x > 330) return 'wing_3_right';
    return 'top_3_key';
  }

  // Mid-Range zones
  // Baseline mid-range
  if (y <= 140) {
    if (x < 170) return 'mid_left_baseline';
    return 'mid_right_baseline';
  }

  // Free throw / High post
  if (x >= 170 && x <= 330 && y <= 250) {
    return 'mid_center_ft';
  }

  // Elbows vs Wings
  if (y <= 240) {
    if (x < 250) return 'mid_left_elbow';
    return 'mid_right_elbow';
  }

  if (x < 250) return 'mid_left_wing';
  return 'mid_right_wing';
}

/**
 * Estimate shot distance in feet from normalized court coordinate
 */
export function estimateDistanceFeet(xPercent: number, yPercent: number): number {
  const x = (xPercent / 100) * 500;
  const y = (yPercent / 100) * 470;
  const dxRim = x - 250;
  const dyRim = y - 55;
  const distUnits = Math.sqrt(dxRim * dxRim + dyRim * dyRim);
  // 10 units = 1 foot
  return Math.max(1, Math.round((distUnits / 10) * 10) / 10);
}
