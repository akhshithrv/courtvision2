# CourtVision: Basketball Performance & Trend Analytics

A modern, high-performance basketball analytics and workout tracker designed for players and coaches to log shooting sessions via an interactive half-court shot chart, track skill drills and ball-handling routines, measure athletic metrics (vertical jump, sprint speed), and analyze historical shooting percentages and performance trends.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and UX choices have been synthesized based on your confirmed preferences in Phase 1:

- **Confirmed: Interactive Half-Court Shot Chart**: Shot tracking features an authentic interactive basketball half-court canvas with 14 distinct shooting zones (paint, restricted area, left/right mid-range, corners, wings, top-of-the-key 3PT) supporting tap-to-log makes, misses, shot distance, and real-time FG% calculation.
- **Confirmed: Multi-Skill Tracking Suite**: Dedicated modules for (1) Shooting spot-up drills and free throw streaks, (2) Ball-handling and dribbling routines (e.g., figure-8s, two-ball pounds, cone crossovers with timed completion rates), and (3) Physical athletic metrics (standing/running vertical jump in inches, 3/4 court sprint in seconds, lane agility).
- **Confirmed: Visual Theme**: Modern dark sports analytics interface (`#0B0F17` pitch dark slate canvas, `#141C2B` card surfaces, `#FF5722` energetic basketball infrared and `#00E5FF` electric cyan telemetry accents), with responsive support for both desktop multi-column analytics and mobile touch ergonomics.
- **Persistence Strategy**: Browser-local indexed storage (`localStorage`) initialized with realistic historical workout data and trend points, alongside full Export/Import JSON backup so your session data and stats remain persistent across refreshes without requiring third-party authentication.

---

## 1. Overview & Core Concept

### What It Does
CourtVision is a dedicated basketball training and tracking application that transforms individual shooting practice and athletic training into actionable performance analytics. Players can:
1. **Log Shooting Workouts & Games**: Tap anywhere on an interactive vector court to record makes ($FG$) and attempts ($FGA$) zone-by-zone, calculating True Shooting %, Effective Field Goal % ($eFG\%$), and hot/cold heatmaps.
2. **Execute & Track Skill Drills**: Follow structured spot-up shooting routines (e.g., 5-Spot 100-shot challenge, 50 Free Throws), ball-handling drills (cone crossovers, two-ball pound drills with timers and rep counters), and log completion ratings.
3. **Record Athletic Progression**: Track measurable physical metrics over time—vertical jump (standing and max approach), sprint times, and agility benchmarks—with trend line graphs and personal records ($PRs$).
4. **Analyze Historical Trends**: View interactive charts showing 7-day, 30-day, and all-time FG% progress, shot distribution by distance, and volume trends over time.

### Target Audience & Persona
- **Ambitious Basketball Players**: From high school and college athletes to recreational rec-league and pickup players dedicated to seeing concrete improvements in their jump shot, handle, and athleticism.
- **Coaches & Trainers**: Looking for an intuitive sideline tool to record player shooting charts during shootarounds and monitor player skill growth over weeks and months.

### Key Value
Eliminates guess-work in practice. Instead of leaving the gym wondering *"did I shoot well today?"*, players leave with exact field goal counts, visual shot dispersion maps, drill consistency benchmarks, and clear historical trends.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Dashboard & Summary View (Home)**:
   - Top KPI ribbon showing overall FG% (e.g., `48.4%`), Total Shots Made / Taken (`1,420 / 2,935`), 3PT% (`37.2%`), Current Workout Streak (`5 days`), and latest Vertical Jump PR (`33.5 in`).
   - Quick "Start Workout" or "Log Quick Session" CTA trigger.
   - Recent workout session timeline with clean unboxed metadata (`Date · 120 Shots · 52.5% FG · High-Mid Hotspot`).
   - 30-day shooting trend line chart comparing 2PT vs 3PT percentages over time.

2. **Interactive Court Shot Tracker (Workout Studio)**:
   - Interactive SVG basketball half-court diagram rendered with regulation court lines (key, restricted arc, free-throw circle, 3-point arc, baseline, sidelines).
   - Dual input modes:
     - **Zone Selection Mode**: Tap any court zone (e.g., Right Corner 3, Free Throw Line, Restricted Area, Left Elbow) to increment makes and misses via rapid numeric steppers (+1 Make / +1 Miss) with instant FG% feedback.
     - **Shot-by-Shot Spot Plotting Mode**: Tap the exact pixel coordinates on the court to drop an instant green make circle or red miss cross.
   - Live Session HUD: Displays current session total makes, attempts, live FG%, and zone efficiency badge.
   - Quick Filter: Toggle between All Zones, 3-Point Shots, Mid-Range, and Paint/At-Rim.

