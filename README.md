# VPNL: The Verifiable Performance Network Layer

**Open reputation standards for the Open Intents Framework**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stage: Prototype](https://img.shields.io/badge/Stage-Prototype-orange.svg)]()

## Overview

VPNL provides open data schemas that enable risk-adjusted routing for intent-based protocols. We're building W3C Verifiable Credential standards and on-chain registry infrastructure that lets protocols verify solver performance without centralized gatekeepers.

### The Problem

The Open Intents Framework faces an impossible trilemma without reputation infrastructure:

- **Centralized allowlists** (defeats permissionlessness)
- **Massive overcollateralization** (kills capital efficiency)  
- **Unacceptable risk exposure** (endangers users)

### The Solution

VPNL resolves this by providing:

- **Open Data Schema**: W3C Verifiable Credentials for portable solver reputation
- **On-Chain Registry**: EAS attestations with cryptographic commitments (zero PII)
- **Risk-Adjusted Routing**: Protocols query reputation, adjust collateral dynamically

**Example:**
- Solver A (Score 88, Expert): Posts $15k collateral, gets priority routing
- Solver B (No score): Must post $100k collateral OR rejected

**Result: Permissionless + Safe + Capital Efficient**

## Economic Impact

### Capital Efficiency Model

**100 Solvers Without VPNL:**
- All post 100% collateral
- 100 × $100k = **$10M locked**

**100 Solvers With VPNL (Risk-Adjusted):**
- 30 experts (score 80+): $15k each = $450k
- 40 advanced (score 60-79): $50k each = $2M
- 30 emerging (score <60): $100k each = $3M
- **Total: $5.45M locked**

**Impact: $4.55M freed (45% more efficient)**

## Architecture

### Three-Layer Design
```
┌─────────────────────────────────────────────────┐
│   Layer 1: Off-Chain Verification              │
│   - Connect exchange APIs (CEX/DEX)            │
│   - Verify historical PnL                       │
│   - Generate cryptographic commitment           │
│     commitment = H(score || salt || metadata)  │
└─────────────────────────────────────────────────┘
↓
┌─────────────────────────────────────────────────┐
│   Layer 2: On-Chain Registry (Arbitrum)        │
│   - Store commitment hash (zero PII)            │
│   - Track verification timestamp                │
│   - Manage active/revoked status                │
│   - Emit events for indexing                    │
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
## Key Features

🎯 **Purpose-Built for PnL Verification**  
Not generic reputation—specifically for trading performance calibration

🔓 **Open Standards**  
W3C Verifiable Credentials + EAS attestations = transparent, auditable

🔐 **Privacy-First**  
Zero PII on-chain, cryptographic commitments, ZK threshold proofs

🌐 **Protocol-Agnostic**  
One verification works across ALL OIF protocols

🏛️ **Credibly Neutral**  
Progressive decentralization: Founder → Multisig → DAO

## Roadmap

### Phase 1: Infrastructure & Audit ($15k | 30-45 days)
- [ ] Smart contract security audit
- [ ] Arbitrum mainnet deployment
- [ ] Public subgraph for indexing
- [ ] Production API with SLA
- [ ] 2-3 protocol integrations

### Phase 2: Privacy & Governance ($20k | 60-90 days)
- [ ] Zero-knowledge threshold proofs
- [ ] Multi-sig upgrade (3-of-5)
- [ ] Dispute & appeals flow
- [ ] Enhanced schemas (CEX + DEX)

### Phase 3: Ecosystem Growth ($10k | 90-120 days)
- [ ] Developer SDK + docs
- [ ] 5+ protocol integrations
- [ ] DAO governance module
- [ ] Public analytics dashboard

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

## Quick Start

**For Protocols (Integration):**

```typescript
import { VPNLClient } from '@vpnl/sdk';

const client = new VPNLClient({
  network: 'arbitrum',
  registryAddress: '0x...'
});

// Query solver reputation
const reputation = await client.getReputation(solverAddress);

// Adjust collateral based on score
const collateral = reputation.score >= 80 
  ? baseAmount * 0.15  // Expert: 15%
  : baseAmount;        // Unknown: 100%
```
### For Solvers (Verification):
```
// Connect exchange account (off-chain)
// Generate proof of performance
// Submit for verification
// Receive W3C Verifiable Credential
// Present to protocols
```
## Technical Specs
Smart Contracts

	•	Chain: Arbitrum (EVM-compatible L2)
	•	Language: Solidity 0.8.x
	•	Standards: EAS attestations, W3C VCs
  
Verification Schemas

	•	Format: W3C Verifiable Credentials 2.0
	•	Signature: ECDSA (secp256k1)
	•	Commitment: Keccak256(score || salt || context)
  
API

	•	Endpoint: api.vpnl.network
	•	Methods: GET /reputation/{address}, POST /verify
	•	Auth: Public read, authenticated write
  
### Why This Must Be Public Goods

Reputation infrastructure is too critical to be:

	•	❌ Owned by a single protocol (centralization risk)
	•	❌ Proprietary scoring (trust black box)
	•	❌ Non-portable (siloed per protocol)
  
VPNL is credibly neutral infrastructure:

	•	✅ Open standards (anyone can implement)
	•	✅ Open source (MIT license)
	•	✅ Open access (no fees, no gatekeeping)

### Current Status
✅ Working prototype deployed: vpnl.io

🎯 Seeking funding: Giveth GG24

🚧 Next milestone: Security audit + mainnet deployment

### Support This Project
We’re raising funds on Giveth for GG24 (Interop Standards, Infrastructure & Analytics):

Donate on Giveth → https://giveth.io/project/vpnl:-the-verifiable-performance-network-layer

Every dollar builds open infrastructure that ANY protocol can use.

### Contributing
VPNL is open source and welcomes contributions:

	1.	Fork the repository
	2.	Create a feature branch (git checkout -b feature/amazing)
	3.	Commit changes (git commit -m 'Add amazing feature')
	4.	Push to branch (git push origin feature/amazing)
	5.	Open a Pull Request
  
See <CONTRIBUTING.md> for detailed guidelines.

### Resources
	•	Website: vpnl.io
	•	Documentation: docs.vpnl.io (coming soon)
	•	Telegram: t.me/vpnlnetwork
	•	Demo: vpnl.io
  
### License
This project is licensed under the MIT License - see <LICENSE> file for details.

### Acknowledgments
Built for the Open Intents Framework ecosystem:

	•	Ethereum Foundation
	•	Hyperlane
	•	LI.FI
	•	OpenZeppelin
	•	Across Protocol
	•	Everclear
	•	Nomial
  
VPNL: Open standards for solver reputation. Enabling permissionless intent routing at scale.
