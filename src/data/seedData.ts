import { AthleticMetricRecord, DrillLog, WorkoutSession } from '../types/basketball';

export const INITIAL_ATHLETIC_RECORDS: AthleticMetricRecord[] = [
  {
    id: 'ath_1',
    date: '2026-08-15',
    standingVerticalInches: 28.5,
    maxApproachVerticalInches: 31.0,
    sprintThreeQuarterSeconds: 3.48,
    laneAgilitySeconds: 11.8,
    notes: 'Pre-season baseline combine testing. Solid foundation.',
  },
  {
    id: 'ath_2',
    date: '2026-09-12',
    standingVerticalInches: 29.5,
    maxApproachVerticalInches: 32.0,
    sprintThreeQuarterSeconds: 3.42,
    laneAgilitySeconds: 11.5,
    notes: 'After 4 weeks of plyometrics and Bulgarian split squats.',
  },
  {
    id: 'ath_3',
    date: '2026-10-10',
    standingVerticalInches: 30.5,
    maxApproachVerticalInches: 33.0,
    sprintThreeQuarterSeconds: 3.36,
    laneAgilitySeconds: 11.2,
    notes: 'Reached rim grazes on two-foot approach!',
  },
  {
    id: 'ath_4',
    date: '2026-11-02',
    standingVerticalInches: 31.5,
    maxApproachVerticalInches: 34.0,
    sprintThreeQuarterSeconds: 3.31,
    laneAgilitySeconds: 10.9,
    notes: 'Personal record! Clean two-handed flush on 10ft rim.',
  },
];

export const INITIAL_DRILL_LOGS: DrillLog[] = [
  {
    id: 'dlog_1',
    drillId: 'drill_5_spot_100',
    drillName: '5-Spot 100-Shot Challenge',
    category: 'shooting',
    date: '2026-11-04',
    completedValue: 74,
    targetValue: 100,
    percentageScore: 74,
    durationSeconds: 920,
    notes: 'Hot from both corners (17/20 left, 18/20 right). Top of key dipped slightly.',
  },
  {
    id: 'dlog_2',
    drillId: 'drill_two_ball_pound',
    drillName: 'Two-Ball Heavy Rhythm Pound',
    category: 'ball_handling',
    date: '2026-11-04',
    completedValue: 60,
    targetValue: 60,
    percentageScore: 100,
    durationSeconds: 60,
    notes: 'Zero ball fumbles. Off-hand control significantly improved.',
  },
  {
    id: 'dlog_3',
    drillId: 'drill_clutch_50_ft',
    drillName: 'Clutch 50 Free Throws',
    category: 'shooting',
    date: '2026-11-03',
    completedValue: 44,
    targetValue: 50,
    percentageScore: 88,
    durationSeconds: 480,
    notes: 'Started 20/20, finished strong with 9/10 in set 5.',
  },
  {
    id: 'dlog_4',
    drillId: 'drill_cone_crossover_burst',
    drillName: 'Cone In-and-Out Crossover Gauntlet',
    category: 'ball_handling',
    date: '2026-11-02',
    completedValue: 15,
    targetValue: 15,
    percentageScore: 100,
    durationSeconds: 420,
    notes: 'Sharpened downhill explosion out of the change of direction.',
  },
  {
    id: 'dlog_5',
    drillId: 'drill_elbow_pick_pop',
    drillName: 'Elbow-to-Elbow Mid-Range Pop',
    category: 'shooting',
    date: '2026-10-31',
    completedValue: 23,
    targetValue: 30,
    percentageScore: 76.7,
    durationSeconds: 310,
    notes: 'Footwork was crisp, consistent elevation on catch.',
  },
  {
    id: 'dlog_6',
    drillId: 'drill_shammgod_hesitation',
    drillName: 'Shammgod & Hesi Attack Series',
    category: 'ball_handling',
    date: '2026-10-29',
    completedValue: 20,
    targetValue: 20,
    percentageScore: 100,
    durationSeconds: 360,
    notes: 'Left-hand pull back felt just as natural as dominant hand.',
  },
];

