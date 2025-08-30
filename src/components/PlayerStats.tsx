"use client";

import { PlayerStats as PlayerStatsType } from '@/types/game';

interface PlayerStatsProps {
  stats: PlayerStatsType | null;
  isLoading?: boolean;
}

export default function PlayerStats({ stats, isLoading = false }: PlayerStatsProps) {
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

  const getEfficiencyLabel = (efficiency: number) => {
    if (efficiency >= 1.5) return 'Elite';
    if (efficiency >= 1.0) return 'Good';
    if (efficiency >= 0.5) return 'Average';
    return 'Poor';
  };

  if (isLoading) {
    return (
      <div className="anime-card p-8 max-w-5xl mx-auto anime-glow">
        <div className="flex justify-center items-center py-12">
          <div className="relative">
            <div className="w-16 h-16 anime-glow rounded-full mx-auto flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
            </div>
            <p className="anime-subtitle text-xl mt-4">Loading Your Epic Stats...</p>
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

  if (!stats) {
    return (
      <div className="anime-card p-10 max-w-5xl mx-auto text-center anime-glow">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center relative">
            <div className="w-full h-full anime-glow-accent rounded-full flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-full"></div>
              <span className="relative text-white text-4xl animate-pulse">📊</span>
            </div>
          </div>
          <h2 className="text-4xl font-bold anime-title mb-4">⚡ No Stats Yet ⚡</h2>
          <p className="text-xl anime-subtitle">Play your first epic match to unlock your legendary statistics!</p>
        </div>
        
        <div className="anime-card p-6 bg-purple-800/20">
          <p className="text-purple-200 font-medium">
            🎯 Your journey begins with a single match. Choose your strategy and make history!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="anime-card p-10 max-w-6xl mx-auto anime-glow">
      <div className="text-center mb-10">
        <h2 className="text-5xl font-bold anime-title mb-4 flex items-center justify-center">
          <img src="/brain-monad.png" alt="Brain Monad" className="w-24 h-24 mr-4" />
          Your Epic Statistics
          <img src="/brain-monad.png" alt="Brain Monad" className="w-24 h-24 ml-4" />
        </h2>
        <p className="text-xl anime-subtitle">Performance overview of your legendary football management career</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="anime-card p-8 text-center hover:anime-glow-accent transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-400"></div>
          <div className="text-5xl font-bold text-blue-300 mb-4 anime-float">{stats.totalGoals}</div>
          <div className="text-lg text-blue-200 font-bold mb-2">⚽ Total Goals</div>
          <div className="text-sm text-purple-300">Legendary strikes that made history!</div>
        </div>
        
        <div className="anime-card p-8 text-center hover:anime-glow-accent transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-400"></div>
          <div className="text-5xl font-bold text-green-300 mb-4 anime-float" style={{animationDelay: '0.5s'}}>{stats.totalMatches}</div>
          <div className="text-lg text-green-200 font-bold mb-2">🏟️ Matches Played</div>
          <div className="text-sm text-purple-300">Epic battles on the field!</div>
        </div>
        
        <div className="anime-card p-8 text-center hover:anime-glow-accent transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-400"></div>
          <div className={`text-5xl font-bold mb-4 anime-float ${getEfficiencyColor(stats.efficiency)}`} style={{animationDelay: '1s'}}>
            {stats.efficiency.toFixed(2)}
          </div>
          <div className="text-lg text-purple-200 font-bold mb-2">⚡ Efficiency Rating</div>
          <div className={`text-sm font-bold px-3 py-1 rounded-lg ${getEfficiencyGlow(stats.efficiency)}`}>
            {getEfficiencyLabel(stats.efficiency)} Manager
          </div>
        </div>
      </div>

      <div className="anime-card p-8 mb-8">
        <h3 className="text-2xl font-bold anime-subtitle mb-6 flex items-center">
          <span className="mr-3">📈</span>
          Performance Analysis
        </h3>
        <div className="space-y-6">
          <div className="flex justify-between items-center anime-card p-4 bg-purple-800/20">
            <span className="text-purple-200 font-medium flex items-center">
              <span className="mr-2">🎯</span>
              Efficiency Rating:
            </span>
            <span className={`font-bold text-lg px-4 py-2 rounded-lg ${getEfficiencyGlow(stats.efficiency)} ${getEfficiencyColor(stats.efficiency)}`}>
              {getEfficiencyLabel(stats.efficiency)}
            </span>
          </div>
          
          <div className="flex justify-between items-center anime-card p-4 bg-purple-800/20">
            <span className="text-purple-200 font-medium flex items-center">
              <span className="mr-2">⚽</span>
              Goals per Match:
            </span>
            <span className="font-bold text-lg text-blue-300 bg-blue-600/30 px-4 py-2 rounded-lg">
              {stats.totalMatches > 0 ? (stats.totalGoals / stats.totalMatches).toFixed(2) : '0.00'}
            </span>
          </div>
          
          <div className="flex justify-between items-center anime-card p-4 bg-purple-800/20">
            <span className="text-purple-200 font-medium flex items-center">
              <span className="mr-2">🏆</span>
              Total Experience:
            </span>
            <span className="font-bold text-lg text-green-300 bg-green-600/30 px-4 py-2 rounded-lg">
              {stats.totalMatches} match{stats.totalMatches !== 1 ? 'es' : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="anime-card p-8 bg-gradient-to-br from-indigo-900/40 to-purple-900/40">
        <h3 className="text-2xl font-bold anime-subtitle mb-6 flex items-center">
          <span className="mr-3">💡</span>
          Tips for Legendary Management
        </h3>
        <div className="space-y-4">
          {stats.efficiency < 1.0 && (
            <div className="flex items-start space-x-3 anime-card p-4 bg-yellow-600/20 border-l-4 border-yellow-400">
              <span className="text-yellow-300 text-lg">⚡</span>
              <p className="text-yellow-100 font-medium">Try different formations and play styles to discover your signature tactics!</p>
            </div>
          )}
          {stats.totalMatches < 5 && (
            <div className="flex items-start space-x-3 anime-card p-4 bg-blue-600/20 border-l-4 border-blue-400">
              <span className="text-blue-300 text-lg">🎯</span>
              <p className="text-blue-100 font-medium">Play more epic matches to master the art of football management!</p>
            </div>
          )}
          <div className="flex items-start space-x-3 anime-card p-4 bg-green-600/20 border-l-4 border-green-400">
            <span className="text-green-300 text-lg">🔬</span>
            <p className="text-green-100 font-medium">Experiment with training focuses and motivation speeches for optimal team performance!</p>
          </div>
          <div className="flex items-start space-x-3 anime-card p-4 bg-purple-600/20 border-l-4 border-purple-400">
            <span className="text-purple-300 text-lg">🌤️</span>
            <p className="text-purple-100 font-medium">Adapt your strategy to weather conditions and field types for maximum advantage!</p>
          </div>
          <div className="flex items-start space-x-3 anime-card p-4 bg-pink-600/20 border-l-4 border-pink-400">
            <span className="text-pink-300 text-lg">✨</span>
            <p className="text-pink-100 font-medium">Deploy special cards strategically in crucial moments to turn the tide!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