3. **Skills & Ball-Handling Drills Module**:
   - Curated drill catalog organized by category:
     - *Spot-up Shooting*: Corner-to-Corner 3s, Elbow-to-Elbow Mid-Range, 100-Shot Catch & Shoot, Free Throw Pressure Series.
     - *Ball-Handling & Dribbling*: Two-Ball Rhythm Pound, Stationary Figure-8, In-and-Out Crossover Gauntlet, Shammgod Attack.
   - Active Drill Runner: Clean workout timer, target rep/shot count, make/miss counter, and completion notes.
   - Drill History & Mastery Levels: Track personal bests and consistency scores over time.

4. **Athletic Metrics & Physical Benchmarks**:
   - Benchmark entry cards: Standing Vertical Jump (inches), Max Approach Vertical, 3/4 Court Sprint (seconds), Lane Agility Drill time.
   - Historical progression charts showing athletic development over months.
   - Personal Record ($PR$) highlights celebrating milestones.

5. **Historical Analytics & Trends Explorer**:
   - Filter by date range (Last 7 Days, Last 30 Days, Last 90 Days, All-Time) and session type (Workout vs Game).
   - Court Heatmap Overlay: Highlighting high-efficiency green zones ($>50\%$) and cold blue zones ($<35\%$).
   - Shot Distribution Breakdown: Pie/bar distribution of At Rim (0–4ft), Short Mid-Range (4–14ft), Long Mid-Range (14ft–3PT), and 3-Pointers.

### Visual Identity & Theme

- **Aesthetic Direction**: High-energy, modern dark sports analytics aesthetic. Sleek, tactile, and highly legible indoors on the court or outdoors under bright lights.
- **Color Palette & Atmospheric Tokens**:
  - `Canvas Background`: `#0B0F17` (Deep Obsidian Charcoal)
  - `Surface / Card Panels`: `#131B2B` with subtle `#1E293B` hairline border dividers
  - `Court Timber / Surface`: `#101726` court fill with `#334155` crisp court boundary vectors
  - `Primary Accent (Basketball Infrared)`: `#FF5722` (vibrant basketball orange for primary CTAs and active states)
  - `Secondary Accent (Electric Cyan)`: `#00E5FF` (high-clarity metric trends and analytics highlights)
  - `Success / Make Accent`: `#10B981` (Crisp Emerald for made shots and upward trends)
  - `Miss Accent`: `#F43F5E` (Vibrant Rose/Coral for missed shots)
  - `Typography Neutrals`: `#F8FAFC` high-contrast headline text, `#94A3B8` secondary body text, `#64748B` subtle metadata
- **Typography & Font Pairing**:
  - **Display / Headers**: `Plus Jakarta Sans` or `Outfit` (clean geometric athletic sans, heavy bold weights for KPIs and section titles).
  - **Body / Prose**: `DM Sans` or `Plus Jakarta Sans` for clean, readable descriptions and drill instructions.
  - **Metrics & Numbers**: `JetBrains Mono` / `tabular-nums` for rock-solid tabular vertical alignment on all FG%, shot counters, timers, and jump heights.
- **Component Styling & Anti-Slop Discipline**:
  - Zero static pill boxes for metadata: dates, shot totals, and categories displayed with subtle typographic separators (`·` or `/`).
  - Single-line controls with whitespace-nowrap and touch-friendly $\ge 44\text{px}$ hitboxes.
  - Interactive segmented buttons for filters and tabs, with clear active states.
  - No decorative pulsing dots or code comments in the UI.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Interactive SVG Vector Court vs Canvas/WebGL**
  - *Chosen Approach*: Scalable SVG vector court with designated coordinate zones and interactive click handlers.
  - *Why*: SVG provides resolution-independent rendering across retina displays, crisp responsive scaling on mobile and desktop, and direct DOM event handling for individual zones without heavy WebGL engine overhead.
  - *Alternatives Considered*: HTML5 Canvas (more cumbersome for hit-testing individual zones and hover tooltips) or 3D Three.js court (unnecessary CPU battery drain during intense gym training).

- **Decision 2: Hybrid Shot Tracking (Zone-Based + Free-Form Point Placement)**
  - *Chosen Approach*: Support both designated shooting zones (Paint, Left Corner 3, Top Key, etc.) for rapid high-volume logging, as well as coordinate-based shot drop pins for pinpoint accuracy.
  - *Why*: In a fast-paced shooting drill, tapping "+5 Makes, +3 Misses" in the Right Corner is much faster than plotting 8 individual taps; for game review or film breakdown, exact shot points are preferred. Offering both modes delivers maximum training flexibility.

