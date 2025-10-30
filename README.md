# Resume DApp

An on-chain professional resume application built on Base blockchain. Store your work experience, education, skills, and projects permanently on-chain.

## Features

- **Work Experience**: Document your career journey with company, position, dates, and descriptions
- **Education**: Store your academic achievements with institution, degree, field, and graduation year
- **Skills**: List your skills and get endorsed by others in the community
- **Projects**: Showcase your work with titles, descriptions, and links
- **Entry Fee**: Only 0.0000001 ETH per entry for ultra-low-cost storage
- **Dark Mode**: Sleek dark UI built with Tailwind CSS
- **WalletConnect**: Connect with any Web3 wallet via WalletConnect v2

## Tech Stack

- **Frontend**: Next.js 15, React 19
- **Styling**: Tailwind CSS (dark mode)
- **Web3**: Wagmi v2, Viem, Web3Modal v5
- **Smart Contract**: Solidity 0.8.27
- **Blockchain**: Base mainnet
- **Development**: Hardhat

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- MetaMask or any Web3 wallet

### Installation

1. Clone the repository
```bash
git clone https://github.com/winsznx/resume.git
cd resume
```

2. Install dependencies
```bash
pnpm install
```

3. Create `.env.local` file
```bash
NEXT_PUBLIC_PROJECT_ID=your_walletconnect_project_id
```

Get your Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)

4. Run development server
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Smart Contract Deployment

### Setup

1. Navigate to contract directory
```bash
cd contract
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```bash
PRIVATE_KEY=your_private_key
BASESCAN_API_KEY=your_basescan_api_key
```

### Deploy

```bash
npm run compile
npx hardhat run scripts/deploy.js --network base
```

### Verify

```bash
npx hardhat verify --network base <CONTRACT_ADDRESS>
```

### Update Contract Address

After deployment, update the contract address in `app/contracts/Resume.js`:

```javascript
export const CONTRACT_ADDRESS = "0xYourContractAddress"
```

## Contract Details

- **Entry Fee**: 0.0000001 ETH per entry
- **Network**: Base mainnet (Chain ID: 8453)
- **Functions**:
  - `addWorkExperience()` - Add work entry
  - `addEducation()` - Add education entry
  - `addSkill()` - Add skill
  - `endorseSkill()` - Endorse someone's skill
  - `addProject()` - Add project

## Project Structure

```
resume/
├── app/
│   ├── components/
│   │   ├── WorkSection.jsx
│   │   ├── EducationSection.jsx
│   │   ├── SkillsSection.jsx
│   │   └── ProjectsSection.jsx
│   ├── context/
│   │   └── Web3Modal.jsx
│   ├── contracts/
│   │   └── Resume.js
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── contract/
│   ├── contracts/
│   │   └── Resume.sol
│   ├── scripts/
│   │   └── deploy.js
│   └── hardhat.config.js
├── package.json
└── README.md
```

## License

MIT

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
