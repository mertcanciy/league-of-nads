"use client";

import { EnvironmentalFactors } from '@/types/game';
import { getEnvironmentalDescription, getEnvironmentalMultipliers } from '@/lib/gameEngine';

interface EnvironmentalFactorsProps {
  factors: EnvironmentalFactors;
  showMultipliers?: boolean;
}

export default function EnvironmentalFactorsDisplay({ factors, showMultipliers = false }: EnvironmentalFactorsProps) {
  const multipliers = getEnvironmentalMultipliers(factors);
  
  const getMultiplierColor = (multiplier: number) => {
    if (multiplier > 1.0) return 'text-green-400';
    if (multiplier < 1.0) return 'text-red-400';
    return 'text-gray-300';
  };

  const getMultiplierIcon = (multiplier: number) => {
    if (multiplier > 1.05) return '⬆️';
    if (multiplier < 0.95) return '⬇️';
    return '➡️';
  };

  const formatMultiplier = (multiplier: number) => {
    const percentage = ((multiplier - 1) * 100).toFixed(0);
    if (multiplier > 1.0) return `+${percentage}%`;
    if (multiplier < 1.0) return `${percentage}%`;
    return 'Normal';
  };

  const environmentalCategories = [
    {
      key: 'weather' as const,
      label: 'Weather',
      icon: '🌤️',
      value: factors.weather,
      multiplier: multipliers.weather,
    },
    {
      key: 'pitchConditions' as const,
      label: 'Pitch',
      icon: '🏟️',
      value: factors.pitchConditions,
      multiplier: multipliers.pitchConditions,
    },
    {
      key: 'matchAtmosphere' as const,
      label: 'Atmosphere',
      icon: '👥',
      value: factors.matchAtmosphere,
      multiplier: multipliers.matchAtmosphere,
    },
    {
      key: 'matchImportance' as const,
      label: 'Importance',
      icon: '🏆',
      value: factors.matchImportance,
      multiplier: multipliers.matchImportance,
    },
  ];

  const overallMultiplier = Object.values(multipliers).reduce((acc, val) => acc * val, 1);

  return (
    <div className="anime-card p-6 bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-400/30">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-blue-200 mb-2 flex items-center justify-center">
          <span className="mr-2">🎲</span>
          Match Conditions
          <span className="ml-2">🎲</span>
        </h3>
        <p className="text-blue-300">Environmental factors beyond your control</p>
        {showMultipliers && (
          <div className="mt-3">
            <span className="text-lg font-bold">Overall Impact: </span>
            <span className={`text-lg font-bold ${getMultiplierColor(overallMultiplier)}`}>
              {getMultiplierIcon(overallMultiplier)} {formatMultiplier(overallMultiplier)}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {environmentalCategories.map((category) => (
          <div
            key={category.key}
            className="bg-slate-800/50 rounded p-4 border border-slate-600/50 hover:border-slate-500/70 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-blue-200 flex items-center">
                <span className="mr-2 text-xl">{category.icon}</span>
                {category.label}
              </h4>
              {showMultipliers && (
                <span className={`text-sm font-bold ${getMultiplierColor(category.multiplier)}`}>
                  {formatMultiplier(category.multiplier)}
                </span>
              )}
            </div>
            
            <div className="mb-2">
              <span className="font-medium text-white bg-slate-700 px-2 py-1 rounded text-sm">
                {category.value}
              </span>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              {getEnvironmentalDescription(category.value, category.key)}
            </p>
          </div>
        ))}
      </div>

      {showMultipliers && (
                  <div className="mt-6 p-4 bg-slate-800/30 rounded border border-slate-600/30">
          <h4 className="font-bold text-blue-200 mb-2 text-center">Impact Breakdown</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {environmentalCategories.map((category) => (
              <div key={category.key} className="text-center">
                <div className="text-xs text-slate-400">{category.label}</div>
                <div className={`font-bold ${getMultiplierColor(category.multiplier)}`}>
                  {(category.multiplier * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