- **Decision 3: Local Reactive Persistence with Seeded Starter Data**
  - *Chosen Approach*: Reactive store backed by browser `localStorage` pre-seeded with realistic workout sessions, drill logs, and athletic metric history.
  - *Why*: Users can immediately explore historical trends, view court heatmaps, and test logging without starting with a blank void. Full JSON backup allows users to export and import real personal data anytime.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                              App.tsx                                   │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Navigation Header: Brand Wordmark | View Tabs | New Workout CTA  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                   │                                    │
│         ┌─────────────────────────┴────────────────────────┐           │
│         ▼                                                  ▼           │
│  ┌───────────────────────────────┐  ┌────────────────────────────────┐ │
│  │       Active View Router      │  │        Global Data Store       │ │
│  │ 1. Dashboard & KPI Overview   │  │   (BasketballStore / Context)  │ │
│  │ 2. Interactive Court Studio   │  │  • Sessions & Shot Points      │ │
│  │ 3. Skills & Drills Center     │  │  • Zone Aggregates & Heatmap   │ │
│  │ 4. Athletic Metrics & PRs     │  │  • Drill Logs & Timers         │ │
│  │ 5. Trend Analytics Explorer   │  │  • Athletic Metric Benchmarks  │ │
│  └───────────────────────────────┘  └────────────────────────────────┘ │
│         │                    │                     │                   │
│         ▼                    ▼                     ▼                   │
│  ┌──────────────┐    ┌──────────────┐       ┌──────────────┐           │
│  │ HalfCourtSvg │    │ DrillRunner  │       │ TrendCharts  │           │
│  │ • 14 Zones   │    │ • Timers     │       │ • FG% Trends │           │
│  │ • Shot Pins  │    │ • Reps/Makes │       │ • Zones Heat │           │
│  │ • Heat Colors│    │ • Target PRs │       │ • Jump PRs   │           │
│  └──────────────┘    └──────────────┘       └──────────────┘           │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State Entities

```typescript
// Core Data Entities
export interface ShotRecord {
  id: string;
  x: number; // 0-100% normalized court coordinates
  y: number; // 0-100% normalized court coordinates
  zoneId: CourtZoneId;
  isMade: boolean;
  distanceFt: number;
  timestamp: string;
}

export type CourtZoneId =
  | 'restricted_area'
  | 'paint_non_ra'
  | 'mid_left_baseline'
  | 'mid_right_baseline'
  | 'mid_left_wing'
  | 'mid_right_wing'
  | 'mid_center_ft'
  | 'corner_3_left'
  | 'corner_3_right'
  | 'wing_3_left'
  | 'wing_3_right'
  | 'top_3_key';

export interface WorkoutSession {
  id: string;
  title: string;
  date: string;
  sessionType: 'shooting_workout' | 'game' | 'scrimmage' | 'skills_drill';
  shots: ShotRecord[];
  notes?: string;
  durationMinutes: number;
}

export interface DrillDefinition {
  id: string;
  name: string;
  category: 'shooting' | 'ball_handling' | 'conditioning';
  description: string;
  targetCount: number;
  unit: 'shots' | 'seconds' | 'reps';
  defaultZones?: CourtZoneId[];
}

export interface DrillLog {
  id: string;
  drillId: string;
  date: string;
  completedValue: number;
  targetValue: number;
  percentageScore?: number;
  notes?: string;
}

export interface AthleticMetricRecord {
  id: string;
  date: string;
  standingVerticalInches: number;
  maxApproachVerticalInches: number;
  sprintThreeQuarterSeconds: number;
  laneAgilitySeconds?: number;
  notes?: string;
}
```

### Interactive Component & State Mapping

1. **`CourtShotStudio`**:
   - Manages active workout session state.
   - Clicking any zone highlights zone boundary, activates zone counter overlay (`+1 Make`, `+1 Miss`, `-1 Undo`).
   - Free-form mode places an SVG animated shot marker with make/miss toggle.
   - Computes live FG% (`(makes / attempts) * 100`) and displays live hot/cold color tint.
   - "Finish & Save Workout" commits session to persistent storage with celebratory feedback.

2. **`SkillsDrillsView`**:
   - Catalog filtering by skill category (`Shooting`, `Ball-Handling`, `Conditioning`).
   - Active Drill Runner modal with countdown/countup stopwatch timer, rep/make logger, and completion rating.
   - Automatically records Personal Best ($PR$) badge if completed score exceeds previous attempts.

3. **`AthleticMetricsView`**:
   - Log Form with validation for jump heights (inches) and sprint speed (seconds).
   - Dynamic trend charts plotting vertical jump progression over training cycles.
   - PR comparison cards showcasing improvement from baseline.

4. **`TrendsAnalyticsView`**:
   - Time-range selector (7D, 30D, 90D, All).
   - SVG Area/Line Chart of FG% and 3PT% trajectory over time with tabular monthly summaries.
   - Shot volume stacked bars and zone-by-zone efficiency breakdown table.
   - Data management: Reset to demo data or Export/Import JSON data.
