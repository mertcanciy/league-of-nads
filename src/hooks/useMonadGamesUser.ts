import { useState, useEffect } from 'react';

interface MonadGamesUser {
  id: number;
  username: string;
  walletAddress: string;
}

interface UserResponse {
  hasUsername: boolean;
  user?: MonadGamesUser;
}

interface UseMonadGamesUserReturn {
  user: MonadGamesUser | null;
  hasUsername: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useMonadGamesUser(walletAddress: string): UseMonadGamesUserReturn {
  const [user, setUser] = useState<MonadGamesUser | null>(null);
  const [hasUsername, setHasUsername] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress) {
      setUser(null);
      setHasUsername(false);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Temporarily disable external API calls to prevent fetch errors
    // This hook is currently unused in the main app flow
    console.warn('useMonadGamesUser: External API calls disabled to prevent fetch errors');
    setIsLoading(false);
    setHasUsername(false);
    setUser(null);
    setError('External API calls temporarily disabled');

    // Original implementation commented out to prevent fetch errors:
    /*
    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log('Fetching Monad Games user data for:', walletAddress);
        const response = await fetch(
          `https://monad-games-id-site.vercel.app/api/check-wallet?wallet=${walletAddress}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: UserResponse = await response.json();
        console.log('Monad Games API response:', data);
        
        setHasUsername(data.hasUsername);
        setUser(data.user || null);
      } catch (err) {
        console.error('Error fetching Monad Games user:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setHasUsername(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
    */
  }, [walletAddress]);

  return {
    user,
    hasUsername,
    isLoading,
    error,
  };
}
