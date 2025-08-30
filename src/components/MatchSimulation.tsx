"use client";

import { useEffect, useState } from 'react';
import { MatchResult, StrategyChoices } from '@/types/game';

interface MatchSimulationProps {
  strategyChoices: StrategyChoices;
  matchResult: MatchResult;
  onSimulationComplete: () => void;
}

interface PlayerPosition {
  x: number;
  y: number;
  id: number;
  isForward?: boolean;
}

// Formation configurations (percentages of field width/height)
const FORMATIONS = {
  '4-3-3': {
    defenders: [{ x: 15, y: 20 }, { x: 15, y: 40 }, { x: 15, y: 60 }, { x: 15, y: 80 }],
    midfielders: [{ x: 35, y: 30 }, { x: 35, y: 50 }, { x: 35, y: 70 }],
    forwards: [{ x: 45, y: 25 }, { x: 45, y: 50 }, { x: 45, y: 75 }]
  },
  '4-4-2': {
    defenders: [{ x: 15, y: 20 }, { x: 15, y: 40 }, { x: 15, y: 60 }, { x: 15, y: 80 }],
    midfielders: [{ x: 35, y: 20 }, { x: 35, y: 40 }, { x: 35, y: 60 }, { x: 35, y: 80 }],
    forwards: [{ x: 45, y: 35 }, { x: 45, y: 65 }]
  },
  '3-5-2': {
    defenders: [{ x: 15, y: 25 }, { x: 15, y: 50 }, { x: 15, y: 75 }],
    midfielders: [{ x: 35, y: 15 }, { x: 35, y: 30 }, { x: 35, y: 50 }, { x: 35, y: 70 }, { x: 35, y: 85 }],
    forwards: [{ x: 45, y: 35 }, { x: 45, y: 65 }]
  },
  '5-3-2': {
    defenders: [{ x: 15, y: 15 }, { x: 15, y: 30 }, { x: 15, y: 50 }, { x: 15, y: 70 }, { x: 15, y: 85 }],
    midfielders: [{ x: 35, y: 30 }, { x: 35, y: 50 }, { x: 35, y: 70 }],
    forwards: [{ x: 45, y: 35 }, { x: 45, y: 65 }]
  }
};

