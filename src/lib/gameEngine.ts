import { 
  StrategyChoices, 
  StrategyMultipliers, 
  EnvironmentalFactors,
  EnvironmentalMultipliers,
  MatchResult,
  StrategicCategory,
  Weather,
  PitchConditions,
  MatchAtmosphere,
  MatchImportance
} from '@/types/game';

// Base goal rate (λ) for a striker
const BASE_LAMBDA = 0.5;

// Strategic category multipliers
const STRATEGY_MULTIPLIERS = {
  formation: {
    '4-3-3': 1.2,           // Classic attacking setup, wide forwards
    '4-4-2': 1.0,           // Traditional balanced approach, twin strikers
    '3-5-2': 0.9,           // Wing-backs provide width, compact middle
    '4-2-3-1': 1.1,         // Single striker with attacking midfield support
    '5-3-2': 0.8,           // Defensive solidity, counter-attack ready
    '3-4-3': 1.3,           // Aggressive, high attacking line
  },
  defensivePhilosophy: {
    'High Press': 1.2,      // Aggressive pressing in opponent's half
    'Gegenpressing': 1.3,   // Immediate counter-press after losing ball
    'Mid Block': 1.0,       // Compact defensive shape in middle third
    'Low Block': 0.8,       // Deep defensive line, absorb pressure
    'Counter-Attack': 1.1,  // Sit deep, hit on quick transitions
    'Offside Trap': 1.0,    // High line with coordinated stepping up
  },
  trainingFocus: {
    'Set Pieces': 1.1,      // Corners, free kicks, penalties
    'Finishing Practice': 1.3, // Shooting accuracy and power
    'Movement Drills': 1.2, // Runs, positioning, timing
    'Team Shape': 1.0,      // Positional play and coordination
    'Individual Skills': 1.1, // 1v1, technical work
    'Physical Prep': 0.9,   // Fitness, sprint work, strength
  },
  attackingApproach: {
    'Wing Play': 1.1,       // Crosses and wide attacks
    'Through the Middle': 1.2, // Central penetration and passing
    'Long Balls': 1.0,      // Direct balls to striker
    'Build-Up Play': 0.9,   // Patient possession-based attacks
    'Quick Transitions': 1.3, // Fast counter-attacks
    'Individual Brilliance': 1.1, // Give your best players freedom
  },
  strikerRole: {
    'Target Man': 1.0,      // Hold up play, bring others into game
    'Poacher': 1.3,         // Stay in box, focus purely on finishing
    'False 9': 1.1,         // Drop deep, create space for others
    'Wide Forward': 1.2,    // Drift wide, cut inside to shoot
    'Deep Striker': 1.0,    // Link play, create as well as score
    'Penalty Box Predator': 1.2, // Attack crosses and rebounds
  },
  tempoStyle: {
    'High Tempo': 1.2,      // Quick passing, constant movement
    'Controlled Pace': 1.0, // Dictate rhythm, vary speed
    'Patient Build-Up': 0.8, // Slow, methodical progression
    'Direct Style': 1.3,    // Get ball forward quickly
    'Reactive Play': 1.0,   // Adapt to opponent's tempo
    'Chaos Ball': 1.1,      // High energy, unpredictable attacks
  },
  matchMentality: {
    'Aggressive': 1.2,      // Take risks, force the action
    'Confident': 1.1,       // Believe in abilities, play natural game
    'Cautious': 0.9,        // Avoid mistakes, build confidence gradually
    'Desperate': 1.3,       // Throw everything forward, all-or-nothing
    'Clinical': 1.1,        // Stay composed, take chances when they come
    'Expressive': 1.0,      // Play with flair and creativity
  },
};

