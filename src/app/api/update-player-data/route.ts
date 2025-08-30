import { NextRequest, NextResponse } from 'next/server';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { defineChain } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI, isValidAddress } from '@/lib/blockchain';
import fs from 'fs';
import path from 'path';

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

// Function to track players for leaderboard
async function trackPlayer(playerAddress: string) {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const playersFile = path.join(dataDir, 'players.json');
    
    // Create data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    let players: string[] = [];
    
    // Read existing players if file exists
    if (fs.existsSync(playersFile)) {
      const data = fs.readFileSync(playersFile, 'utf8');
      players = JSON.parse(data);
    }
    
    // Add player if not already tracked (case-insensitive)
    const normalizedAddress = playerAddress.toLowerCase();
    if (!players.some(addr => addr.toLowerCase() === normalizedAddress)) {
      players.push(normalizedAddress);
      fs.writeFileSync(playersFile, JSON.stringify(players, null, 2));
      console.log('Added new player to tracking:', normalizedAddress);
    }
  } catch (error) {
    console.error('Error tracking player:', error);
    // Don't fail the main operation if player tracking fails
  }
}

export async function POST(request: NextRequest) {
  console.log('=== UPDATE PLAYER DATA API CALLED ===');
  try {
    // Parse request body
    const { playerAddress, scoreAmount, transactionAmount } = await request.json();
    console.log('Request data:', { playerAddress, scoreAmount, transactionAmount });

    // Validate input
    if (!playerAddress || scoreAmount === undefined || transactionAmount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: playerAddress, scoreAmount, transactionAmount' },
        { status: 400 }
      );
    }

    // Validate player address format
    if (!isValidAddress(playerAddress)) {
      return NextResponse.json(
        { error: 'Invalid player address format' },
        { status: 400 }
      );
    }

    // Validate that scoreAmount and transactionAmount are positive numbers
    if (scoreAmount < 0 || transactionAmount < 0) {
      return NextResponse.json(
        { error: 'Score and transaction amounts must be non-negative' },
        { status: 400 }
      );
    }

    // Get private key from environment variable
    const privateKey = process.env.WALLET_PRIVATE_KEY;
    console.log('Private key check:', privateKey ? 'WALLET_PRIVATE_KEY is set' : 'WALLET_PRIVATE_KEY is NOT set');
    if (!privateKey) {
      console.error('WALLET_PRIVATE_KEY environment variable not set');
      return NextResponse.json(
        { error: 'Server configuration error: WALLET_PRIVATE_KEY not set' },
        { status: 500 }
      );
    }

    // Create account from private key
    const account = privateKeyToAccount(privateKey as `0x${string}`);

    // Create wallet client
    const walletClient = createWalletClient({
      account,
      chain: monadTestnet,
      transport: http('https://testnet-rpc.monad.xyz')
    });

    // Call the updatePlayerData function
    console.log('Calling updatePlayerData contract function...');
    console.log('Contract address:', CONTRACT_ADDRESS);
    console.log('Function args:', {
      playerAddress,
      scoreAmount: BigInt(scoreAmount),
      transactionAmount: BigInt(transactionAmount)
    });
    
    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'updatePlayerData',
      args: [
        playerAddress as `0x${string}`,
        BigInt(scoreAmount),
        BigInt(transactionAmount)
      ]
    });

    console.log('Transaction hash:', hash);
    
    // Track this player for leaderboard
    await trackPlayer(playerAddress);
    
    return NextResponse.json({
      success: true,
      transactionHash: hash,
      message: 'Player data updated successfully'
    });

  } catch (error) {
    console.error('Error updating player data:', error);
    
    // Handle specific viem errors
    if (error instanceof Error) {
      if (error.message.includes('insufficient funds')) {
        return NextResponse.json(
          { error: 'Insufficient funds to complete transaction' },
          { status: 400 }
        );
      }
      if (error.message.includes('execution reverted')) {
        return NextResponse.json(
          { error: 'Contract execution failed - check if wallet has GAME_ROLE permission' },
          { status: 400 }
        );
      }
      if (error.message.includes('AccessControlUnauthorizedAccount')) {
        return NextResponse.json(
          { error: 'Unauthorized: Wallet does not have GAME_ROLE permission' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to update player data' },
      { status: 500 }
    );
  }
}
