# VPNL: Verifiable Performance Network Layer

## Project Overview

VPNL is an open-source reputation infrastructure for the Open Intents Framework. This Replit environment is configured for Solidity smart contract development, testing, and demonstration.

## Project Structure

```
vpnl/
├── contracts/          # Solidity smart contracts
│   └── VPNLRegistry.sol
├── test/              # Hardhat test suite  
│   └── VPNLRegistry.test.js
├── scripts/           # Deployment and utility scripts
│   ├── deploy.js
│   ├── populate-testdata.js
│   └── verify-setup.js
├── demo/              # Frontend demo application (auto-runs on port 5000)
│   └── src/
├── docs/              # Architecture documentation
└── schemas/           # W3C VC schemas
```

## Quick Start

### 1. Run Tests

```bash
npm test
```

All 17 tests should pass, covering:
- Contract deployment
- Verification lifecycle
- Access control
- Expiration handling
- Revocation handling

### 2. View Demo Frontend

The demo frontend is automatically running on port 5000 in the webview. It provides an interface to:
- Connect to a local Hardhat node
- Query solver verifications
- View test solver data
- Test custom addresses

**Note:** The demo requires a running Hardhat node with deployed contracts. To use it:

1. The frontend is already running (configured in workflow)
2. Open a new shell tab and run: `npx hardhat node`
3. In another shell tab, deploy: `npx hardhat run scripts/deploy.js --network localhost`
4. Refresh the webview to interact with the deployed contract

### 3. Compile Contracts

```bash
npm run compile
```

## Development Workflow

### Testing Changes

After modifying the smart contract:

```bash
npm run compile
npm test
```

### Local Development

1. Start a local Hardhat node (simulates blockchain)
2. Deploy contracts to the local node
3. Use the demo frontend to interact with contracts
4. Run tests to verify functionality

## Deployment (Testnet)

For deploying to Arbitrum Sepolia testnet:

1. Copy `.env.example` to `.env`
2. Add your `PRIVATE_KEY` (KEEP the 0x prefix!) and `ETHERSCAN_API_KEY`
3. Get testnet ETH from https://faucet.quicknode.com/arbitrum/sepolia
4. Run: `npm run deploy:sepolia`
5. Create test data: `npm run populate:testdata`

See `SETUP.md` for complete deployment guide.

## Environment Configuration

This project uses Hardhat for Ethereum development:

- **Solidity Version:** 0.8.20
- **Testing Framework:** Hardhat with Chai (JavaScript tests)
- **Network:** Arbitrum (mainnet & testnet)
- **Package Manager:** npm
- **Frontend:** Vite + TypeScript + ethers.js v6

## Architecture

VPNL Registry provides:
- **Zero-PII verification**: Cryptographic commitments only
- **Portable credentials**: W3C Verifiable Credentials
- **Risk-adjusted routing**: Score-based collateral requirements
- **Decentralized validation**: DIA Lumina integration (Phase 2)

See `docs/architecture.md` for detailed design.

## Available Commands

```bash
npm run compile          # Compile smart contracts
npm test                 # Run test suite
npm run verify:setup     # Pre-deployment environment check
npm run deploy:sepolia   # Deploy to Arbitrum Sepolia
npm run populate:testdata # Create test verifications
npm run demo             # Run frontend demo (auto-started)
```

## Tech Stack

- **Smart Contracts:** Solidity 0.8.20
- **Development:** Hardhat 2.19+
- **Testing:** Hardhat Network Helpers, Chai
- **Frontend:** Vite, TypeScript, ethers.js v6
- **Deployment:** Arbitrum (L2), Etherscan verification

## Resources

- **Full Setup Guide:** `SETUP.md`
- **Deployment Checklist:** `DEPLOYMENT_CHECKLIST.md`
- **Quick Deploy:** `QUICK_DEPLOY.md`
- **Architecture Docs:** `docs/architecture.md`
- **Website:** https://vpnl.io
- **Telegram:** https://t.me/vpnlnetwork

## Recent Changes

**January 2025:**
- Converted to JavaScript-based Hardhat config
- Added Etherscan API V2 verification support
- Created comprehensive deployment scripts
- Built interactive demo frontend
- Configured for Replit environment

## License

MIT License - See LICENSE file for details

## Support

For questions or issues:
1. Check documentation in `docs/` and setup guides
2. Review test files for usage examples
3. Join Telegram community: https://t.me/vpnlnetwork

---

**Current Status:** Development & Testing Phase
**Next Milestone:** Arbitrum Sepolia deployment
**Target:** Phase 1 - Infrastructure & Audit (Q4 2025 - Q1 2026)
