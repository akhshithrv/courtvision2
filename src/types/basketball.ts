/**
 * Basketball Performance & Trend Analytics Types
 */

export type CourtZoneCategory = 'paint' | 'mid_range' | 'three_point' | 'free_throw';

export type CourtZoneId =
  | 'restricted_area'
  | 'paint_non_ra'
  | 'mid_center_ft'
  | 'mid_left_elbow'
  | 'mid_right_elbow'
  | 'mid_left_baseline'
  | 'mid_right_baseline'
  | 'mid_left_wing'
  | 'mid_right_wing'
  | 'corner_3_left'
  | 'corner_3_right'
  | 'wing_3_left'
  | 'wing_3_right'
  | 'top_3_key';

export interface ZoneDefinition {
  id: CourtZoneId;
  name: string;
  shortName: string;
  category: CourtZoneCategory;
  pointValue: 2 | 3;
  typicalDistance: string;
  svgPath: string; // SVG path data for the zone boundary
  labelCoords: { x: number; y: number }; // Percentage coords for zone badge
}

export interface ShotRecord {
  id: string;
  x: number; // 0-100% normalized court coordinate
  y: number; // 0-100% normalized court coordinate
  zoneId: CourtZoneId;
  isMade: boolean;
  distanceFt: number;
  timestamp: string;
}

export type SessionType = 'shooting_workout' | 'game' | 'scrimmage' | 'skills_drill';

export interface WorkoutSession {
  id: string;
  title: string;
  date: string; // ISO date string or YYYY-MM-DD
  sessionType: SessionType;
  durationMinutes: number;
  shots: ShotRecord[];
  notes?: string;
}

export type DrillCategory = 'shooting' | 'ball_handling' | 'conditioning';

export interface DrillDefinition {
  id: string;
  name: string;
  category: DrillCategory;
  description: string;
  targetCount: number;
  unit: 'shots' | 'seconds' | 'reps';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro';
  instructions: string[];
  recommendedZones?: CourtZoneId[];
}

export interface DrillLog {
  id: string;
  drillId: string;
  drillName: string;
  category: DrillCategory;
  date: string;
  completedValue: number;
  targetValue: number;
  percentageScore?: number;
  durationSeconds?: number;
  notes?: string;
}

export interface AthleticMetricRecord {
  id: string;
  date: string;
  standingVerticalInches: number;
  maxApproachVerticalInches: number;
  sprintThreeQuarterSeconds: number; // 75-foot sprint
  laneAgilitySeconds?: number;
  notes?: string;
}

export interface ZoneStatAggregate {
  zoneId: CourtZoneId;
  name: string;
  category: CourtZoneCategory;
  pointValue: 2 | 3;
  makes: number;
  attempts: number;
  percentage: number;
}
