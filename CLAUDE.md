# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

Resume DApp is an on-chain professional resume application built on Base blockchain. Users connect their Web3 wallets to:
- Add work experience entries (company, position, dates, description)
- Store education records (institution, degree, field, graduation year)
- List skills and receive endorsements from other users
- Showcase projects with links

Entry fee: 0.0000001 ETH per entry stored on-chain.

## Architecture

### Web3 Stack
- **Web3ModalProvider** (app/context/Web3Modal.jsx): Configures Wagmi with Base chain, three connectors (injected, WalletConnect, Coinbase Wallet)
- **Contract Integration** (app/contracts/Resume.js): Exports `RESUME_ABI` and `CONTRACT_ADDRESS`
- **Main Page** (app/page.js): Fetches user data via `useReadContract` for all four sections

### Smart Contract (contract/contracts/Resume.sol)
**Structs**:
- WorkExperience: id, owner, company, position, description, startDate, endDate, current, timestamp, exists
- Education: id, owner, institution, degree, field, graduationYear, timestamp, exists
- Skill: id, owner, name, endorsements, timestamp, exists
- Project: id, owner, title, description, link, timestamp, exists

**Key Functions**:
- `addWorkExperience()` - Requires fee payment, stores work entry
- `addEducation()` - Requires fee payment, stores education entry
- `addSkill()` - Requires fee payment, stores skill
- `endorseSkill()` - Free, increments endorsement counter (prevents duplicates and self-endorsement)
- `addProject()` - Requires fee payment, stores project

**View Functions**:
- `getUserWorkExperiences(address)`
- `getUserEducations(address)`
- `getUserSkills(address)`
- `getUserProjects(address)`

### Components Structure

Each section component (WorkSection, EducationSection, SkillsSection, ProjectsSection) follows this pattern:
1. Toggle form visibility with button
2. Form with validation and transaction states (isPending, isConfirming, isSuccess)
3. Submit with `writeContract()` and entry fee
4. Display entries in reverse chronological order
5. Auto-refetch all data on successful transaction

### Development Commands

**Frontend**:
```bash
pnpm dev          # Start Next.js dev server (localhost:3000)
pnpm build        # Build for production
pnpm start        # Start production server
```

**Contract**:
```bash
cd contract
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network base
npx hardhat verify --network base <ADDRESS>
```

### Environment Variables

**Frontend (.env.local)**:
- `NEXT_PUBLIC_PROJECT_ID` - WalletConnect Cloud project ID

**Contract (contract/.env)**:
- `PRIVATE_KEY` - Deployer wallet private key
- `BASESCAN_API_KEY` - For contract verification

## Key Constraints

- Base mainnet only (chainId 8453)
- Entry fee: 0.0000001 ETH per entry
- No editing of entries (permanent on-chain storage)
- Skills can be endorsed by anyone except owner
- Dark mode only
- All data fetched from blockchain, no backend

## Design Patterns

- **Hydration Safety**: All components use `mounted` state to prevent hydration mismatches
- **Transaction Flow**: isPending (wallet) → isConfirming (blockchain) → isSuccess → refetch all data
- **Entry Display**: Entries reversed in frontend to show newest first
- **Form Reset**: Auto-clear and close forms after successful transaction
- **Error Handling**: Require statements in contract validate all inputs

## Deployment

After deploying contract, update `CONTRACT_ADDRESS` in `app/contracts/Resume.js`.

Contract is immediately usable after deployment (no initialization required).
