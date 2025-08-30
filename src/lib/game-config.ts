// Game configuration for League Of Nads
export const GAME_CONFIG = {
  // Game wallet address (the address that will submit scores to the contract)
  GAME_ADDRESS: process.env.NEXT_PUBLIC_GAME_WALLET_ADDRESS || '0x0000000000000000000000000000000000000000',
  
  // Game metadata
  METADATA: {
    name: 'League Of Nads',
    description: 'A mini football manager game that integrates with Monad Games ID',
    image: 'https://forward-race.vercel.app/logo.png',
    url: 'https://forward-race.vercel.app',
  },
  
  // Game settings
  SETTINGS: {
    baseGoalRate: 0.5, // Base lambda for Poisson distribution
    maxGoalsPerMatch: 5, // Maximum goals that can be scored in one match
    efficiencyBonusRange: [0.8, 1.2], // Min/max efficiency bonus multiplier
  },
  
  // Game features
  FEATURES: {
    strategicCategories: 7,        // Total strategic categories available
    userControlledCategories: 4,   // Categories user can control
    environmentalFactors: 4,       // Random environmental factors
    balancedMultiplierRange: [0.8, 1.3], // Strategic multiplier range
    environmentalMultiplierRange: [0.85, 1.15], // Environmental multiplier range
  },
} as const;

// Helper function to get game address
export function getGameAddress(): string {
  if (!GAME_CONFIG.GAME_ADDRESS || GAME_CONFIG.GAME_ADDRESS === '0x0000000000000000000000000000000000000000') {
    throw new Error('GAME_ADDRESS not configured. Please set GAME_WALLET_ADDRESS in environment variables.');
  }
  return GAME_CONFIG.GAME_ADDRESS;
}
