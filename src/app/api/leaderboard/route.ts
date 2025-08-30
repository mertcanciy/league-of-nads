import { NextRequest, NextResponse } from 'next/server';
import { publicClient } from '@/lib/blockchain';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/blockchain';
import { LeaderboardEntry } from '@/types/game';
import fs from 'fs';
import path from 'path';

// Helper function to get username for a wallet address
async function fetchUsername(walletAddress: string): Promise<string> {
  try {
    // Add timeout and better error handling for the external API call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`https://monad-games-id-site.vercel.app/api/check-wallet?wallet=${walletAddress}`, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      if (data.hasUsername && data.user && data.user.username) {
        return data.user.username;
      }
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('Username fetch timed out for', walletAddress);
    } else {
      console.warn('Failed to fetch username for', walletAddress, error);
    }
  }
  
  // Generate a more user-friendly fallback name
  return `Player_${walletAddress.slice(2, 8)}`;
}

// Helper function to get tracked players
function getTrackedPlayers(): string[] {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const playersFile = path.join(dataDir, 'players.json');
    
    if (fs.existsSync(playersFile)) {
      const data = fs.readFileSync(playersFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading tracked players:', error);
  }
  return [];
}

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching real leaderboard data...');
    
    // Get current user info from query params
    const { searchParams } = new URL(request.url);
    const currentUserAddress = searchParams.get('currentUserAddress');
    const currentUsername = searchParams.get('currentUsername');
    
    // Get all tracked players
    const trackedPlayers = getTrackedPlayers();
    console.log('Tracked players:', trackedPlayers);
    
    if (trackedPlayers.length === 0) {
      console.log('No tracked players found, returning empty leaderboard');
      return NextResponse.json({
        success: true,
        leaderboard: []
      });
    }
    
    // Fetch data for each player from the blockchain
    const playerDataPromises = trackedPlayers.map(async (playerAddress) => {
      try {
        // Get total score and transactions from contract
        const [totalScore, totalTransactions] = await Promise.all([
          publicClient.readContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: CONTRACT_ABI,
            functionName: 'totalScoreOfPlayer',
            args: [playerAddress as `0x${string}`]
          }),
          publicClient.readContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: CONTRACT_ABI,
            functionName: 'totalTransactionsOfPlayer',
            args: [playerAddress as `0x${string}`]
          })
        ]);
        
        const totalGoals = Number(totalScore);
        const totalMatches = Number(totalTransactions);
        const efficiency = totalMatches > 0 ? totalGoals / totalMatches : 0;
        
        // Get username - prioritize current user's known username
        let username: string;
        if (currentUserAddress && currentUsername && 
            playerAddress.toLowerCase() === currentUserAddress.toLowerCase()) {
          username = currentUsername;
        } else {
          username = await fetchUsername(playerAddress);
        }
        
        return {
          walletAddress: playerAddress,
          username,
          totalGoals,
          totalMatches,
          efficiency
        };
      } catch (error) {
        console.error(`Error fetching data for player ${playerAddress}:`, error);
        return null;
      }
    });
    
    // Wait for all player data to be fetched
    const playerDataResults = await Promise.all(playerDataPromises);
    
    // Filter out failed requests and players with no activity
    const validPlayerData = playerDataResults
      .filter((data): data is NonNullable<typeof data> => data !== null && data.totalMatches > 0)
      .sort((a, b) => {
        // Sort by efficiency first (descending), then by total goals (descending)
        if (b.efficiency !== a.efficiency) {
          return b.efficiency - a.efficiency;
        }
        return b.totalGoals - a.totalGoals;
      });
    
    // Add rank to each entry
    const leaderboard: LeaderboardEntry[] = validPlayerData.map((data, index) => ({
      rank: index + 1,
      username: data.username,
      walletAddress: data.walletAddress,
      totalGoals: data.totalGoals,
      totalMatches: data.totalMatches,
      efficiency: data.efficiency
    }));
    
    console.log(`Successfully generated leaderboard with ${leaderboard.length} entries`);
    
    return NextResponse.json({
      success: true,
      leaderboard
    });
    
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard data' },
      { status: 500 }
    );
  }
}
