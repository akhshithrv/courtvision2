import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { COURT_ZONES } from '../data/courtZones';
import { INITIAL_ATHLETIC_RECORDS, INITIAL_DRILL_LOGS, INITIAL_SESSIONS } from '../data/seedData';
import {
  AthleticMetricRecord,
  CourtZoneId,
  DrillLog,
  WorkoutSession,
  ZoneStatAggregate,
} from '../types/basketball';

interface BasketballContextType {
  sessions: WorkoutSession[];
  drillLogs: DrillLog[];
  athleticRecords: AthleticMetricRecord[];

  // Actions
  addSession: (session: WorkoutSession) => void;
  deleteSession: (id: string) => void;
  addDrillLog: (log: DrillLog) => void;
  deleteDrillLog: (id: string) => void;
  addAthleticRecord: (record: AthleticMetricRecord) => void;
  deleteAthleticRecord: (id: string) => void;
  resetToDemoData: () => void;
  exportData: () => void;
  importData: (jsonString: string) => boolean;

  // Filtered / Aggregated Stats
  allShotsCount: number;
  allMakesCount: number;
  overallFgPercentage: number;
  twoPointStats: { makes: number; attempts: number; percentage: number };
  threePointStats: { makes: number; attempts: number; percentage: number };
  zoneAggregates: Record<CourtZoneId, ZoneStatAggregate>;
  streakDays: number;
  bestVerticalJump: number;
  bestSprintTime: number;
}

const STORAGE_KEYS = {
  SESSIONS: 'courtvision_sessions_v1',
  DRILLS: 'courtvision_drill_logs_v1',
  ATHLETICS: 'courtvision_athletics_v1',
};

const BasketballContext = createContext<BasketballContextType | null>(null);