// Helper to generate realistic shots
function createShotsBatch(
  count: number,
  makeRate: number,
  zoneDistribution: { zoneId: any; weight: number; x: number; y: number }[]
) {
  const shots = [];
  const totalWeight = zoneDistribution.reduce((sum, z) => sum + z.weight, 0);

  for (let i = 0; i < count; i++) {
    // Pick zone by weight
    let r = Math.random() * totalWeight;
    let selected = zoneDistribution[0];
    for (const z of zoneDistribution) {
      if (r <= z.weight) {
        selected = z;
        break;
      }
      r -= z.weight;
    }

    const isMade = Math.random() < makeRate;
    // slight jitter around zone center in percentage
    const jitterX = (Math.random() - 0.5) * 4;
    const jitterY = (Math.random() - 0.5) * 4;

    shots.push({
      id: `shot_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
      x: Math.max(2, Math.min(98, selected.x + jitterX)),
      y: Math.max(2, Math.min(96, selected.y + jitterY)),
      zoneId: selected.zoneId,
      isMade,
      distanceFt: selected.zoneId.includes('3') ? 23.5 : selected.zoneId.includes('paint') ? 7 : 16,
      timestamp: new Date().toISOString(),
    });
  }
  return shots;
}

export const INITIAL_SESSIONS: WorkoutSession[] = [
  {
    id: 'sess_1',
    title: 'Morning Perimeter Shooting & Corner 3s',
    date: '2026-11-04',
    sessionType: 'shooting_workout',
    durationMinutes: 45,
    notes: 'Felt very fluid off the catch. Focused on quick dip and high release point.',
    shots: createShotsBatch(120, 0.53, [
      { zoneId: 'corner_3_left', weight: 25, x: 5, y: 15 },
      { zoneId: 'corner_3_right', weight: 25, x: 95, y: 15 },
      { zoneId: 'wing_3_left', weight: 20, x: 18, y: 55 },
      { zoneId: 'wing_3_right', weight: 20, x: 82, y: 55 },
      { zoneId: 'mid_center_ft', weight: 15, x: 50, y: 40 },
      { zoneId: 'restricted_area', weight: 15, x: 50, y: 12 },
    ]),
  },
  {
    id: 'sess_2',
    title: 'Competitive 5v5 Rec League Game',
    date: '2026-11-02',
    sessionType: 'game',
    durationMinutes: 40,
    notes: 'Won 68-61. Created great looks off high pick-and-roll. Hit two clutch corner threes in Q4.',
    shots: createShotsBatch(18, 0.50, [
      { zoneId: 'restricted_area', weight: 6, x: 50, y: 12 },
      { zoneId: 'corner_3_left', weight: 4, x: 5, y: 15 },
      { zoneId: 'mid_left_elbow', weight: 3, x: 26, y: 42 },
      { zoneId: 'top_3_key', weight: 3, x: 50, y: 72 },
      { zoneId: 'mid_center_ft', weight: 2, x: 50, y: 40 },
    ]),
  },
  {
    id: 'sess_3',
    title: 'Mid-Range Pull-Up & Floater Series',
    date: '2026-10-30',
    sessionType: 'shooting_workout',
    durationMinutes: 50,
    notes: 'Focused on 1-dribble pull-ups going left and right from the elbows.',
    shots: createShotsBatch(100, 0.49, [
      { zoneId: 'mid_left_elbow', weight: 25, x: 26, y: 42 },
      { zoneId: 'mid_right_elbow', weight: 25, x: 74, y: 42 },
      { zoneId: 'paint_non_ra', weight: 20, x: 50, y: 28 },
      { zoneId: 'mid_center_ft', weight: 15, x: 50, y: 40 },
      { zoneId: 'restricted_area', weight: 15, x: 50, y: 12 },
    ]),
  },
  {
    id: 'sess_4',
    title: 'Sunday Deep Perimeter Volume Shootaround',
    date: '2026-10-27',
    sessionType: 'shooting_workout',
    durationMinutes: 60,
    notes: 'Volume workout with rebounder. 150 shots total.',
    shots: createShotsBatch(150, 0.46, [
      { zoneId: 'top_3_key', weight: 35, x: 50, y: 72 },
      { zoneId: 'wing_3_left', weight: 30, x: 18, y: 55 },
      { zoneId: 'wing_3_right', weight: 30, x: 82, y: 55 },
      { zoneId: 'corner_3_left', weight: 25, x: 5, y: 15 },
      { zoneId: 'corner_3_right', weight: 25, x: 95, y: 15 },
      { zoneId: 'mid_center_ft', weight: 5, x: 50, y: 40 },
    ]),
  },
  {
    id: 'sess_5',
    title: 'Midday Skill Work & Baseline Shooting',
    date: '2026-10-24',
    sessionType: 'skills_drill',
    durationMinutes: 35,
    notes: 'Drilled baseline fadeaways and spot-up baseline jumpers.',
    shots: createShotsBatch(80, 0.51, [
      { zoneId: 'mid_left_baseline', weight: 25, x: 18, y: 15 },
      { zoneId: 'mid_right_baseline', weight: 25, x: 82, y: 15 },
      { zoneId: 'paint_non_ra', weight: 15, x: 50, y: 28 },
      { zoneId: 'restricted_area', weight: 15, x: 50, y: 12 },
    ]),
  },
  {
    id: 'sess_6',
    title: 'Intense 3v3 Half-Court Scrimmage',
    date: '2026-10-21',
    sessionType: 'scrimmage',
    durationMinutes: 45,
    notes: 'Fast paced. Finished strong around the rim against contact.',
    shots: createShotsBatch(25, 0.52, [
      { zoneId: 'restricted_area', weight: 10, x: 50, y: 12 },
      { zoneId: 'mid_center_ft', weight: 5, x: 50, y: 40 },
      { zoneId: 'top_3_key', weight: 5, x: 50, y: 72 },
      { zoneId: 'wing_3_right', weight: 5, x: 82, y: 55 },
    ]),
  },
];
