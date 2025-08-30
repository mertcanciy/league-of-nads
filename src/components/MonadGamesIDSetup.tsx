"use client";

import { useState } from 'react';
import { MonadGamesUser } from '@/types/game';

interface MonadGamesIDSetupProps {
  user: MonadGamesUser;
  onRetry: () => void;
  onLinkMonadGamesID?: () => void;
}

export default function MonadGamesIDSetup({ user, onRetry, onLinkMonadGamesID }: MonadGamesIDSetupProps) {
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Function to validate if user actually has a username
  const validateUsername = async () => {
    if (!user.walletAddress) {
      setShowWarningPopup(true);
      return;
    }

    setIsValidating(true);
    try {
      const response = await fetch(`https://monad-games-id-site.vercel.app/api/check-wallet?wallet=${user.walletAddress}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.hasUsername && data.user) {
          // User has a username, proceed with retry
          onRetry();
        } else {
          // User doesn't have a username, show warning
          setShowWarningPopup(true);
        }
      } else {
        // API error, show warning as fallback
        setShowWarningPopup(true);
      }
    } catch (error) {
      console.error('Error validating username:', error);
      // Network error, show warning as fallback
      setShowWarningPopup(true);
    } finally {
      setIsValidating(false);
    }
  };

  // Warning popup component
  const WarningPopup = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="max-w-md w-full anime-card p-8 text-center relative anime-glow">
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center anime-glow-accent">
            <span className="text-white text-2xl">⚠️</span>
          </div>
        </div>
        
        <h3 className="text-2xl font-bold anime-title mb-4 text-red-400">Username Not Reserved!</h3>
        <p className="text-lg anime-subtitle mb-6 leading-relaxed">
          Please reserve your username first by clicking the <span className="anime-title text-emerald-400">&quot;Reserve Username&quot;</span> button and completing the process on the Monad Games ID site.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => setShowWarningPopup(false)}
            className="w-full anime-button py-3 px-6 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
          >
            ✅ Got it, I&apos;ll reserve my username
          </button>
        </div>
        
        {/* Decorative corner elements */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-red-400 rounded-full opacity-60 anime-glow-accent"></div>
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-400 rounded-full opacity-60 anime-glow-accent" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-red-500 rounded-full opacity-60 anime-glow-accent" style={{animationDelay: '1s'}}></div>
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-orange-500 rounded-full opacity-60 anime-glow-accent" style={{animationDelay: '1.5s'}}></div>
      </div>
    </div>
  );
  if (user.needsLinking) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Anime-style floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-gradient-to-br from-purple-400/20 to-purple-600/10 anime-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-gradient-to-br from-violet-400/15 to-violet-600/10 anime-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-32 left-32 w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400/20 to-indigo-600/10 anime-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 right-32 w-28 h-28 rounded-full bg-gradient-to-br from-purple-500/15 to-purple-700/10 anime-float" style={{animationDelay: '0.5s'}}></div>
        </div>

        <div className="max-w-lg w-full anime-card p-10 text-center relative z-10 anime-glow">
          <div className="mb-10">
            <div className="w-32 h-32 mx-auto mb-6 flex items-center justify-center relative">
              <div className="w-full h-full anime-glow-accent rounded-full flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-full"></div>
                <span className="relative text-white text-4xl animate-pulse">🔗</span>
              </div>
              {/* Energy rings */}
              <div className="absolute -inset-2 rounded-full border-2 border-purple-400/50 animate-spin" style={{animationDuration: '3s'}}></div>
              <div className="absolute -inset-4 rounded-full border border-violet-300/30 animate-ping" style={{animationDuration: '2s'}}></div>
            </div>
            <h2 className="text-4xl font-bold anime-title mb-4">🔗 Link Your Monad Games ID</h2>
            <p className="text-xl anime-subtitle leading-relaxed">
              You need to link your <span className="anime-title text-lg">Monad Games ID</span> account to continue your epic football management journey!
            </p>
          </div>

          <div className="space-y-6">
            <button
              onClick={onRetry}
              className="w-full anime-button py-5 px-8 rounded-lg text-xl font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3"
            >
              <span>🚀</span>
              <span>Link Monad Games ID</span>
              <span>⚡</span>
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-gray-600 to-gray-700 border-2 border-gray-400 text-white font-bold py-4 px-8 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105"
            >
              🔄 Logout & Try Again
            </button>
            
            <div className="anime-card p-6 bg-purple-800/20">
              <p className="text-purple-200 mb-3 font-medium">Don&apos;t have a Monad Games ID?</p>
              <a 
                href="https://monad-games-id-site.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="anime-title text-lg hover:text-purple-300 transition-colors duration-300 inline-flex items-center space-x-2"
              >
                <span>✨</span>
                <span>Create one here</span>
                <span>✨</span>
              </a>
            </div>
          </div>

          {/* Decorative corner elements */}
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-purple-400 rounded-full opacity-60 anime-glow-accent"></div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-violet-400 rounded-full opacity-60 anime-glow-accent" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-indigo-400 rounded-full opacity-60 anime-glow-accent" style={{animationDelay: '1s'}}></div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-purple-500 rounded-full opacity-60 anime-glow-accent" style={{animationDelay: '1.5s'}}></div>
        </div>
      </div>
    );
  }

  if (user.needsUsername) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Anime-style floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-600/10 anime-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-gradient-to-br from-green-400/15 to-green-600/10 anime-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-32 left-32 w-20 h-20 rounded-full bg-gradient-to-br from-teal-400/20 to-teal-600/10 anime-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 right-32 w-28 h-28 rounded-full bg-gradient-to-br from-emerald-500/15 to-emerald-700/10 anime-float" style={{animationDelay: '0.5s'}}></div>
        </div>

        <div className="max-w-lg w-full anime-card p-10 text-center relative z-10 anime-glow">
          <div className="mb-10">
            <div className="w-32 h-32 mx-auto mb-6 flex items-center justify-center relative">
              <div className="w-full h-full anime-glow-accent rounded-full flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-full"></div>
                <span className="relative text-white text-4xl animate-pulse">👤</span>
              </div>
              {/* Energy rings */}
              <div className="absolute -inset-2 rounded-full border-2 border-emerald-400/50 animate-spin" style={{animationDuration: '3s'}}></div>
              <div className="absolute -inset-4 rounded-full border border-green-300/30 animate-ping" style={{animationDuration: '2s'}}></div>
            </div>
            <h2 className="text-4xl font-bold anime-title mb-4">👤 Choose Your Username</h2>
            <p className="text-xl anime-subtitle leading-relaxed">
              You need to reserve a <span className="anime-title text-lg">unique username</span> for your Monad Games ID to start your legendary football career!
            </p>
          </div>

          <div className="space-y-6">
            <a 
              href="https://monad-games-id-site.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 border-2 border-emerald-400 text-white font-bold py-5 px-8 rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center space-x-3"
            >
              <span>✨</span>
              <span>Reserve Username</span>
              <span>🎯</span>
            </a>
            
            <button
              onClick={validateUsername}
              disabled={isValidating}
              className="w-full anime-button py-4 px-8 rounded-lg text-lg font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isValidating ? (
                <>
                  <span className="animate-spin mr-2">🔄</span>
                  Checking Username...
                </>
              ) : (
                <>✅ I&apos;ve Reserved My Username</>
              )}
            </button>
          </div>

          {/* Info card */}
          <div className="mt-8 anime-card p-6 bg-green-800/20">
            <p className="text-green-200 text-sm font-medium">
              💡 Your username will be unique across all Monad Games and will represent you on leaderboards!
            </p>
          </div>

          {/* Decorative corner elements */}
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-emerald-400 rounded-full opacity-60 anime-glow-accent"></div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full opacity-60 anime-glow-accent" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-teal-400 rounded-full opacity-60 anime-glow-accent" style={{animationDelay: '1s'}}></div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-emerald-500 rounded-full opacity-60 anime-glow-accent" style={{animationDelay: '1.5s'}}></div>
        </div>

        {/* Warning popup */}
        {showWarningPopup && <WarningPopup />}
      </div>
    );
  }

  return null;
}
