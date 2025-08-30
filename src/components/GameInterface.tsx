"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { gameStateManager, GameState } from '@/lib/gameState';
import { StrategyChoices } from '@/types/game';
import LoginScreen from './LoginScreen';
import StrategyForm from './StrategyForm';
import MatchResult from './MatchResult';
import MatchSimulation from './MatchSimulation';
import Leaderboard from './Leaderboard';
import PlayerStats from './PlayerStats';
import MonadGamesIDSetup from './MonadGamesIDSetup';

type GameView = 'strategy' | 'simulation' | 'result' | 'leaderboard' | 'stats';

export default function GameInterface() {
  const { authenticated, user, ready, logout } = useAuth();
  const [gameState, setGameState] = useState<GameState>(gameStateManager.getState());
  const [currentView, setCurrentView] = useState<GameView>('strategy');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  const [lastStrategyChoices, setLastStrategyChoices] = useState<StrategyChoices | null>(null);

  // Subscribe to game state changes
  useEffect(() => {
    const unsubscribe = gameStateManager.subscribe(setGameState);
    return unsubscribe;
  }, []);

  // Load player stats when user is authenticated
  useEffect(() => {
    if (authenticated && user) {
      gameStateManager.loadPlayerStats(user.walletAddress, user.username);
    }
  }, [authenticated, user]);

  // Load leaderboard data
  const loadLeaderboard = async () => {
    setIsLoadingLeaderboard(true);
    try {
      // Pass current user info to help with username resolution
      const url = new URL('/api/leaderboard', window.location.origin);
      if (user?.walletAddress && user?.username) {
        url.searchParams.set('currentUserAddress', user.walletAddress);
        url.searchParams.set('currentUsername', user.username);
      }
      
      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        setLeaderboardData(data.leaderboard);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };

  // Handle strategy form submission
  const handleStrategySubmit = async (choices: StrategyChoices) => {
    if (!user) return;
    
    try {
      setLastStrategyChoices(choices);
      await gameStateManager.playMatch(choices, user.walletAddress);
      setCurrentView('simulation');
    } catch (error) {
      console.error('Error playing match:', error);
    }
  };

  // Handle play again
  const handlePlayAgain = () => {
    gameStateManager.clearMatch();
    setLastStrategyChoices(null);
    setCurrentView('strategy');
  };

  // Handle simulation complete
  const handleSimulationComplete = () => {
    setCurrentView('result');
  };

  // Handle view leaderboard
  const handleViewLeaderboard = () => {
    loadLeaderboard();
    setCurrentView('leaderboard');
  };

  // Handle view stats
  const handleViewStats = () => {
    setCurrentView('stats');
  };

  // Handle back to game
  const handleBackToGame = () => {
    setCurrentView('strategy');
  };

  // Show loading screen while Privy is initializing
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 anime-glow rounded-full mx-auto mb-6 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
            </div>
            <p className="anime-subtitle text-xl">Loading League Of Nads...</p>
            <div className="mt-4 flex justify-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!authenticated) {
    return <LoginScreen />;
  }

  // Show Monad Games ID setup if user needs linking or username
  if (user && (user.needsLinking || user.needsUsername)) {
    return <MonadGamesIDSetup user={user} onRetry={() => {
      console.log('Retrying user authentication...');
      window.location.reload();
    }} />;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="anime-card border-b border-purple-500/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold anime-title">League Of Nads</h1>
              <span className="ml-3 text-2xl animate-bounce">⚽</span>
            </div>
            
            <div className="flex items-center space-x-6">
              {user && (
                <div className="flex items-center space-x-3 anime-card px-4 py-2 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{user.username?.[0]?.toUpperCase()}</span>
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-semibold text-purple-200">{user.username}</span>
                    <div className="text-xs text-gray-400 font-mono">
                      {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex space-x-3">
                <button
                  onClick={handleViewStats}
                  className="px-4 py-2 text-sm font-medium anime-button rounded-lg transition-all duration-300"
                >
                Your Stats
                </button>
                <button
                  onClick={handleViewLeaderboard}
                  className="px-4 py-2 text-sm font-medium anime-button rounded-lg transition-all duration-300"
                >
                Leaderboard
                </button>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {gameState.error && (
          <div className="mb-6 anime-card border-red-400/50 bg-gradient-to-r from-red-900/30 to-pink-900/20">
            <div className="flex items-center p-4">
              <div className="flex-shrink-0">
                <span className="text-2xl animate-pulse">⚠️</span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-red-200 font-medium">{gameState.error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => gameStateManager.clearError()}
                  className="text-red-300 hover:text-red-100 text-xl font-bold transition-colors duration-200"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Game Views */}
        {currentView === 'strategy' && (
          <StrategyForm 
            onSubmit={handleStrategySubmit}
            isLoading={gameState.isLoading}
          />
        )}

        {currentView === 'simulation' && gameState.currentMatch && lastStrategyChoices && (
          <MatchSimulation
            strategyChoices={lastStrategyChoices}
            matchResult={gameState.currentMatch}
            onSimulationComplete={handleSimulationComplete}
          />
        )}

        {currentView === 'result' && gameState.currentMatch && (
          <MatchResult
            result={gameState.currentMatch}
            onPlayAgain={handlePlayAgain}
            onViewLeaderboard={handleViewLeaderboard}
          />
        )}

        {currentView === 'leaderboard' && (
          <div>
            <div className="mb-6">
              <button
                onClick={handleBackToGame}
                className="anime-button px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                ← Back to Game
              </button>
            </div>
            <Leaderboard
              entries={leaderboardData}
              currentUserAddress={user?.walletAddress}
              isLoading={isLoadingLeaderboard}
              onRefresh={loadLeaderboard}
            />
          </div>
        )}

        {currentView === 'stats' && (
          <div>
            <div className="mb-6">
              <button
                onClick={handleBackToGame}
                className="anime-button px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                ← Back to Game
              </button>
            </div>
            <PlayerStats
              stats={gameState.playerStats}
              isLoading={gameState.isLoading}
            />
          </div>
        )}
      </main>
    </div>
  );
}
