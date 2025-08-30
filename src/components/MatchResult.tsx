"use client";

import type { MatchResult, StrategicCategory } from '@/types/game';
import { getStrategyMultipliers } from '@/lib/gameEngine';
import EnvironmentalFactorsDisplay from './EnvironmentalFactors';

interface MatchResultProps {
  result: MatchResult;
  onPlayAgain: () => void;
  onViewLeaderboard: () => void;
}

export default function MatchResult({ result, onPlayAgain, onViewLeaderboard }: MatchResultProps) {
  const strategyMultipliers = getStrategyMultipliers(result.strategyChoices);
  
  const getCategoryLabel = (category: StrategicCategory): string => {
    const labels: Record<StrategicCategory, string> = {
      formation: 'Formation',
      defensivePhilosophy: 'Defense',
      trainingFocus: 'Training',
      attackingApproach: 'Attack',
      strikerRole: 'Striker',
      tempoStyle: 'Tempo',
      matchMentality: 'Mentality',
    };
    return labels[category];
  };

  const getCategoryIcon = (category: StrategicCategory): string => {
    const icons: Record<StrategicCategory, string> = {
      formation: '⚡',
      defensivePhilosophy: '🛡️',
      trainingFocus: '💪',
      attackingApproach: '🎯',
      strikerRole: '⚽',
      tempoStyle: '⏱️',
      matchMentality: '🧠',
    };
    return icons[category];
  };

  const getGoalDisplay = (goals: number) => {
    if (goals === 0) return <img src="/molandak-sad.png" alt="Molandak Sad" className="w-32 h-32 mx-auto" />;
    if (goals === 1) return '⚽';
    if (goals === 2) return '⚽⚽';
    if (goals === 3) return '⚽⚽⚽';
    return '🔥';
  };

  const getPerformanceMessage = (goals: number) => {
    if (goals === 0) return 'Better luck next time!';
    if (goals === 1) return 'Solid performance!';
    if (goals === 2) return 'Excellent game!';
    if (goals === 3) return 'Outstanding performance!';
    return 'Incredible! You\'re on fire!';
  };

  return (
    <div className="anime-card p-8 max-w-5xl mx-auto anime-glow">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold anime-title mb-4">🏆 Match Result 🏆</h2>
        <div className="text-8xl mb-6 anime-float">{getGoalDisplay(result.goalsScored)}</div>
        <div className="text-5xl font-bold anime-title mb-4">
          {result.goalsScored} Goal{result.goalsScored !== 1 ? 's' : ''}
        </div>
        <p className="text-xl anime-subtitle">{getPerformanceMessage(result.goalsScored)}</p>
      </div>

      {/* Environmental Factors */}
      <div className="mb-8">
        <EnvironmentalFactorsDisplay factors={result.environmentalFactors} showMultipliers={true} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="anime-card p-6">
          <h3 className="text-xl font-bold anime-subtitle mb-6 flex items-center">
            <span className="mr-2">📊</span>
            Performance Analysis
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-purple-200">Base Goal Rate:</span>
              <span className="font-bold text-purple-100 bg-purple-600/30 px-3 py-1 rounded">0.5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-200">Your Strategy:</span>
              <span className="font-bold text-orange-300 bg-orange-600/30 px-3 py-1 rounded">
                {((result.strategyMultiplier - 1) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-200">Match Conditions:</span>
              <span className={`font-bold px-3 py-1 rounded ${
                result.environmentalMultiplier > 1 
                  ? 'text-green-300 bg-green-600/30' 
                  : 'text-red-300 bg-red-600/30'
              }`}>
                {((result.environmentalMultiplier - 1) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-purple-400/30 pt-3">
              <span className="text-purple-200 font-bold">Final Goal Rate (λ):</span>
              <span className="font-bold text-green-300 bg-green-600/30 px-3 py-1 rounded">{result.lambda.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="anime-card p-6">
          <h3 className="text-xl font-bold anime-subtitle mb-6 flex items-center">
            <span className="mr-2">🎯</span>
            Your Strategic Choices
          </h3>
          <div className="space-y-3">
            {Object.entries(result.strategyChoices).slice(0, 4).map(([category, value]) => {
              return (
                <div key={category} className="flex justify-between items-center bg-purple-800/20 p-3 rounded">
                  <span className="text-purple-200 font-medium flex items-center">
                    <span className="mr-2">{getCategoryIcon(category as StrategicCategory)}</span>
                    {getCategoryLabel(category as StrategicCategory)}:
                  </span>
                  <span className="font-bold text-purple-100 bg-purple-600/30 px-3 py-1 rounded">{value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="anime-card p-6 mb-8">
        <h3 className="text-xl font-bold anime-subtitle mb-6 flex items-center">
          <span className="mr-2">⚡</span>
          Strategy Impact Breakdown
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(strategyMultipliers).map(([category, multiplier]) => (
            <div key={category} className="text-center anime-card p-4 hover:anime-glow-accent transition-all duration-300">
              <div className="text-lg mb-2">{getCategoryIcon(category as StrategicCategory)}</div>
              <div className="text-sm text-purple-300 mb-2 font-medium">
                {getCategoryLabel(category as StrategicCategory)}
              </div>
              <div className={`text-xl font-bold ${
                multiplier > 1 ? 'text-green-300' : 
                multiplier < 1 ? 'text-red-300' : 'text-purple-200'
              }`}>
                {multiplier.toFixed(2)}x
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gray-800/30 rounded">
          <div className="text-center text-sm text-gray-300 mb-2">
            <strong>Note:</strong> All 7 strategic categories were under your control
          </div>
          <div className="text-center text-xs text-gray-400">
            Environmental factors test your adaptability to match conditions!
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        <button
          onClick={onPlayAgain}
          className="anime-button py-4 px-8 rounded-lg text-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
        >
          <span>🔄</span>
          <span>Play Another Match</span>
        </button>
        <button
          onClick={onViewLeaderboard}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 border-2 border-emerald-400 text-white font-bold py-4 px-8 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
        >
          <span>🏆</span>
          <span>View Leaderboard</span>
        </button>
      </div>
    </div>
  );
}
