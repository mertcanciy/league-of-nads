import { createPublicClient, http, defineChain } from 'viem';

// Define Monad testnet chain
const monadTestnet = defineChain({
  id: 10143,
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
});

// Contract configuration
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xceCBFF203C8B6044F52CE23D914A1bfD997541A4';

// Basic contract ABI for the functions we need
export const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "scoreAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "transactionAmount",
        "type": "uint256"
      }
    ],
    "name": "updatePlayerData",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "player",
        "type": "address"
      }
    ],
    "name": "totalScoreOfPlayer",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "player",
        "type": "address"
      }
    ],
    "name": "totalTransactionsOfPlayer",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "game",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "player",
        "type": "address"
      }
    ],
    "name": "playerDataPerGame",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Create public client for reading contract data
export const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http('https://testnet-rpc.monad.xyz')
});

// Helper function to validate Ethereum address
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Helper function to get player data from contract (global totals)
export async function getPlayerData(playerAddress: string) {
  if (!isValidAddress(playerAddress)) {
    throw new Error('Invalid player address');
  }

  try {
    const [totalScore, totalTransactions] = await Promise.all([
      publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'totalScoreOfPlayer',
        args: [playerAddress as `0x${string}`]
      }),
      publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'totalTransactionsOfPlayer',
        args: [playerAddress as `0x${string}`]
      })
    ]);

    return {
      totalScore: Number(totalScore),
      totalTransactions: Number(totalTransactions)
    };
  } catch (error) {
    console.error('Error reading player data:', error);
    throw new Error('Failed to read player data from contract');
  }
}

// Helper function to get player data for a specific game
export async function getPlayerDataPerGame(playerAddress: string, gameAddress: string) {
  if (!isValidAddress(playerAddress) || !isValidAddress(gameAddress)) {
    throw new Error('Invalid player or game address');
  }

  try {
    const result = await publicClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'playerDataPerGame',
      args: [gameAddress as `0x${string}`, playerAddress as `0x${string}`]
    });

    return {
      score: Number(result[0]),
      transactions: Number(result[1])
    };
  } catch (error) {
    console.error('Error reading player data per game:', error);
    throw new Error('Failed to read player data per game from contract');
  }
}
