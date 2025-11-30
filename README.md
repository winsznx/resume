# Resume DApp - Enhanced Version 2.0

An advanced on-chain professional resume application built on Base blockchain with TypeScript, comprehensive form validation, and premium UX features.

## 🎯 New Features in v2.0

### Smart Contract Improvements
- ✅ **Gas optimized** with unchecked blocks and custom errors (-100-200 gas per transaction)
- ✅ **Delete functionality** for all entry types  
- ✅ **Advanced validation** (date logic, graduation years, input sanitization)
- ✅ **Secure withdraw** using call() instead of transfer()
- ✅ **Custom errors** for better debugging and gas savings

### Frontend Enhancements
- ✅ **TypeScript support** for better type safety
- ✅ **Confirmation modals** before all transactions
- ✅ **Form validation** with real-time error messages
- ✅ **Delete confirmations** with warning UI
- ✅ **Better error handling** with user-friendly messages
- ✅ **Loading states** with spinners and animations
- ✅ **Hover-reveal delete** buttons
- ✅ **Smooth animations** (fadeIn, scaleIn, slideUp)
- ✅ **URL validation** for project links
- ✅ **Mobile responsive** improvements

## 🚀 Features

- **Work Experience**: Document your career with validation for dates
- **Education**: Store academic achievements with year validation
- **Skills**: List skills and get endorsed by others (cannot endorse your own)
- **Projects**: Showcase work with optional links (URL validated)
- **Delete Entries**: Remove entries you no longer want displayed
- **Entry Fee**: Only 0.0000001 ETH per entry
- **Dark Mode**: Premium dark UI with smooth animations
- **WalletConnect**: Connect with any Web3 wallet

## 📦 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript 5
- **Styling**: Tailwind CSS (dark mode + animations)
- **Web3**: Wagmi v2, Viem, Web3Modal v5
- **Smart Contract**: Solidity 0.8.27 (gas optimized)
- **Blockchain**: Base mainnet
- **Development**: Hardhat

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- MetaMask or any Web3 wallet
- Base network added to your wallet

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/winsznx/resume.git
cd resume
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Create `.env.local` file**
```bash
NEXT_PUBLIC_PROJECT_ID=your_walletconnect_project_id
```

Get your Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)

4. **Run development server**
```bash
pnpm dev
```