export default function MatchSimulation({ strategyChoices, matchResult, onSimulationComplete }: MatchSimulationProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [goalsScored, setGoalsScored] = useState(0);
  const [showGoal, setShowGoal] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [ourPlayers, setOurPlayers] = useState<PlayerPosition[]>([]);
  const [opponentPlayers, setOpponentPlayers] = useState<PlayerPosition[]>([]);

  // Initialize player positions based on formation
  useEffect(() => {
    const formation = FORMATIONS[strategyChoices.formation as keyof typeof FORMATIONS] || FORMATIONS['4-3-3'];
    
    // Our team (left side)
    const ourTeam: PlayerPosition[] = [
      // Goalkeeper
      { x: 5, y: 50, id: 0 },
      // Field players based on formation
      ...formation.defenders.map((pos, i) => ({ ...pos, id: i + 1 })),
      ...formation.midfielders.map((pos, i) => ({ ...pos, id: i + 1 + formation.defenders.length })),
      ...formation.forwards.map((pos, i) => ({ 
        ...pos, 
        id: i + 1 + formation.defenders.length + formation.midfielders.length,
        isForward: i === 0 // Only mark the FIRST forward as special
      }))
    ];

    // Opponent team (right side, mirrored)
    const opponentTeam: PlayerPosition[] = [
      // Goalkeeper
      { x: 95, y: 50, id: 0 },
      // Field players (mirrored positions)
      ...formation.defenders.map((pos, i) => ({ x: 100 - pos.x, y: pos.y, id: i + 1 })),
      ...formation.midfielders.map((pos, i) => ({ x: 100 - pos.x, y: pos.y, id: i + 1 + formation.defenders.length })),
      ...formation.forwards.map((pos, i) => ({ x: 100 - pos.x, y: pos.y, id: i + 1 + formation.defenders.length + formation.midfielders.length }))
    ];

    setOurPlayers(ourTeam);
    setOpponentPlayers(opponentTeam);
  }, [strategyChoices.formation]);

  // Pre-calculate goal times to ensure they show during simulation
  const [goalTimes, setGoalTimes] = useState<number[]>([]);

  useEffect(() => {
    // Pre-calculate when goals should occur during the 10-second simulation
    if (matchResult.goalsScored > 0) {
      const times: number[] = [];
      for (let i = 0; i < matchResult.goalsScored; i++) {
        // Spread goals evenly throughout the simulation (between 2 and 9 seconds)
        const goalTime = 2 + (i * 7) / Math.max(1, matchResult.goalsScored - 1);
        times.push(Math.min(9, goalTime)); // Ensure last goal is before 9 seconds
      }
      setGoalTimes(times);
      console.log('Goal times:', times); // Debug log
    }
  }, [matchResult.goalsScored]);

  // Simulation timer and goal scoring
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev + 0.1;
        
        // Check if it's time to score a goal
        goalTimes.forEach((goalTime, index) => {
          if (goalsScored <= index && newTime >= goalTime && newTime < goalTime + 0.2) {
            console.log(`Scoring goal ${index + 1} at time ${newTime}`); // Debug log
            setGoalsScored(index + 1);
            setShowGoal(true);
            setTimeout(() => setShowGoal(false), 2000);
          }
        });
        
        // End simulation after 10 seconds
        if (newTime >= 10) {
          setSimulationComplete(true);
          return 10;
        }
        
        return newTime;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [goalTimes, goalsScored]);

  // Animate players with simple movement
  useEffect(() => {
    const animationTimer = setInterval(() => {
      setOurPlayers(prev => prev.map(player => ({
        ...player,
        x: player.x + (Math.random() - 0.5) * 2,
        y: player.y + (Math.random() - 0.5) * 2
      })));
      
      setOpponentPlayers(prev => prev.map(player => ({
        ...player,
        x: player.x + (Math.random() - 0.5) * 2,
        y: player.y + (Math.random() - 0.5) * 2
      })));
    }, 200);

    return () => clearInterval(animationTimer);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col justify-center bg-gradient-to-br from-green-900/80 via-green-800/70 to-green-700/60 backdrop-blur-sm">
      <div className="flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
        {/* Match Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-3">⚽ LIVE MATCH ⚽</h1>
          <div className="flex justify-center items-center space-x-6 text-xl font-bold text-white">
            <div className="bg-blue-600/30 backdrop-blur-md px-4 py-2 rounded border border-blue-400/40 shadow-lg">
              YOUR TEAM
            </div>
            <div className="bg-gray-800/40 backdrop-blur-md px-3 py-2 rounded border border-gray-400/30 shadow-lg">
              {goalsScored} - 0
            </div>
            <div className="bg-red-600/30 backdrop-blur-md px-4 py-2 rounded border border-red-400/40 shadow-lg">
              OPPONENTS
            </div>
          </div>
          <div className="mt-3 text-lg text-green-200">
            Formation: {strategyChoices.formation} | Time: {Math.floor(currentTime)}:00
          </div>
        </div>

        {/* Football Pitch */}
        <div className="relative w-3/5 h-80 mx-auto bg-green-600 border-4 border-white rounded overflow-hidden shadow-2xl">
          {/* Pitch markings */}
          <div className="absolute inset-0">
            {/* Center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white transform -translate-x-0.5"></div>
            {/* Center circle */}
            <div className="absolute left-1/2 top-1/2 w-20 h-20 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            {/* Goal areas */}
            <div className="absolute left-0 top-1/3 bottom-1/3 w-16 border-2 border-white border-l-0"></div>
            <div className="absolute right-0 top-1/3 bottom-1/3 w-16 border-2 border-white border-r-0"></div>
            {/* Penalty areas */}
            <div className="absolute left-0 top-1/4 bottom-1/4 w-24 border-2 border-white border-l-0"></div>
            <div className="absolute right-0 top-1/4 bottom-1/4 w-24 border-2 border-white border-r-0"></div>
          </div>

          {/* Our Team Players */}
          {ourPlayers.map((player) => (
            <div
              key={`our-${player.id}`}
              className="absolute transition-all duration-200"
              style={{
                left: `${Math.max(1, Math.min(49, player.x))}%`,
                top: `${Math.max(5, Math.min(95, player.y))}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {player.isForward ? (
                // Forward - use anime character (bigger)
                <div className="relative hover:scale-110 transition-transform duration-200">
                  <img 
                    src="/soccer-nad.png" 
                    alt="Forward" 
                    className="w-12 h-12 object-contain drop-shadow-lg hover:drop-shadow-xl transition-all duration-200"
                  />
                </div>
              ) : (
                // All other players - circles
                <div className={`w-4 h-4 rounded-full shadow-lg ${
                  player.id === 0 
                    ? 'bg-purple-500 border-2 border-purple-700' // Goalkeeper
                    : 'bg-blue-500 border-2 border-blue-700'     // Regular field players
                }`}></div>
              )}
            </div>
          ))}

          {/* Opponent Team Players */}
          {opponentPlayers.map((player) => (
            <div
              key={`opp-${player.id}`}
              className={`absolute w-4 h-4 rounded-full transition-all duration-200 shadow-lg ${
                player.id === 0 
                  ? 'bg-orange-500 border-2 border-orange-700' 
                  : 'bg-red-500 border-2 border-red-700'
              }`}
              style={{
                left: `${Math.max(51, Math.min(99, player.x))}%`,
                top: `${Math.max(5, Math.min(95, player.y))}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}

          {/* Ball (simple animation) */}
          <div 
            className="absolute w-3 h-3 bg-white rounded-full shadow-lg transition-all duration-300"
            style={{
              left: `${45 + Math.sin(currentTime * 2) * 10}%`,
              top: `${50 + Math.cos(currentTime * 3) * 20}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>

        {/* Goal Animation */}
        {showGoal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="relative">
              <div className="text-9xl font-bold text-yellow-400 animate-bounce drop-shadow-2xl">
                ⚽ GOAAAAL! ⚽
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 blur-xl opacity-50 animate-ping"></div>
              <div className="absolute inset-0 bg-yellow-400/30 animate-pulse rounded-full"></div>
            </div>
            <div className="absolute inset-0 bg-yellow-400/10 animate-pulse"></div>
          </div>
        )}

        {/* Strategy Info */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="bg-blue-800/40 backdrop-blur-sm p-3 rounded border border-blue-500/20">
            <div className="text-blue-200 text-xs">Formation</div>
            <div className="text-white font-bold text-sm">{strategyChoices.formation || 'Random'}</div>
          </div>
          <div className="bg-purple-800/40 backdrop-blur-sm p-3 rounded border border-purple-500/20">
            <div className="text-purple-200 text-xs">Defense</div>
            <div className="text-white font-bold text-sm">{strategyChoices.defensivePhilosophy || 'Random'}</div>
          </div>
          <div className="bg-green-800/40 backdrop-blur-sm p-3 rounded border border-green-500/20">
            <div className="text-green-200 text-xs">Tempo</div>
            <div className="text-white font-bold text-sm">{strategyChoices.tempoStyle || 'Random'}</div>
          </div>
          <div className="bg-red-800/40 backdrop-blur-sm p-3 rounded border border-red-500/20">
            <div className="text-red-200 text-xs">Training</div>
            <div className="text-white font-bold text-sm">{strategyChoices.trainingFocus || 'Random'}</div>
          </div>
        </div>

        {/* Simulation Complete Button */}
        {simulationComplete && (
          <div className="text-center mt-6">
            <div className="mb-3 text-xl font-bold text-white">
              🎉 Match Complete! 🎉
            </div>
            <button
              onClick={onSimulationComplete}
              className="bg-gradient-to-r from-purple-600/90 to-violet-700/90 hover:from-purple-700 hover:to-violet-800 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-purple-400/30"
            >
              📊 View Match Results
            </button>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mt-4 bg-gray-700/50 backdrop-blur-sm rounded-full h-2 overflow-hidden border border-gray-600/30">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-full transition-all duration-100 shadow-lg"
            style={{ width: `${(currentTime / 10) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