// Environmental factor multipliers
const ENVIRONMENTAL_MULTIPLIERS = {
  weather: {
    'Perfect Day': 1.0,     // Sunny, mild temperature, no wind
    'Light Rain': 0.95,     // Slippery surface, affects passing
    'Heavy Rain': 0.9,      // Difficult ball control, favors direct play
    'Strong Wind': 0.9,     // Affects long passes and shooting
    'Cold Weather': 0.95,   // Players need time to warm up
    'Extreme Heat': 0.9,    // Fatigue sets in faster
  },
  pitchConditions: {
    'Perfect Grass': 1.0,   // Pristine natural surface
    'Worn Grass': 0.95,     // Patches and divots affect ball roll
    'Artificial Turf': 1.05, // Consistent but fast surface
    'Muddy Pitch': 0.85,    // Heavy, slow conditions
    'Dry/Hard Pitch': 1.05, // Ball bounces more, favors technical play
    'Newly Laid Grass': 0.9, // Soft surface, unpredictable bounces
  },
  matchAtmosphere: {
    'Home + Electric Crowd': 1.15,  // Maximum support, intimidating for opponents
    'Home + Supportive Crowd': 1.1, // Good backing from home fans
    'Home + Quiet Crowd': 1.0,      // Neutral atmosphere at home
    'Away + Hostile Crowd': 0.85,   // Intimidating away environment
    'Away + Neutral Crowd': 0.95,   // Standard away match difficulty
    'Away + Friendly Crowd': 1.0,   // Welcoming or mixed support
  },
  matchImportance: {
    'Cup Final': 1.1,       // Big stage brings out the best
    'Derby Match': 1.05,    // Extra motivation against rivals
    'Regular League': 1.0,  // Standard match pressure
    'End of Season': 0.95,  // Some players on vacation mode
    'Relegation Battle': 1.05, // Desperation brings intensity
    'Dead Rubber': 0.9,     // Nothing to play for
  },
};

// Generate random environmental factors
export function generateEnvironmentalFactors(): EnvironmentalFactors {
  const weatherOptions: Weather[] = ['Perfect Day', 'Light Rain', 'Heavy Rain', 'Strong Wind', 'Cold Weather', 'Extreme Heat'];
  const pitchOptions: PitchConditions[] = ['Perfect Grass', 'Worn Grass', 'Artificial Turf', 'Muddy Pitch', 'Dry/Hard Pitch', 'Newly Laid Grass'];
  const atmosphereOptions: MatchAtmosphere[] = ['Home + Electric Crowd', 'Home + Supportive Crowd', 'Home + Quiet Crowd', 'Away + Hostile Crowd', 'Away + Neutral Crowd', 'Away + Friendly Crowd'];
  const importanceOptions: MatchImportance[] = ['Cup Final', 'Derby Match', 'Regular League', 'End of Season', 'Relegation Battle', 'Dead Rubber'];

  return {
    weather: weatherOptions[Math.floor(Math.random() * weatherOptions.length)],
    pitchConditions: pitchOptions[Math.floor(Math.random() * pitchOptions.length)],
    matchAtmosphere: atmosphereOptions[Math.floor(Math.random() * atmosphereOptions.length)],
    matchImportance: importanceOptions[Math.floor(Math.random() * importanceOptions.length)],
  };
}

// Calculate strategy multiplier from user's choices
export function calculateStrategyMultiplier(choices: StrategyChoices): number {
  let totalMultiplier = 1.0;
  
  // Calculate multipliers for all 7 strategic categories
  Object.entries(choices).forEach(([category, value]) => {
    const categoryKey = category as keyof StrategyChoices;
    const categoryMultipliers = STRATEGY_MULTIPLIERS[categoryKey] as Record<string, number>;
    if (categoryMultipliers && categoryMultipliers[value]) {
      totalMultiplier *= categoryMultipliers[value];
    }
  });
  
  return totalMultiplier;
}

// Calculate environmental multiplier from random factors
export function calculateEnvironmentalMultiplier(factors: EnvironmentalFactors): number {
  let totalMultiplier = 1.0;
  
  totalMultiplier *= ENVIRONMENTAL_MULTIPLIERS.weather[factors.weather];
  totalMultiplier *= ENVIRONMENTAL_MULTIPLIERS.pitchConditions[factors.pitchConditions];
  totalMultiplier *= ENVIRONMENTAL_MULTIPLIERS.matchAtmosphere[factors.matchAtmosphere];
  totalMultiplier *= ENVIRONMENTAL_MULTIPLIERS.matchImportance[factors.matchImportance];
  
  return totalMultiplier;
}

