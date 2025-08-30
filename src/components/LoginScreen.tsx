"use client";

import { useAuth } from '@/lib/auth';

export default function LoginScreen() {
  const { login, isLoading } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">

      <div className="max-w-lg w-full anime-card p-10 text-center relative z-10">
        <div className="mb-10">
          <h1 className="text-5xl font-bold anime-title mb-4">League Of Nads</h1>
          <p className="text-xl anime-subtitle font-medium">Football Manager Game</p>
        </div>
        
        <div className="mb-10">
          <div className="w-52 h-52 mx-auto mb-6 flex items-center justify-center relative">
            {/* Anime Character Container */}
            <div className="relative w-full h-full">
              {/* Anime Character */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-48 h-48 relative anime-float">
                  {/* Soccer Nad character image */}
                  <img 
                    src="/soccer-nad.png" 
                    alt="Soccer Nad" 
                    className="w-full h-full object-contain filter drop-shadow-2xl"
                    onError={(e) => {
                      // Fallback to emoji if image not found
                      e.currentTarget.style.display = 'none';
                      const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                      if (nextElement) {
                        nextElement.style.display = 'block';
                      }
                    }}
                  />
                  {/* Fallback character */}
                  <div className="w-full h-full items-center justify-center text-6xl" style={{display: 'none'}}>
                    🏃‍♀️
                  </div>
                </div>
              </div>
              

            </div>
          </div>
          <p className="text-gray-200 mb-8 leading-relaxed text-lg">
            Sign in with your <span className="anime-title text-lg">Monad Games ID</span> to start your football management journey. 
            Choose your strategy, simulate matches, and compete on the global leaderboard!
          </p>
        </div>

        <button
          onClick={login}
          disabled={isLoading}
          className="w-full anime-button py-5 px-8 rounded-lg text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none no-underline"
          style={{ textDecoration: 'none' }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              <span className="anime-loading">Connecting to Monad...</span>
            </div>
          ) : (
            <span className="flex items-center justify-center">
              Sign in with Monad Games ID
            </span>
          )}
        </button>

        <div className="mt-8 text-sm anime-subtitle">
          <p className="flex items-center justify-center">
            Powered by Monad Games ID
          </p>
        </div>

        {/* Anime-style decorative elements */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-purple-400 rounded-full opacity-60 anime-glow-accent"></div>
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-violet-400 rounded-full opacity-60 anime-glow-accent" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-indigo-400 rounded-full opacity-60 anime-glow-accent" style={{animationDelay: '1s'}}></div>
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-purple-500 rounded-full opacity-60 anime-glow-accent" style={{animationDelay: '1.5s'}}></div>
      </div>
    </div>
  );
}