export const BasketballProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<WorkoutSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading sessions from storage', e);
    }
    return INITIAL_SESSIONS;
  });

  const [drillLogs, setDrillLogs] = useState<DrillLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DRILLS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading drills from storage', e);
    }
    return INITIAL_DRILL_LOGS;
  });

  const [athleticRecords, setAthleticRecords] = useState<AthleticMetricRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATHLETICS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading athletics from storage', e);
    }
    return INITIAL_ATHLETIC_RECORDS;
  });

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save sessions', e);
    }
  }, [sessions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DRILLS, JSON.stringify(drillLogs));
    } catch (e) {
      console.error('Failed to save drills', e);
    }
  }, [drillLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ATHLETICS, JSON.stringify(athleticRecords));
    } catch (e) {
      console.error('Failed to save athletics', e);
    }
  }, [athleticRecords]);

  const addSession = (session: WorkoutSession) => {
    setSessions((prev) => [session, ...prev]);
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const addDrillLog = (log: DrillLog) => {
    setDrillLogs((prev) => [log, ...prev]);
  };

  const deleteDrillLog = (id: string) => {
    setDrillLogs((prev) => prev.filter((d) => d.id !== id));
  };

  const addAthleticRecord = (record: AthleticMetricRecord) => {
    setAthleticRecords((prev) =>
      [...prev, record].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    );
  };

  const deleteAthleticRecord = (id: string) => {
    setAthleticRecords((prev) => prev.filter((a) => a.id !== id));
  };

  const resetToDemoData = () => {
    setSessions(INITIAL_SESSIONS);
    setDrillLogs(INITIAL_DRILL_LOGS);
    setAthleticRecords(INITIAL_ATHLETIC_RECORDS);
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.DRILLS);
    localStorage.removeItem(STORAGE_KEYS.ATHLETICS);
  };

  const exportData = () => {
    const payload = {
      sessions,
      drillLogs,
      athleticRecords,
      exportedAt: new Date().toISOString(),
      app: 'CourtVision Basketball Tracker',
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `courtvision_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.sessions)) setSessions(data.sessions);
      if (Array.isArray(data.drillLogs)) setDrillLogs(data.drillLogs);
      if (Array.isArray(data.athleticRecords)) setAthleticRecords(data.athleticRecords);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  // Calculations
  const allShots = useMemo(() => {
    return sessions.flatMap((s) => s.shots);
  }, [sessions]);

  const allShotsCount = allShots.length;
  const allMakesCount = allShots.filter((s) => s.isMade).length;
  const overallFgPercentage =
    allShotsCount > 0 ? Math.round((allMakesCount / allShotsCount) * 1000) / 10 : 0;

  const { twoPointStats, threePointStats, zoneAggregates } = useMemo(() => {
    let twoMakes = 0;
    let twoAttempts = 0;
    let threeMakes = 0;
    let threeAttempts = 0;

    const baseAggregates: Record<CourtZoneId, ZoneStatAggregate> = {} as any;
    for (const z of COURT_ZONES) {
      baseAggregates[z.id] = {
        zoneId: z.id,
        name: z.name,
        category: z.category,
        pointValue: z.pointValue,
        makes: 0,
        attempts: 0,
        percentage: 0,
      };
    }

    for (const shot of allShots) {
      const zone = baseAggregates[shot.zoneId];
      if (zone) {
        zone.attempts += 1;
        if (shot.isMade) zone.makes += 1;
        if (zone.pointValue === 3) {
          threeAttempts += 1;
          if (shot.isMade) threeMakes += 1;
        } else {
          twoAttempts += 1;
          if (shot.isMade) twoMakes += 1;
        }
      }
    }

    for (const z of COURT_ZONES) {
      const agg = baseAggregates[z.id];
      agg.percentage =
        agg.attempts > 0 ? Math.round((agg.makes / agg.attempts) * 1000) / 10 : 0;
    }

    return {
      twoPointStats: {
        makes: twoMakes,
        attempts: twoAttempts,
        percentage: twoAttempts > 0 ? Math.round((twoMakes / twoAttempts) * 1000) / 10 : 0,
      },
      threePointStats: {
        makes: threeMakes,
        attempts: threeAttempts,
        percentage: threeAttempts > 0 ? Math.round((threeMakes / threeAttempts) * 1000) / 10 : 0,
      },
      zoneAggregates: baseAggregates,
    };
  }, [allShots]);

  // Workout streak calculation
  const streakDays = useMemo(() => {
    if (sessions.length === 0) return 0;
    const uniqueDates = Array.from(new Set(sessions.map((s) => s.date.slice(0, 10)))).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    if (uniqueDates.length === 0) return 0;

    // Check if latest date is today or yesterday
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    const firstDate = uniqueDates[0];
    if (firstDate !== todayStr && firstDate !== yesterdayStr) {
      // Streak broken recently, but if within 3 days still give recent count
      return 1;
    }

    let streak = 1;
    let curr = new Date(firstDate);

    for (let i = 1; i < uniqueDates.length; i++) {
      const prevExpected = new Date(curr);
      prevExpected.setDate(prevExpected.getDate() - 1);
      const prevExpectedStr = prevExpected.toISOString().slice(0, 10);

      if (uniqueDates[i] === prevExpectedStr) {
        streak++;
        curr = prevExpected;
      } else {
        break;
      }
    }
    return streak;
  }, [sessions]);

  const bestVerticalJump = useMemo(() => {
    if (athleticRecords.length === 0) return 0;
    return Math.max(...athleticRecords.map((r) => r.maxApproachVerticalInches || 0));
  }, [athleticRecords]);

  const bestSprintTime = useMemo(() => {
    if (athleticRecords.length === 0) return 0;
    return Math.min(...athleticRecords.map((r) => r.sprintThreeQuarterSeconds || 99));
  }, [athleticRecords]);

  return (
    <BasketballContext.Provider
      value={{
        sessions,
        drillLogs,
        athleticRecords,
        addSession,
        deleteSession,
        addDrillLog,
        deleteDrillLog,
        addAthleticRecord,
        deleteAthleticRecord,
        resetToDemoData,
        exportData,
        importData,
        allShotsCount,
        allMakesCount,
        overallFgPercentage,
        twoPointStats,
        threePointStats,
        zoneAggregates,
        streakDays,
        bestVerticalJump,
        bestSprintTime,
      }}
    >
      {children}
    </BasketballContext.Provider>
  );
};

export const useBasketball = () => {
  const context = useContext(BasketballContext);
  if (!context) {
    throw new Error('useBasketball must be used within a BasketballProvider');
  }
  return context;
};
