import { PlayerStats, MatchResult, StrategyChoices } from '@/types/game';
import { getPlayerTotalData, getPlayerGameData, submitScore } from './score-api';
import { simulateMatch } from './gameEngine';
import { GAME_CONFIG } from './game-config';

export interface GameState {
  playerStats: PlayerStats | null;
  currentMatch: MatchResult | null;
  isLoading: boolean;
  error: string | null;
}

export class GameStateManager {
  private state: GameState = {
    playerStats: null,
    currentMatch: null,
    isLoading: false,
    error: null,
  };

  private listeners: ((state: GameState) => void)[] = [];

  // Subscribe to state changes
  subscribe(listener: (state: GameState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners of state change
  private notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Update state
  private setState(updates: Partial<GameState>) {
    this.state = { ...this.state, ...updates };
    this.notify();
  }

  // Load player stats from blockchain
  async loadPlayerStats(walletAddress: string, username?: string) {
    this.setState({ isLoading: true, error: null });

    // Don't try to load stats if wallet address is not available
    if (!walletAddress || walletAddress === '') {
      this.setState({ 
        playerStats: null, 
        isLoading: false 
      });
      return;
    }

    try {
      // Get total data across all games
      const totalData = await getPlayerTotalData(walletAddress);
      
      const totalGoals = parseInt(totalData.totalScore);
      const totalMatches = parseInt(totalData.totalTransactions);
      const efficiency = totalMatches > 0 ? totalGoals / totalMatches : 0;

      let gameGoals = 0;
      let gameMatches = 0;

      // Try to get game-specific data if game address is configured
      try {
        const gameData = await getPlayerGameData(walletAddress, GAME_CONFIG.GAME_ADDRESS);
        gameGoals = parseInt(gameData.score);
        gameMatches = parseInt(gameData.transactions);
      } catch (gameError) {
        console.warn('Could not load game-specific data:', gameError);
        // Continue without game-specific data
      }

      const playerStats: PlayerStats = {
        totalGoals,
        totalMatches,
        efficiency,
        username,
        walletAddress,
        gameGoals,
        gameMatches,
      };

      this.setState({ playerStats, isLoading: false });
    } catch (error) {
      console.error('Error loading player stats:', error);
      this.setState({ 
        error: 'Failed to load player stats', 
        isLoading: false 
      });
    }
  }

  // Simulate a match
  async playMatch(strategyChoices: StrategyChoices, walletAddress: string) {
    this.setState({ isLoading: true, error: null });

    try {
      // Get current player efficiency for simulation
      const efficiency = this.state.playerStats?.efficiency || 0;
      
      // Simulate the match
      const matchResult = simulateMatch(strategyChoices, efficiency);
      this.setState({ currentMatch: matchResult });

      // Update player data on blockchain
      const result = await submitScore(walletAddress, matchResult.goalsScored, 1);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update player data on blockchain');
      }

      // Reload player stats
      await this.loadPlayerStats(walletAddress, this.state.playerStats?.username);

      this.setState({ isLoading: false });
      return matchResult;
    } catch (error) {
      console.error('Error playing match:', error);
      this.setState({ 
        error: 'Failed to complete match', 
        isLoading: false 
      });
      throw error;
    }
  }

  // Clear current match
  clearMatch() {
    this.setState({ currentMatch: null });
  }

  // Get current state
  getState(): GameState {
    return this.state;
  }

  // Clear error
  clearError() {
    this.setState({ error: null });
  }
}

// Create a singleton instance
export const gameStateManager = new GameStateManager();