// Calculate efficiency bonus based on player's historical performance
export function calculateEfficiencyBonus(efficiency: number): number {
  // Efficiency bonus: 0.8 to 1.2 range based on performance
  if (efficiency === 0) return 1.0; // New player
  return Math.max(0.8, Math.min(1.2, 0.8 + (efficiency * 0.4)));
}

// Generate Poisson random number
function poissonRandom(lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1.0;
  
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  
  return k - 1;
}

// Simulate a match
export function simulateMatch(
  choices: StrategyChoices,
  playerEfficiency: number = 0
): MatchResult {
  // Generate random environmental factors
  const environmentalFactors = generateEnvironmentalFactors();
  
  // Calculate multipliers
  const strategyMultiplier = calculateStrategyMultiplier(choices);
  const environmentalMultiplier = calculateEnvironmentalMultiplier(environmentalFactors);
  const efficiencyBonus = calculateEfficiencyBonus(playerEfficiency);
  
  // Final lambda calculation
  const finalLambda = BASE_LAMBDA * strategyMultiplier * environmentalMultiplier * efficiencyBonus;
  
  // Simulate goals using Poisson distribution
  const goalsScored = poissonRandom(finalLambda);
  
  // Generate match ID
  const matchId = `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    goalsScored,
    lambda: finalLambda,
    strategyChoices: choices,
    environmentalFactors,
    strategyMultiplier,
    environmentalMultiplier,
    timestamp: Date.now(),
    matchId,
  };
}

// Get strategy multipliers for display
export function getStrategyMultipliers(choices: StrategyChoices): StrategyMultipliers {
  const multipliers: StrategyMultipliers = {} as StrategyMultipliers;
  
  Object.entries(choices).forEach(([category, value]) => {
    const categoryKey = category as keyof StrategyChoices;
    const categoryMultipliers = STRATEGY_MULTIPLIERS[categoryKey] as Record<string, number>;
    if (categoryMultipliers && categoryMultipliers[value]) {
      (multipliers as unknown as Record<string, number>)[categoryKey] = categoryMultipliers[value];
    }
  });
  
  return multipliers;
}

// Get environmental multipliers for display
export function getEnvironmentalMultipliers(factors: EnvironmentalFactors): EnvironmentalMultipliers {
  return {
    weather: ENVIRONMENTAL_MULTIPLIERS.weather[factors.weather],
    pitchConditions: ENVIRONMENTAL_MULTIPLIERS.pitchConditions[factors.pitchConditions],
    matchAtmosphere: ENVIRONMENTAL_MULTIPLIERS.matchAtmosphere[factors.matchAtmosphere],
    matchImportance: ENVIRONMENTAL_MULTIPLIERS.matchImportance[factors.matchImportance],
  };
}

// Get strategy descriptions
export function getStrategyDescription(choice: string, category: StrategicCategory): string {
  const descriptions: Record<StrategicCategory, Record<string, string>> = {
    formation: {
      '4-3-3': 'Classic attacking setup with wide forwards',
      '4-4-2': 'Traditional balanced approach with twin strikers',
      '3-5-2': 'Wing-backs provide width, compact middle',
      '4-2-3-1': 'Single striker with attacking midfield support',
      '5-3-2': 'Defensive solidity, counter-attack ready',
      '3-4-3': 'Aggressive, high attacking line',
    },
    defensivePhilosophy: {
      'High Press': 'Aggressive pressing in opponent\'s half',
      'Gegenpressing': 'Immediate counter-press after losing ball',
      'Mid Block': 'Compact defensive shape in middle third',
      'Low Block': 'Deep defensive line, absorb pressure',
      'Counter-Attack': 'Sit deep, hit on quick transitions',
      'Offside Trap': 'High line with coordinated stepping up',
    },
    trainingFocus: {
      'Set Pieces': 'Focus on corners, free kicks, penalties',
      'Finishing Practice': 'Shooting accuracy and power training',
      'Movement Drills': 'Practice runs, positioning, timing',
      'Team Shape': 'Work on positional play and coordination',
      'Individual Skills': 'Focus on 1v1 situations and technical work',
      'Physical Prep': 'Fitness, sprint work, and strength training',
    },
    attackingApproach: {
      'Wing Play': 'Use crosses and wide attacks',
      'Through the Middle': 'Central penetration and passing',
      'Long Balls': 'Direct balls to striker',
      'Build-Up Play': 'Patient possession-based attacks',
      'Quick Transitions': 'Fast counter-attacks',
      'Individual Brilliance': 'Give your best players freedom',
    },
    strikerRole: {
      'Target Man': 'Hold up play, bring others into game',
      'Poacher': 'Stay in box, focus purely on finishing',
      'False 9': 'Drop deep, create space for others',
      'Wide Forward': 'Drift wide, cut inside to shoot',
      'Deep Striker': 'Link play, create as well as score',
      'Penalty Box Predator': 'Attack crosses and rebounds',
    },
    tempoStyle: {
      'High Tempo': 'Quick passing, constant movement',
      'Controlled Pace': 'Dictate rhythm, vary speed',
      'Patient Build-Up': 'Slow, methodical progression',
      'Direct Style': 'Get ball forward quickly',
      'Reactive Play': 'Adapt to opponent\'s tempo',
      'Chaos Ball': 'High energy, unpredictable attacks',
    },
    matchMentality: {
      'Aggressive': 'Take risks, force the action',
      'Confident': 'Believe in abilities, play natural game',
      'Cautious': 'Avoid mistakes, build confidence gradually',
      'Desperate': 'Throw everything forward, all-or-nothing',
      'Clinical': 'Stay composed, take chances when they come',
      'Expressive': 'Play with flair and creativity',
    },
  };
  
  return descriptions[category]?.[choice] || 'No description available';
}

// Get environmental factor descriptions
export function getEnvironmentalDescription(choice: string, category: keyof EnvironmentalFactors): string {
  const descriptions: Record<keyof EnvironmentalFactors, Record<string, string>> = {
    weather: {
      'Perfect Day': 'Sunny, mild temperature, no wind - ideal conditions',
      'Light Rain': 'Slippery surface affects passing and ball control',
      'Heavy Rain': 'Difficult ball control, favors direct play',
      'Strong Wind': 'Affects long passes and shooting accuracy',
      'Cold Weather': 'Players need time to warm up, affects performance',
      'Extreme Heat': 'Fatigue sets in faster, endurance matters more',
    },
    pitchConditions: {
      'Perfect Grass': 'Pristine natural surface, optimal for all play styles',
      'Worn Grass': 'Patches and divots affect ball roll and bounce',
      'Artificial Turf': 'Consistent but fast surface, favors quick play',
      'Muddy Pitch': 'Heavy, slow conditions favor physical play',
      'Dry/Hard Pitch': 'Ball bounces more, favors technical players',
      'Newly Laid Grass': 'Soft surface with unpredictable bounces',
    },
    matchAtmosphere: {
      'Home + Electric Crowd': 'Maximum support, intimidating for opponents',
      'Home + Supportive Crowd': 'Good backing from home fans',
      'Home + Quiet Crowd': 'Neutral atmosphere at home stadium',
      'Away + Hostile Crowd': 'Intimidating away environment',
      'Away + Neutral Crowd': 'Standard away match difficulty',
      'Away + Friendly Crowd': 'Welcoming or mixed support away',
    },
    matchImportance: {
      'Cup Final': 'Big stage brings out the best in players',
      'Derby Match': 'Extra motivation against local rivals',
      'Regular League': 'Standard match pressure and motivation',
      'End of Season': 'Some players already on vacation mode',
      'Relegation Battle': 'Desperation brings extra intensity',
      'Dead Rubber': 'Nothing to play for, low motivation',
    },
  };
  
  return descriptions[category]?.[choice] || 'No description available';
}
