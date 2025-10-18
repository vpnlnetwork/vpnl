# VPNL: The Verifiable Performance Network Layer

### 🛡️ Open Reputation Standards for the Open Intents Framework

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built for Ethereum](https://img.shields.io/badge/Built%20for-Ethereum-3C3C3D.svg)]()
[![Public Goods](https://img.shields.io/badge/Public%20Goods-%F0%9F%8C%8D-green)]()

---

## Overview

**VPNL** provides open data schemas that enable **risk-adjusted routing** for intent-based protocols.  
We're building **W3C Verifiable Credential standards** and **on-chain registry infrastructure** that let protocols verify solver performance without centralized gatekeepers.

---

## The Problem

The Open Intents Framework (OIF) faces an impossible trilemma without reputation infrastructure:

- ❌ **Centralized allowlists** (defeats permissionlessness)  
- ❌ **Massive overcollateralization** (kills capital efficiency)  
- ❌ **Unacceptable risk exposure** (endangers users)

---

## The Solution

**VPNL** resolves this by providing:

- 🧩 **Open Data Schema:** W3C Verifiable Credentials for portable solver reputation  
- 🔗 **On-Chain Registry:** EAS attestations with cryptographic commitments (zero PII)  
- ⚖️ **Risk-Adjusted Routing:** Protocols query reputation and adjust collateral dynamically  

**Example:**

| Solver | Score | Collateral | Routing Access |
|--------|--------|-------------|----------------|
| **Solver A** | 0.85 (Expert) | $15k | Priority |
| **Solver B** | — (Unverified) | $100k | Limited or rejected |

**Result:** ✅ Permissionless + ✅ Safe + ✅ Capital Efficient

---

## Economic Impact

### Capital Efficiency Model

**100 Solvers Without VPNL:**
- All post 100% collateral  
- 100 × $100k = **$10M locked**

**100 Solvers With VPNL (Risk-Adjusted):**
- 30 experts (score ≥0.80): $15k each = $450k  
- 40 advanced (score 0.60–0.79): $50k each = $2M  
- 30 emerging (score ~0.30): $76k each = $2.28M  
- **Total:** $4.73M locked  

**Impact:** 💡 $5.27M freed — **53% more capital efficient**

*Note: Conservative real-world estimate adjusts to ~45% accounting for verification overhead and safety buffers.*

---

## Architecture

### Three-Layer Design

```
┌─────────────────────────────────────────────────┐
│   Layer 1: Off-Chain Verification              │
│   - Connect exchange APIs (CEX/DEX)            │
│   - Verify historical PnL                      │
│   - Generate cryptographic commitment          │
│     commitment = H(score || salt || metadata)  │
└─────────────────────────────────────────────────┘
↓
┌─────────────────────────────────────────────────┐
│   Layer 2: On-Chain Registry (Arbitrum)        │
│   - Store commitment hash (zero PII)           │
│   - Track verification timestamp               │
│   - Manage active/revoked status               │
│   - Emit events for indexing                   │
└─────────────────────────────────────────────────┘
↓
┌─────────────────────────────────────────────────┐
│   Layer 3: Portable Credentials                 │
│   - Issue W3C Verifiable Credential             │
│   - Solver stores in wallet                     │
│   - Present to any protocol                     │
│   - Optional: EAS attestation                   │
└─────────────────────────────────────────────────┘
```

---

## Key Features

- 🎯 **Purpose-Built for PnL Verification**  
  Not generic reputation—specifically for trading performance calibration.

- 🔓 **Open Standards**  
  W3C Verifiable Credentials + EAS attestations = transparent, auditable.

- 🔐 **Privacy-First**  
  Zero PII on-chain, cryptographic commitments, and future ZK threshold proofs.

- 🌐 **Protocol-Agnostic**  
  One verification works across *all* OIF protocols.

- 🏛️ **Credibly Neutral**  
  Progressive decentralization: Founder → Multisig → DAO.

---

## Roadmap

| Phase | Timeline | Objective | Funding | Deliverables |
|-------|----------|-----------|---------|--------------|
| **1. Infrastructure & Audit** | Q4 2025 - Q1 2026 (30-45 days) | Secure foundational trust | $15k | Smart contract audit, Arbitrum deployment, public subgraph, API, 2–3 protocol integrations |
| **2. Privacy & Governance** | Q1-Q2 2026 (60-90 days) | Secure neutrality and scalability | $20k | ZK threshold proofs, 3-of-5 multisig upgrade, dispute resolution, enhanced schemas |
| **3. Ecosystem Growth** | Q2-Q3 2026 (90-120 days) | Achieve adoption and validation | $10k | Developer SDK, 5+ integrations, DAO module, analytics dashboard |

---

## Repository Structure

```
vpnl/
├── contracts/          # Solidity smart contracts
│   ├── VPNLRegistry.sol
│   └── interfaces/
├── schemas/            # W3C VC schemas
│   ├── solver-reputation.json
│   └── verification-proof.json
├── subgraph/           # The Graph indexing
│   ├── schema.graphql
│   └── mappings/
├── sdk/                # Developer SDK (TypeScript)
│   └── src/
├── docs/               # Documentation
│   ├── architecture.md
│   ├── integration-guide.md
│   └── api-reference.md
└── examples/           # Integration examples
```

---

## Quick Start

### Current Development Stage

**✅ Available Now:**
- Smart contract (`VPNLRegistry.sol`) - functional and testable
- W3C VC schemas - defined and documented
- Architecture documentation - comprehensive specs

**🚧 In Development (Phase 1 - $15k funding goal):**
- TypeScript SDK for easy integration
- The Graph subgraph for fast queries
- REST API for developer access
- Production deployment on Arbitrum

---

### For Protocols: Direct Smart Contract Integration

Until the SDK is released, protocols can integrate directly with the registry:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IVPNLRegistry {
    function isVerified(address solver) external view returns (bool);
    function getVerification(address solver) external view returns (
        bytes32 commitmentHash,
        uint256 verifiedAt,
        uint256 expiresAt,
        bool active,
        bool revoked
    );
}

contract YourProtocol {
    IVPNLRegistry public vpnlRegistry;
    
    constructor(address _vpnlRegistry) {
        vpnlRegistry = IVPNLRegistry(_vpnlRegistry);
    }
    
    function calculateCollateral(
        address solver,
        uint256 intentValue
    ) public view returns (uint256) {
        // Check if solver is verified
        if (!vpnlRegistry.isVerified(solver)) {
            return intentValue; // Unverified: 100% collateral
        }
        
        // Verified solvers can use reduced collateral
        // (Actual score-based calculation requires off-chain data)
        return intentValue * 15 / 100; // Example: 15% for verified
    }
}
```

**After Phase 1 funding, the SDK will simplify this to:**

```typescript
// Coming soon: Simple SDK integration
import { VPNLClient } from '@vpnl/sdk';

const vpnl = new VPNLClient({
  network: 'arbitrum',
  registryAddress: '0x...'
});

const reputation = await vpnl.getReputation(solverAddress);
const collateral = reputation.score >= 0.80 
  ? intentValue * 0.15  // Expert: 15%
  : intentValue;        // Unverified: 100%
```

---

### For Solvers: Getting Verified

**Verification Process (launches with Phase 1):**

1. **Connect Exchange** - Link your trading account via secure OAuth
2. **Generate Proof** - System analyzes historical performance
3. **Submit for Review** - Cryptographic commitment created
4. **Receive Credential** - W3C Verifiable Credential issued to your wallet
5. **Present to Protocols** - Use credential for reduced collateral requirements

**Want early access?** Join our [Telegram community](https://t.me/vpnlnetwork) to be notified when verification opens.

---

### For Contributors: Getting Started

Help build the foundation:

```bash
# Clone the repository
git clone https://github.com/vpnlnetwork/vpnl.git
cd vpnl

# Install dependencies
npm install

# Run smart contract tests
npx hardhat test

# Deploy to testnet (coming soon)
npx hardhat run scripts/deploy.js --network arbitrum-sepolia
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

---

## Technical Specs

**Smart Contracts**

* Chain: Arbitrum (EVM-compatible L2)
* Language: Solidity 0.8.x
* Standards: EAS attestations, W3C VCs

**Verification Schemas**

* Format: W3C Verifiable Credentials 2.0
* Signature: ECDSA (secp256k1)
* Commitment: Keccak256(score || salt || context)

**API** *(Phase 1 deliverable)*
* Endpoint: `api.vpnl.network`
* Methods: `GET /reputation/{address}`, `POST /verify`
* Auth: Public read, authenticated write

---

## Why This Must Be Public Goods

Reputation infrastructure is too critical to be:

* ❌ Owned by a single protocol (centralization risk)
* ❌ Proprietary scoring (trust black box)
* ❌ Non-portable (siloed per protocol)

**VPNL is credibly neutral infrastructure:**

* ✅ Open standards (anyone can implement)
* ✅ Open source (MIT license)
* ✅ Open access (no fees, no gatekeeping)

---

## Current Status

✅ Prototype architecture complete  
🎯 Seeking funding: [Giveth GG24](https://giveth.io/project/vpnl:-the-verifiable-performance-network-layer)  
🚧 Next milestone: Security audit + mainnet deployment (Q4 2025 - Q1 2026)

---

## Support This Project

We're raising funds on **Giveth GG24 (Interop Standards, Infrastructure & Analytics)**:

👉 [**Donate on Giveth →**](https://giveth.io/project/vpnl:-the-verifiable-performance-network-layer)

Every dollar builds open infrastructure that *any protocol* can use.

---

## Contributing

VPNL is open source and welcomes contributions:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

See `CONTRIBUTING.md` for detailed guidelines.

---

## Resources

* 🌐 Website: [vpnl.io](https://vpnl.io)
* 📚 Documentation: `docs.vpnl.io` *(coming soon)*
* 💬 Telegram: [t.me/vpnlnetwork](https://t.me/vpnlnetwork)
* 📄 Whitepaper: [docs/whitepaper.md](docs/whitepaper.md)

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

Built for the **Open Intents Framework** ecosystem:

* [Ethereum Foundation](https://ethereum.foundation)
* [Hyperlane](https://hyperlane.xyz)
* [LI.FI](https://li.fi)
* [OpenZeppelin](https://www.openzeppelin.com)
* [Across Protocol](https://across.to)
* [Everclear](https://everclear.network)
* [Nomial](https://nomial.xyz)

---

**VPNL:** Open standards for solver reputation.  
Enabling permissionless intent routing at scale.
