
export enum SkillLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export enum RidingStyle {
  CLASSIC = 'CLASSIC',
  PERFORMANCE = 'PERFORMANCE',
  ALL_ROUNDER = 'ALL_ROUNDER'
}

export enum WaveType {
  MELLOW = 'MELLOW',
  STEEP = 'STEEP',
  MIXED = 'MIXED'
}

export interface UserProfile {
  height: number;
  weight: number;
  gender: 'MALE' | 'FEMALE';
  skill: SkillLevel;
  style: RidingStyle;
  waveType: WaveType;
  preferredLocation: string;
  currentSkills: string; // Added: specific technical level (e.g., side riding, cutback)
  desiredTechniques: string;
  currentBoard?: string;
}

export interface BoardSpecs {
  length: string;
  width: string;
  thickness: string;
  volume: string;
  rail: string;
  rocker: string;
}

export interface Recommendation {
  modelName: string;
  brand: string;
  specs: BoardSpecs;
  reason: string;
}

export interface AdvisorResult {
  diagnosis: string;
  localTrend: string;
  recommendations: Recommendation[];
  setupTips: string;
  expertAdvice: string;
  myProgress?: {
    points: string;
    badge: string;
  };
  quiverCheck?: {
    score: number;
    analysis: string;
  };
  logData: {
    user_weight: number;
    location: string;
    style: string;
    stamina_level: string;
    recommended_models: string[];
    progress_score?: number;
    wishlist_match?: string;
  };
}
