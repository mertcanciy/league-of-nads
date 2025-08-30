"use client";

import { useState } from 'react';
import { 
  StrategyChoices, 
  StrategicCategory,
  Formation, 
  DefensivePhilosophy, 
  TrainingFocus, 
  AttackingApproach, 
  StrikerRole, 
  TempoStyle, 
  MatchMentality 
} from '@/types/game';
import { getStrategyDescription } from '@/lib/gameEngine';

interface StrategyFormProps {
  onSubmit: (choices: StrategyChoices) => void;
  isLoading?: boolean;
}

const STRATEGIC_CATEGORIES: { key: StrategicCategory; label: string; icon: string; description: string }[] = [
  {
    key: 'formation',
    label: 'Formation',
    icon: '⚡',
    description: 'Your team\'s structural setup and tactical foundation'
  },
  {
    key: 'defensivePhilosophy',
    label: 'Defensive Philosophy',
    icon: '🛡️',
    description: 'How your team defends and transitions to attack'
  },
  {
    key: 'trainingFocus',
    label: 'Training Focus',
    icon: '💪',
    description: 'What you emphasized in pre-match training sessions'
  },
  {
    key: 'attackingApproach',
    label: 'Attacking Approach',
    icon: '🎯',
    description: 'How your team creates scoring opportunities'
  },
  {
    key: 'strikerRole',
    label: 'Striker Role',
    icon: '⚽',
    description: 'What you ask your main goalscorer to do'
  },
  {
    key: 'tempoStyle',
    label: 'Tempo & Style',
    icon: '⏱️',
    description: 'The pace and rhythm of your team\'s play'
  },
  {
    key: 'matchMentality',
    label: 'Match Mentality',
    icon: '🧠',
    description: 'Your team\'s psychological approach to the game'
  },
];

const STRATEGY_OPTIONS = {
  formation: ['4-3-3', '4-4-2', '3-5-2', '4-2-3-1', '5-3-2', '3-4-3'] as Formation[],
  defensivePhilosophy: ['High Press', 'Gegenpressing', 'Mid Block', 'Low Block', 'Counter-Attack', 'Offside Trap'] as DefensivePhilosophy[],
  trainingFocus: ['Set Pieces', 'Finishing Practice', 'Movement Drills', 'Team Shape', 'Individual Skills', 'Physical Prep'] as TrainingFocus[],
  attackingApproach: ['Wing Play', 'Through the Middle', 'Long Balls', 'Build-Up Play', 'Quick Transitions', 'Individual Brilliance'] as AttackingApproach[],
  strikerRole: ['Target Man', 'Poacher', 'False 9', 'Wide Forward', 'Deep Striker', 'Penalty Box Predator'] as StrikerRole[],
  tempoStyle: ['High Tempo', 'Controlled Pace', 'Patient Build-Up', 'Direct Style', 'Reactive Play', 'Chaos Ball'] as TempoStyle[],
  matchMentality: ['Aggressive', 'Confident', 'Cautious', 'Desperate', 'Clinical', 'Expressive'] as MatchMentality[],
};

export default function StrategyForm({ onSubmit, isLoading = false }: StrategyFormProps) {
  const [choices, setChoices] = useState<StrategyChoices>({
    formation: '4-4-2',
    defensivePhilosophy: 'Mid Block',
    trainingFocus: 'Finishing Practice',
    attackingApproach: 'Through the Middle',
    strikerRole: 'Poacher',
    tempoStyle: 'Controlled Pace',
    matchMentality: 'Confident',
  });

  const handleChoiceChange = (category: StrategicCategory, value: string) => {
    setChoices(prev => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(choices);
  };

  return (
    <div className="anime-card p-8 max-w-6xl mx-auto anime-glow">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold anime-title mb-4">⚡ Pre-Match Strategy ⚡</h2>
        <p className="text-xl anime-subtitle mb-4">Choose your tactical approach for this epic match!</p>
        <p className="text-md text-purple-300">
          Configure all 7 strategic categories - environmental factors will be randomly determined
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {STRATEGIC_CATEGORIES.map((category) => {
            const options = STRATEGY_OPTIONS[category.key];
            const id = `strategy-${category.key}`;
            
            return (
              <div key={category.key} className="space-y-4 anime-card p-6 hover:anime-glow-accent transition-all duration-300">
                <label htmlFor={id} className="block text-lg font-bold text-purple-200 flex items-center">
                  <span className="mr-2 text-xl">{category.icon}</span>
                  {category.label}
                </label>
                <select
                  id={id}
                  name={category.key}
                  aria-label={category.label}
                  value={choices[category.key]}
                  onChange={(e) => handleChoiceChange(category.key, e.target.value)}
                  className="anime-input w-full text-lg font-medium"
                >
                  {options.map((option) => (
                    <option key={option} value={option} className="bg-purple-900 text-white">
                      {option}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-purple-300 leading-relaxed">
                  {getStrategyDescription(choices[category.key], category.key)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-md p-6 border border-white/20">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center">
            <span className="mr-2">🎲</span>
            Environmental Factors (Random)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/5 rounded border border-white/10">
              <div className="text-xl mb-1">🌤️</div>
              <div className="text-sm font-medium text-white/90">Weather</div>
              <div className="text-xs text-white/60">Random</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded border border-white/10">
              <div className="text-xl mb-1">🏟️</div>
              <div className="text-sm font-medium text-white/90">Pitch Conditions</div>
              <div className="text-xs text-white/60">Random</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded border border-white/10">
              <div className="text-xl mb-1">👥</div>
              <div className="text-sm font-medium text-white/90">Match Atmosphere</div>
              <div className="text-xs text-white/60">Random</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded border border-white/10">
              <div className="text-xl mb-1">🏆</div>
              <div className="text-sm font-medium text-white/90">Match Importance</div>
              <div className="text-xs text-white/60">Random</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="anime-button py-6 px-12 rounded-lg text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-3"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span className="anime-loading">Preparing Epic Match...</span>
              </>
            ) : (
              <>
                <span>Start Match Simulation</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
