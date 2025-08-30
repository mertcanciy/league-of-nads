// Strategic Categories (User chooses 4 out of 7)
export type StrategicCategory = 
  | 'formation' 
  | 'defensivePhilosophy' 
  | 'trainingFocus' 
  | 'attackingApproach' 
  | 'strikerRole' 
  | 'tempoStyle' 
  | 'matchMentality';

// Environmental Categories (Always random)
export interface EnvironmentalFactors {
  weather: Weather;
  pitchConditions: PitchConditions;
  matchAtmosphere: MatchAtmosphere;
  matchImportance: MatchImportance;
}

// User's Strategic Choices (all 7 categories they control)
export interface StrategyChoices {
  formation: Formation;
  defensivePhilosophy: DefensivePhilosophy;
  trainingFocus: TrainingFocus;
  attackingApproach: AttackingApproach;
  strikerRole: StrikerRole;
  tempoStyle: TempoStyle;
  matchMentality: MatchMentality;
}

// Strategy Options
export type Formation = '4-3-3' | '4-4-2' | '3-5-2' | '4-2-3-1' | '5-3-2' | '3-4-3';
export type DefensivePhilosophy = 'High Press' | 'Gegenpressing' | 'Mid Block' | 'Low Block' | 'Counter-Attack' | 'Offside Trap';
export type TrainingFocus = 'Set Pieces' | 'Finishing Practice' | 'Movement Drills' | 'Team Shape' | 'Individual Skills' | 'Physical Prep';
export type AttackingApproach = 'Wing Play' | 'Through the Middle' | 'Long Balls' | 'Build-Up Play' | 'Quick Transitions' | 'Individual Brilliance';
export type StrikerRole = 'Target Man' | 'Poacher' | 'False 9' | 'Wide Forward' | 'Deep Striker' | 'Penalty Box Predator';
export type TempoStyle = 'High Tempo' | 'Controlled Pace' | 'Patient Build-Up' | 'Direct Style' | 'Reactive Play' | 'Chaos Ball';
export type MatchMentality = 'Aggressive' | 'Confident' | 'Cautious' | 'Desperate' | 'Clinical' | 'Expressive';

// Environmental Factors
export type Weather = 'Perfect Day' | 'Light Rain' | 'Heavy Rain' | 'Strong Wind' | 'Cold Weather' | 'Extreme Heat';
export type PitchConditions = 'Perfect Grass' | 'Worn Grass' | 'Artificial Turf' | 'Muddy Pitch' | 'Dry/Hard Pitch' | 'Newly Laid Grass';
export type MatchAtmosphere = 'Home + Electric Crowd' | 'Home + Supportive Crowd' | 'Home + Quiet Crowd' | 'Away + Hostile Crowd' | 'Away + Neutral Crowd' | 'Away + Friendly Crowd';
export type MatchImportance = 'Cup Final' | 'Derby Match' | 'Regular League' | 'End of Season' | 'Relegation Battle' | 'Dead Rubber';

// Strategy Multipliers
export interface StrategyMultipliers {
  formation: number;
  defensivePhilosophy: number;
  trainingFocus: number;
  attackingApproach: number;
  strikerRole: number;
  tempoStyle: number;
  matchMentality: number;
}

// Environmental Multipliers
export interface EnvironmentalMultipliers {
  weather: number;
  pitchConditions: number;
  matchAtmosphere: number;
  matchImportance: number;
}

// Match Result
export interface MatchResult {
  goalsScored: number;
  lambda: number;
  strategyChoices: StrategyChoices;
  environmentalFactors: EnvironmentalFactors;
  strategyMultiplier: number;
  environmentalMultiplier: number;
  timestamp: number;
  matchId: string;
}

// Player Stats
export interface PlayerStats {
  totalGoals: number;
  totalMatches: number;
  efficiency: number;
  username?: string;
  walletAddress: string;
  gameGoals?: number;
  gameMatches?: number;
}

// Monad Games ID User
export interface MonadGamesUser {
  id: number;
  username: string;
  walletAddress: string;
  needsUsername?: boolean;
  needsLinking?: boolean;
}

// Leaderboard Entry
export interface LeaderboardEntry {
  rank: number;
  username: string;
  walletAddress: string;
  totalGoals: number;
  totalMatches: number;
  efficiency: number;
}
