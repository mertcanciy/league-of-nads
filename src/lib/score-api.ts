import { GAME_CONFIG } from './game-config';

// API endpoints
const API_BASE = '/api';

// Fetch player total data (across all games)
export async function getPlayerTotalData(playerAddress: string) {
  if (!playerAddress || playerAddress === '') {
    throw new Error('Player address is required');
  }

  const response = await fetch(`${API_BASE}/get-player-data?address=${playerAddress}`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch player total data: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch player total data');
  }
  
  return {
    totalScore: data.totalScore,
    totalTransactions: data.totalTransactions,
  };
}

// Fetch player data for this specific game
export async function getPlayerGameData(playerAddress: string, gameAddress: string) {
  if (!playerAddress || playerAddress === '') {
    throw new Error('Player address is required');
  }

  if (!gameAddress || gameAddress === '0x0000000000000000000000000000000000000000') {
    throw new Error('Game address is not configured');
  }

  const response = await fetch(
    `${API_BASE}/get-player-data-per-game?playerAddress=${playerAddress}&gameAddress=${gameAddress}`
  );
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch player game data: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch player game data');
  }
  
  return {
    score: data.score,
    transactions: data.transactions,
  };
}

// Submit score to blockchain
export async function submitScore(playerAddress: string, scoreAmount: number, transactionAmount: number) {
  console.log('Submitting score:', { playerAddress, scoreAmount, transactionAmount });
  
  try {
    const response = await fetch(`${API_BASE}/update-player-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerAddress,
        scoreAmount,
        transactionAmount,
      }),
    });
    
    console.log('API Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        console.error('API Error response:', errorData);
      } catch (parseError) {
        // If response is not JSON, get text
        const errorText = await response.text();
        console.error('API Error (non-JSON):', errorText);
        throw new Error(`API returned ${response.status}: ${errorText.substring(0, 200)}`);
      }
      throw new Error(errorData.error || `Failed to submit score: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('API Success response:', data);
    
    if (!data.success) {
      console.error('API returned success=false:', data);
      throw new Error(data.error || 'Failed to submit score');
    }
    
    return {
      success: true,
      transactionHash: data.transactionHash,
      message: data.message,
      error: undefined,
    };
  } catch (error) {
    console.error('submitScore error:', error);
    throw error;
  }
}

// Score submission manager for batching and managing score submissions
export class ScoreSubmissionManager {
  private playerAddress: string;
  private pendingScore: number = 0;
  private pendingTransactions: number = 0;
  private isSubmitting: boolean = false;
  private submitTimeout: NodeJS.Timeout | null = null;
  private submitDelay: number = 2000; // 2 seconds delay before submitting

  constructor(playerAddress: string) {
    this.playerAddress = playerAddress;
  }

  // Add score to pending submission
  addScore(score: number) {
    this.pendingScore += score;
    this.scheduleSubmission();
  }

  // Add transaction to pending submission
  addTransaction(transactions: number) {
    this.pendingTransactions += transactions;
    this.scheduleSubmission();
  }

  // Schedule submission with delay
  private scheduleSubmission() {
    if (this.submitTimeout) {
      clearTimeout(this.submitTimeout);
    }

    this.submitTimeout = setTimeout(() => {
      this.submitPending();
    }, this.submitDelay);
  }

  // Submit pending score and transactions
  private async submitPending() {
    if (this.isSubmitting || (this.pendingScore === 0 && this.pendingTransactions === 0)) {
      return;
    }

    this.isSubmitting = true;

    try {
      await submitScore(this.playerAddress, this.pendingScore, this.pendingTransactions);
      
      // Reset pending values after successful submission
      this.pendingScore = 0;
      this.pendingTransactions = 0;
      
      console.log('Score submitted successfully:', {
        score: this.pendingScore,
        transactions: this.pendingTransactions,
      });
    } catch (error) {
      console.error('Failed to submit score:', error);
      // Could implement retry logic here
    } finally {
      this.isSubmitting = false;
    }
  }

  // Submit immediately (for game end)
  async submitImmediately() {
    if (this.submitTimeout) {
      clearTimeout(this.submitTimeout);
      this.submitTimeout = null;
    }

    if (this.pendingScore === 0 && this.pendingTransactions === 0) {
      return { success: true, message: 'No pending score to submit' };
    }

    try {
      const result = await submitScore(this.playerAddress, this.pendingScore, this.pendingTransactions);
      
      // Reset pending values
      this.pendingScore = 0;
      this.pendingTransactions = 0;
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Get current pending values
  getPending() {
    return {
      score: this.pendingScore,
      transactions: this.pendingTransactions,
    };
  }

  // Clean up resources
  destroy() {
    if (this.submitTimeout) {
      clearTimeout(this.submitTimeout);
      this.submitTimeout = null;
    }
  }
}