5. **Open** [http://localhost:3000](http://localhost:3000)

## 📝 Smart Contract Deployment

### Setup

1. **Navigate to contract directory**
```bash
cd contract
```

2. **Install dependencies**
```bash
npm install
```

3 **Create `.env` file in contract directory**
```bash
PRIVATE_KEY=your_private_key_here
BASESCAN_API_KEY=your_basescan_api_key
```

⚠️ **Security Warning**: Never commit your `.env` file! It's already in `.gitignore`.

### Deploy to Base Mainnet

```bash
# Compile the contract
npm run compile

# Deploy to Base
npx hardhat run scripts/deploy.js --network base

# Note the deployed contract address from the output
```

### Verify on BaseScan

```bash
npx hardhat verify --network base <CONTRACT_ADDRESS>
```

### Update Frontend

After deployment, update the contract address in `app/contracts/Resume.js`:

```javascript
export const CONTRACT_ADDRESS = "0xYourDeployedContractAddress"
```

## 🎨 Key Improvements Over v1.0

### Security & Gas Efficiency
| Feature | v1.0 | v2.0 | Improvement |
|---------|------|------|-------------|
| Error Handling | require() strings | Custom errors | ~50 gas saved |
| Counter Increments | Normal | Unchecked blocks | ~20 gas saved |
| Withdraw Function | transfer() | call() | Smart wallet compatible |
| Input Validation | Basic | Comprehensive | Prevents invalid data |

### User Experience
| Feature | v1.0 | v2.0 |
|---------|------|------|
| Transaction Confirmation | ❌ Direct | ✅ Modal with fee display |
| Form Validation | ❌ Basic HTML | ✅ Real-time with errors |
| Error Messages | ❌ Generic | ✅ Specific & helpful |
| Delete Function | ❌ Not available | ✅ With confirmation |
| Loading States | ⚠️ Basic | ✅ With spinners & animations |
| Mobile Experience | ⚠️ Basic | ✅ Optimized |

## 📄 Contract Details

- **Contract Address**: Update after deployment
- **Entry Fee**: 0.0000001 ETH per entry
- **Network**: Base mainnet (Chain ID: 8453)
- **Functions**:
  - `addWorkExperience()` - Add work entry
  - `deleteWorkExperience()` - Remove work entry
  - `addEducation()` - Add education entry
  - `deleteEducation()` - Remove education entry
  - `addSkill()` - Add skill
  - `deleteSkill()` - Remove skill
  - `endorseSkill()` - Endorse someone's skill (not your own)
  - `addProject()` - Add project
  - `deleteProject()` - Remove project

## 🏗️ Project Structure

```
resume/
├── app/
│   ├── components/
│   │   ├── WorkSection.tsx          ✨ Enhanced with TypeScript
│   │   ├── EducationSection.tsx     ✨ Enhanced with TypeScript
│   │   ├── SkillsSection.tsx        ✨ Enhanced with TypeScript
│   │   ├── ProjectsSection.tsx      ✨ Enhanced with TypeScript
│   │   ├── ConfirmationModal.tsx    🆕 New component
│   │   ├── DeleteConfirmModal.tsx   🆕 New component
│   │   └── LoadingSpinner.jsx
│   ├── types/
│   │   └── index.ts                 🆕 TypeScript definitions
│   ├── context/
│   │   └── Web3Modal.jsx
│   ├── contracts/
│   │   └── Resume.js               ✨ Updated ABI
│   ├── globals.css                 ✨ Added animations
│   ├── layout.js
│   └── page.js
├── contract/
│   ├── contracts/
│   │   └── Resume.sol              ✨ Gas optimized
│   ├── scripts/
│   │   └── deploy.js
│   └── hardhat.config.js
├── package.json                    ✨ TypeScript dependencies
├── tsconfig.json                   🆕 TypeScript config
├── REFINEMENTS.md                  🆕 Detailed changelog
└── README.md                       ✨ Updated documentation
```

## 🧪 Testing

### Test Forms
1. Try submitting with empty fields → See validation errors
2. Try invalid dates (future, end before start) → See specific errors
3. Try adding a skill/project → See confirmation modal
4. Try deleting an entry → See delete confirmation

### Test Transactions
1. Connect wallet
2. Add an entry → Approve in modal → Confirm in wallet
3. Wait for confirmation → See success message
4. Refresh → Entry appears
5. Delete entry → Confirm → Entry disappears

## 🐛 Troubleshooting

### TypeScript/JSX Warnings
The lint warnings about JSX and imports are expected during development. Run:
```bash
pnpm install
```
to install TypeScript dependencies. The app will work correctly.

### Transaction Fails
- Check you have enough ETH for gas + entry fee
- Ensure you're connected to Base network
- Try increasing gas limit in wallet

### Contract Not Found
- Make sure you've updated `CONTRACT_ADDRESS` in `app/contracts/Resume.js`
- Verify you're on Base mainnet (Chain ID: 8453)

## 📊 Gas Costs (Approximate on Base)

| Action | Gas Used | Cost at 0.001 Gwei | USD at $3000/ETH |
|--------|----------|-------------------|------------------|
| Add Work | ~150k | ~0.00015 ETH | ~$0.45 |
| Add Education | ~120k | ~0.00012 ETH | ~$0.36 |
| Add Skill | ~80k | ~0.00008 ETH | ~$0.24 |
| Add Project | ~140k | ~0.00014 ETH | ~$0.42 |
| Delete Entry | ~50k | ~0.00005 ETH | ~$0.15 |
| Endorse Skill | ~60k | ~0.00006 ETH | ~$0.18 |

*Note: Actual costs vary with network congestion*

## 🤝 Contributing

Pull requests are welcome! For major changes:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

MIT License - see [LICENSE](LICENSE) file

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **Contract on BaseScan**: [Update after deployment]
- **Documentation**: See [REFINEMENTS.md](REFINEMENTS.md)

## 💡 Future Enhancements

- [ ] ENS name support
- [ ] IPFS integration for resume storage
- [ ] PDF export functionality
- [ ] Search for other users' resumes
- [ ] Analytics dashboard
- [ ] NFT certificates
- [ ] Multi-chain deployment

---

**Built with ❤️ on Base • Powered by WalletConnect**

*Last Updated: December 2025*
