import { createWalletClient, http, defineChain } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

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

// Extended contract ABI including registerGame function
export const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_game",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_image",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_url",
        "type": "string"
      }
    ],
    "name": "registerGame",
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

// Function to register the game
export async function registerGame(
  gameAddress: string,
  privateKey: string
) {
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  
  const walletClient = createWalletClient({
    account,
    chain: monadTestnet,
    transport: http('https://testnet-rpc.monad.xyz')
  });

  try {
    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'registerGame',
      args: [
        gameAddress as `0x${string}`,
        'League Of Nads',
        'https://forward-race.vercel.app/logo.png',
        'https://forward-race.vercel.app'
      ]
    });

    return {
      success: true,
      transactionHash: hash,
      gameAddress,
      gameName: 'League Of Nads'
    };
  } catch (error) {
    console.error('Error registering game:', error);
    throw new Error('Failed to register game on blockchain');
  }
}

// Instructions for manual registration
export const REGISTRATION_INSTRUCTIONS = `
To register League Of Nads with Monad Games ID:

1. Visit the contract explorer:
   https://testnet.monadexplorer.com/address/0xceCBFF203C8B6044F52CE23D914A1bfD997541A4?tab=Contract

2. Connect your wallet and call the registerGame function with:
   - _game: Your game's wallet address (the one that will submit scores)
   - _name: "League Of Nads"
   - _image: "https://forward-race.vercel.app/logo.png"
   - _url: "https://forward-race.vercel.app"

3. After registration, update your .env.local with:
   GAME_WALLET_ADDRESS=your_game_wallet_address
   WALLET_PRIVATE_KEY=your_game_wallet_private_key
`;
