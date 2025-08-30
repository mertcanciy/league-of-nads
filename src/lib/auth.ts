"use client";

import { usePrivy, CrossAppAccountWithMetadata } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { MonadGamesUser } from '@/types/game';

export function useAuth() {
  const { 
    login, 
    logout, 
    authenticated, 
    user, 
    ready,
    linkWallet,
    unlinkWallet,

  } = usePrivy();

  const [monadUser, setMonadUser] = useState<MonadGamesUser | null>(null);
  const [isLoadingUsername, setIsLoadingUsername] = useState(false);

  // Function to fetch username from Monad Games ID API
  const fetchUsername = async (walletAddress: string) => {
    try {
      console.log('Fetching username for wallet:', walletAddress);
      
      // Add timeout and better error handling for the external API call
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`https://monad-games-id-site.vercel.app/api/check-wallet?wallet=${walletAddress}`, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.warn(`API responded with status ${response.status}`);
        return null;
      }
      
      const data = await response.json();
      console.log('Username fetch response:', data);
      
      if (data.hasUsername && data.user) {
        console.log('User has username:', data.user.username);
        return data.user;
      } else {
        // User doesn't have a username, return null
        console.log('User does not have a username');
        return null;
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('Username fetch timed out - continuing without external username');
      } else {
        console.warn('Error fetching username (non-blocking):', error);
      }
      return null;
    }
  };

  useEffect(() => {
    const extractMonadGamesUser = async () => {
      if (authenticated && user && ready) {
        setIsLoadingUsername(true);
        
        try {
          console.log('Full user object:', user);
          console.log('User linked accounts:', user.linkedAccounts);
          
          // Debug: log the types of linked accounts
          user.linkedAccounts.forEach((account, index) => {
            console.log(`Account ${index}:`, {
              type: account.type,
              providerApp: account.type === 'cross_app' ? account.providerApp : 'N/A',
              address: 'address' in account ? account.address || 'N/A' : 'N/A'
            });
          });

          // Check if user has linkedAccounts for Monad Games ID
          if (user.linkedAccounts.length > 0) {
            // Get the cross app account created using Monad Games ID
            const crossAppAccount: CrossAppAccountWithMetadata = user.linkedAccounts.filter(
              account => account.type === "cross_app" && account.providerApp.id === "cmd8euall0037le0my79qpz42"
            )[0] as CrossAppAccountWithMetadata;

            console.log('Cross app account:', crossAppAccount);

            if (crossAppAccount && crossAppAccount.embeddedWallets.length > 0) {
              // The first embedded wallet created using Monad Games ID is the wallet address
              const walletAddress = crossAppAccount.embeddedWallets[0].address;
              console.log('Monad Games ID wallet address:', walletAddress);

              // Set initial user state to avoid blocking authentication
              setMonadUser({
                id: Date.now(),
                username: `Player_${walletAddress.slice(2, 8)}`,
                walletAddress: walletAddress.toLowerCase(),
                needsUsername: true,
              });

              // Try to fetch username from Monad Games ID API (non-blocking)
              fetchUsername(walletAddress).then(userData => {
                if (userData) {
                  setMonadUser({
                    id: userData.id,
                    username: userData.username,
                    walletAddress: userData.walletAddress.toLowerCase(),
                  });
                }
              }).catch(error => {
                console.warn('Failed to fetch username, using default:', error);
                // User state is already set above, no need to change it
              });
            } else {
              console.log('No embedded wallets found in cross app account');
              setMonadUser({
                id: Date.now(),
                username: 'No Embedded Wallet',
                walletAddress: '',
                needsLinking: true,
              });
            }
          } else {
            console.log('No linked accounts found - user needs to link Monad Games ID');
            setMonadUser({
              id: Date.now(),
              username: 'No Linked Account',
              walletAddress: '',
              needsLinking: true,
            });
          }
        } catch (error) {
          console.error('Error extracting user:', error);
          // Fallback - try regular wallet if available
          if (user.wallet?.address) {
            setMonadUser({
              id: Date.now(),
              username: `Player_${user.wallet.address.slice(2, 8)}`,
              walletAddress: user.wallet.address.toLowerCase(),
              needsLinking: true,
            });
          }
        } finally {
          setIsLoadingUsername(false);
        }
      } else {
        setMonadUser(null);
      }
    };

    extractMonadGamesUser();
  }, [authenticated, user, ready]);

  // Function to login with Monad Games ID
  const loginWithMonadGamesID = async () => {
    try {
      console.log('Attempting to login with Monad Games ID...');
      // Using regular login for now
      await login();
    } catch (error) {
      console.error('Monad Games ID login failed:', error);
      // Fallback to regular login
      await login();
    }
  };

  return {
    login,
    logout,
    authenticated,
    user: monadUser,
    ready,
    linkWallet,
    unlinkWallet,
    loginWithMonadGamesID,
    isLoading: !ready || isLoadingUsername,
  };
}

export function useRequireAuth() {
  const { authenticated, ready, login } = useAuth();
  
  useEffect(() => {
    if (ready && !authenticated) {
      login();
    }
  }, [ready, authenticated, login]);

  return { authenticated, ready };
}
