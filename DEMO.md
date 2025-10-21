# VPNL Demo Documentation

## Live Testnet Demo

**Demo:** https://e6162db1-34bf-4ac3-8737-d269bcf54999-00-1reolrpr7gf4l.riker.replit.dev
**Contract:** 0xD3Acf580A28977D24da7d20364A2F557606d439A
**Network:** Arbitrum Sepolia (Chain 421614)
**Explorer:** https://sepolia.arbiscan.io/address/0xD3Acf580A28977D24da7d20364A2F557606d439A

### Features Demonstrated
- ✅ On-chain reputation registry
- ✅ Real-time blockchain queries
- ✅ Solver verification system (4 test addresses)
- ✅ Professional blockchain explorer UI
- ✅ Query interface for any address

### Test Solvers

The demo includes four pre-verified test addresses with different reputation tiers:

1. **Expert Solver** (0.92 score)
2. **Advanced Solver** (0.68 score)
3. **Emerging Solver** (0.34 score)
4. **Unverified Solver** (no verification)

### How to Use the Demo

1. **View Verified Solvers**: The homepage displays all four test solvers with their reputation scores and tiers
2. **Query Any Address**: Use the search interface to check the verification status of any Ethereum address
3. **Explore Contract**: Click the Arbiscan link to view the deployed smart contract on the block explorer
4. **Understand Tiers**: See how reputation scores map to risk tiers and suggested collateral requirements

### Technical Details

**Frontend:**
- React + TypeScript + Vite
- Ethers.js v6 for blockchain interaction
- Real-time RPC queries to Arbitrum Sepolia

**Smart Contract:**
- Deployed on Arbitrum Sepolia testnet
- VPNLRegistry.sol - manages solver verifications
- Stores cryptographic commitments (zero PII)

### Next Steps

After exploring the demo:
1. Review the [Architecture Documentation](docs/architecture.md)
2. Check the [Integration Guide](docs/integration-guide.md) for protocol developers
3. Join our [Telegram community](https://t.me/vpnlnetwork)
4. Support the project on [Giveth](https://giveth.io/project/vpnl:-the-verifiable-performance-network-layer)
