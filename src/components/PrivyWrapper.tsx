"use client";

import { PrivyProvider } from '@privy-io/react-auth';
import { Component, ReactNode } from 'react';

interface PrivyWrapperProps {
  children: React.ReactNode;
}

// Simple error boundary for Privy provider
class PrivyErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('Privy initialization error caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default function PrivyWrapper({ children }: PrivyWrapperProps) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  // During build time or when no app ID is provided, render children without Privy
  if (!privyAppId) {
    console.warn('NEXT_PUBLIC_PRIVY_APP_ID is not set. Privy authentication will not be available.');
    return <>{children}</>;
  }

  const fallbackUI = (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-600 text-lg font-semibold mb-2">Authentication Unavailable</div>
        <p className="text-gray-600">Please refresh the page and try again.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );

  return (
    <PrivyErrorBoundary fallback={fallbackUI}>
      <PrivyProvider
        appId={privyAppId}
        config={{
          loginMethodsAndOrder: {
            // Enable Monad Games ID Cross App authentication
            primary: ["privy:cmd8euall0037le0my79qpz42"], // Monad Games ID Cross App ID
          },
          appearance: {
            theme: 'light',
            accentColor: '#3b82f6',
          },
          // Disable external wallet connections to prevent fetch errors
          externalWallets: {
            walletConnect: { enabled: false },
            coinbaseWallet: { connectionOptions: 'smartWalletOnly' },
          },
          // Disable telemetry and analytics to reduce network calls
          legal: {
            termsAndConditionsUrl: undefined,
            privacyPolicyUrl: undefined,
          },
          // Configure supported chains (Monad testnet)
          supportedChains: [
            {
              id: 10143, // Monad testnet chain ID
              name: 'Monad Testnet',
              network: 'monad-testnet',
              nativeCurrency: {
                decimals: 18,
                name: 'MON',
                symbol: 'MON',
              },
              rpcUrls: {
                default: {
                  http: ['https://testnet-rpc.monad.xyz'],
                },
              },
              blockExplorers: {
                default: { name: 'Monad Explorer', url: 'https://testnet.monadexplorer.com' },
              },
              testnet: true,
            },
          ],
          fundingMethodConfig: {
            moonpay: { useSandbox: false },
          },
          // Add additional error prevention settings
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
          },
          mfa: {
            noPromptOnMfaRequired: false,
          },
        }}
      >
        {children}
      </PrivyProvider>
    </PrivyErrorBoundary>
  );
}
