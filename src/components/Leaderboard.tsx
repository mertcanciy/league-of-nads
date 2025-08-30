"use client";

import { LeaderboardEntry } from '@/types/game';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserAddress?: string;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export default function Leaderboard({ entries, currentUserAddress, isLoading = false, onRefresh }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 1.5) return 'text-green-300';
    if (efficiency >= 1.0) return 'text-purple-300';
    if (efficiency >= 0.5) return 'text-yellow-300';
    return 'text-red-300';
  };

  const getEfficiencyGlow = (efficiency: number) => {
    if (efficiency >= 1.5) return 'bg-green-600/30';
    if (efficiency >= 1.0) return 'bg-purple-600/30';
    if (efficiency >= 0.5) return 'bg-yellow-600/30';
    return 'bg-red-600/30';
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'text-yellow-300 text-2xl animate-pulse';
    if (rank === 2) return 'text-gray-300 text-xl';
    if (rank === 3) return 'text-orange-300 text-xl';
    return 'text-purple-300 font-bold';
  };

  return (
    <div className="anime-card p-10 max-w-6xl mx-auto anime-glow">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-5xl font-bold anime-title mb-4">🏆 Global Leaderboard 🏆</h2>
          <p className="text-xl anime-subtitle">Elite managers competing for football supremacy</p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="anime-button px-6 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center space-x-2"
          >
            <span>🔄</span>
            <span>{isLoading ? 'Updating...' : 'Refresh'}</span>
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="relative">
            <div className="w-16 h-16 anime-glow rounded-full mx-auto flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
            </div>
            <p className="anime-subtitle text-xl mt-4">Loading Epic Rankings...</p>
            <div className="mt-4 flex justify-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center relative">
            <div className="w-full h-full anime-glow-accent rounded-full flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-full"></div>
              <span className="relative text-white text-4xl animate-pulse">🏆</span>
            </div>
            {/* Energy rings */}
            <div className="absolute -inset-2 rounded-full border-2 border-yellow-400/50 animate-spin" style={{animationDuration: '3s'}}></div>
            <div className="absolute -inset-4 rounded-full border border-orange-300/30 animate-ping" style={{animationDuration: '2s'}}></div>
          </div>
          <h3 className="text-3xl font-bold anime-title mb-4">🌟 No Champions Yet 🌟</h3>
          <p className="text-xl anime-subtitle">Be the first legendary manager to claim the throne!</p>
          <div className="mt-6 anime-card p-6 bg-purple-800/20">
            <p className="text-purple-200 font-medium">
              🚀 Start your journey and etch your name in football history!
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto anime-card bg-purple-900/20">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-purple-500/50 bg-gradient-to-r from-purple-800/30 to-violet-800/30">
                <th className="text-left py-6 px-6 font-bold text-purple-200 text-lg">
                  <span className="flex items-center">
                    <span className="mr-2">🏅</span>
                    Rank
                  </span>
                </th>
                <th className="text-left py-6 px-6 font-bold text-purple-200 text-lg">
                  <span className="flex items-center">
                    <span className="mr-2">👑</span>
                    Manager
                  </span>
                </th>
                <th className="text-right py-6 px-6 font-bold text-purple-200 text-lg">
                  <span className="flex items-center justify-end">
                    <span className="mr-2">⚽</span>
                    Goals
                  </span>
                </th>
                <th className="text-right py-6 px-6 font-bold text-purple-200 text-lg">
                  <span className="flex items-center justify-end">
                    <span className="mr-2">🏟️</span>
                    Matches
                  </span>
                </th>
                <th className="text-right py-6 px-6 font-bold text-purple-200 text-lg">
                  <span className="flex items-center justify-end">
                    <span className="mr-2">⚡</span>
                    Rating
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr
                  key={entry.walletAddress}
                  className={`border-b border-purple-500/20 hover:bg-purple-700/20 transition-all duration-300 ${
                    currentUserAddress?.toLowerCase() === entry.walletAddress.toLowerCase()
                      ? 'bg-gradient-to-r from-purple-600/30 to-violet-600/30 border-purple-400/50 anime-glow-accent'
                      : 'hover:anime-glow-accent'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <td className="py-6 px-6">
                    <div className="flex items-center space-x-3">
                      <span className={getRankStyle(entry.rank)}>{getRankIcon(entry.rank)}</span>
                      {currentUserAddress?.toLowerCase() === entry.walletAddress.toLowerCase() && (
                        <span className="text-xs bg-purple-600 text-purple-100 px-3 py-1 rounded-full font-bold anime-glow-accent">
                          ✨ YOU ✨
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <div className="space-y-1">
                      <div className="font-bold text-lg text-purple-100">{entry.username}</div>
                      <div className="text-xs text-purple-400 font-mono bg-purple-800/30 px-2 py-1 rounded">
                        {entry.walletAddress.slice(0, 6)}...{entry.walletAddress.slice(-4)}
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-6 text-right">
                    <span className="font-bold text-2xl text-blue-300 bg-blue-600/30 px-3 py-1 rounded-lg">
                      {entry.totalGoals}
                    </span>
                  </td>
                  <td className="py-6 px-6 text-right">
                    <span className="font-bold text-lg text-green-300 bg-green-600/30 px-3 py-1 rounded-lg">
                      {entry.totalMatches}
                    </span>
                  </td>
                  <td className="py-6 px-6 text-right">
                    <span className={`font-bold text-lg px-4 py-2 rounded-lg ${getEfficiencyGlow(entry.efficiency)} ${getEfficiencyColor(entry.efficiency)}`}>
                      {entry.efficiency.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-10 text-center">
        <div className="anime-card p-6 bg-gradient-to-r from-indigo-900/40 to-purple-900/40">
          <h4 className="text-lg font-bold anime-subtitle mb-3 flex items-center justify-center">
            <span className="mr-2">📚</span>
            How Rankings Work
            <span className="ml-2">📚</span>
          </h4>
          <div className="space-y-2">
            <p className="text-purple-200 font-medium">
              <span className="text-yellow-300">⚡ Efficiency Rating</span> = Goals ÷ Matches Played
            </p>
            <p className="text-purple-300 text-sm">
              Higher efficiency means superior goal-scoring mastery! Climb the ranks by perfecting your tactical genius! 🏆
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
