# League Of Nads - Football Manager Game

A mini football manager game that integrates with Monad Games ID. Players choose strategic parameters before each match, simulate games using Poisson distribution, and compete on a global leaderboard.

## 🎮 Game Features

- **Monad Games ID Integration**: Login with your Monad Games ID wallet
- **Strategic Gameplay**: Choose from 10 different parameters that affect match outcomes
- **Realistic Simulation**: Uses Poisson distribution for goal scoring
- **Global Leaderboard**: Compete with players worldwide
- **On-Chain Stats**: All player data stored on Monad blockchain
- **Beautiful UI**: Modern, responsive design with Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Monad Games ID wallet
- Privy App ID (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd forward-race
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
       ```env
    # Privy Configuration
    NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
    
    # Blockchain Configuration
    WALLET_PRIVATE_KEY=your_wallet_private_key_here
    GAME_WALLET_ADDRESS=your_game_wallet_address_here
    
    # Monad Games ID Contract
    NEXT_PUBLIC_CONTRACT_ADDRESS=0xceCBFF203C8B6044F52CE23D914A1bfD997541A4
    ```

4. **Get your Privy App ID**
   - Go to [Privy Console](https://console.privy.io/)
   - Create a new app
   - Copy your App ID to `NEXT_PUBLIC_PRIVY_APP_ID`

5. **Enable Monad Games ID in Privy Dashboard**
   - In your Privy app settings, go to "Wallets" section
   - Enable "Global Wallets"
   - Add the Monad Games ID Cross App ID: `cmd8euall0037le0my79qpz42`
   - Save your changes

6. **Register your game with Monad Games ID**
   - Visit the contract explorer: https://testnet.monadexplorer.com/address/0xceCBFF203C8B6044F52CE23D914A1bfD997541A4?tab=Contract
   - Connect your wallet and call the `registerGame` function with:
     - `_game`: Your game's wallet address (the one that will submit scores)
     - `_name`: "League Of Nads"
     - `_image`: "https://forward-race.vercel.app/logo.png"
     - `_url`: "https://forward-race.vercel.app"

7. **Set up your wallet private key**
   - Create a wallet for server-side transactions
   - Add the private key to `WALLET_PRIVATE_KEY`
   - ⚠️ **Never commit this to version control!**

8. **Run the development server**
   ```bash
   npm run dev
   ```

9. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How to Play

### 1. Connect Your Wallet
- Click "Connect Wallet & Start Playing"
- Sign in with your Monad Games ID wallet

### 2. Choose Your Strategy
Before each match, select your tactical approach:

- **Formation**: 4-3-3, 4-4-2, 3-5-2, etc.
- **Play Style**: Possession, Counter-Attack, Direct, etc.
- **Pressing**: High Press, Mid Press, Low Press, etc.
- **Tempo**: Very Fast, Fast, Normal, Slow, Very Slow
- **Training Focus**: Finishing, Speed, Strength, etc.
- **Motivation Speech**: Aggressive, Calm, Confident, etc.
- **Captain Choice**: Leader, Playmaker, Striker, etc.
- **Weather Adaptation**: Sunny, Rainy, Windy, etc.
- **Field Type**: Grass, Artificial, Indoor, etc.
- **Special Card**: Golden Boot, Speed Boost, etc.

### 3. Simulate the Match
- Click "Start Match Simulation"
- Watch as your choices influence the outcome
- See how many goals you score!

### 4. Track Your Progress
- View your personal statistics
- Check the global leaderboard
- Improve your efficiency over time

## 🏗️ Technical Architecture

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Privy**: Web3 authentication

### Backend
- **Next.js API Routes**: Server-side API endpoints
- **Viem**: Ethereum client for blockchain interaction
- **Monad Testnet**: Blockchain network

### Game Logic
- **Poisson Distribution**: Realistic goal scoring simulation
- **Strategy Multipliers**: 10 parameters affecting match outcomes
- **Efficiency System**: Historical performance affects future matches

### Blockchain Integration
- **Monad Games ID Contract**: On-chain player data storage
- **updatePlayerData**: Function to update scores and match counts
- **totalScoreOfPlayer**: Read total goals scored
- **totalTransactionsOfPlayer**: Read total matches played

## 📊 Game Mechanics

### Goal Scoring Simulation
The game uses a Poisson distribution with parameter λ (lambda):

```
λ = Base Rate (0.5) × Strategy Multiplier × Efficiency Bonus
```

### Strategy Impact
Each of the 10 strategic choices provides a multiplier:
- **Positive**: 1.1x to 1.4x (improves scoring)
- **Neutral**: 1.0x (no effect)
- **Negative**: 0.6x to 0.9x (reduces scoring)

### Efficiency System
Player efficiency affects future matches:
```
Efficiency = Total Goals ÷ Total Matches
Efficiency Bonus = 0.8 + (Efficiency × 0.4)
```

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── GameInterface.tsx
│   ├── LoginScreen.tsx
│   ├── StrategyForm.tsx
│   ├── MatchResult.tsx
│   ├── Leaderboard.tsx
│   └── PlayerStats.tsx
├── lib/               # Utility libraries
│   ├── auth.ts        # Authentication utilities
│   ├── blockchain.ts  # Blockchain interaction
│   ├── gameEngine.ts  # Game simulation logic
│   └── gameState.ts   # State management
└── types/             # TypeScript type definitions
    └── game.ts        # Game-related types
```

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
Make sure to set these in your deployment platform:
- `NEXT_PUBLIC_PRIVY_APP_ID`
- `WALLET_PRIVATE_KEY`
- `NEXT_PUBLIC_CONTRACT_ADDRESS`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify your environment variables are set correctly
3. Ensure you have sufficient funds in your wallet for transactions
4. Check that the Monad Games ID contract is accessible

## 🎉 Acknowledgments

- Monad Games ID team for the smart contract
- Privy for authentication infrastructure
- Viem for blockchain interaction utilities
- Next.js team for the amazing framework
