# VPNL: The Verifiable Performance Network Layer

**A Public Good for Trust in Open Intents**

**Whitepaper v1.1.0 — Architecture, Economics, and Governance**

-----

**Author:** Maggie Johnson  
**Organization:** VPNL Network (Independent Developer Initiative)  
**ORCID:** [0009-0002-4391-2934](https://orcid.org/0009-0002-4391-2934)  
**Version:** v1.1.0 (2025) - DIA Lumina Integration Update  
**License:** MIT  
**DOI:** *To be assigned by Zenodo*

-----

## Abstract

VPNL (Verifiable Performance Network Layer) is an open, credibly neutral data and verification layer designed to secure the Open Intents Framework (OIF) within Ethereum’s multi-chain ecosystem. It provides risk-adjusted routing by transforming solver performance data into verifiable, privacy-preserving reputation signals, enabling protocols to achieve capital efficiency without compromising safety or permissionlessness.

**Update (v1.1.0):** VPNL is integrating with DIA Lumina, the first fully on-chain oracle network, to achieve trustless, permissionless verification at scale. This partnership accelerates VPNL’s decentralization timeline from 9 months to 3 months while reducing Phase 2 development costs by 60%.

This whitepaper outlines VPNL’s architecture, privacy model, governance framework, DIA Lumina integration strategy, and interoperability roadmap, establishing it as a foundational public good for verifiable trust in decentralized coordination.

-----

## Table of Contents

1. [Introduction](#1-introduction)
1. [The Interoperability Trilemma](#2-the-interoperability-trilemma)
1. [Economic Hypothesis](#3-economic-hypothesis)
1. [System Architecture](#4-system-architecture)
1. [Governance and Progressive Decentralization](#5-governance-and-progressive-decentralization)
1. [Roadmap and Success Metrics](#6-roadmap-and-success-metrics)
1. [Comparison to Related Work](#7-comparison-to-related-work)
1. [References](#8-references)
1. [Appendix A: Glossary](#appendix-a-glossary)

-----

## 1. Introduction

Ethereum’s ecosystem is rapidly scaling across Layer 2 rollups and cross-chain protocols. This growth introduces new coordination risks: how can protocols safely and permissionlessly route user intents through third-party solvers entrusted with billions in capital?

The Open Intents Framework (OIF) enables intent-based coordination, where users specify outcomes instead of execution paths. Yet OIF faces a structural trilemma: maintaining **safety**, **permissionlessness**, and **capital efficiency** simultaneously is currently impossible with existing coordination mechanisms.

VPNL resolves this by providing the missing verifiable data layer: a decentralized system for quantifying solver trustworthiness, enabling risk-adjusted routing, and ensuring both liquidity efficiency and safety across the intent ecosystem.

### 1.1 Key Contributions

This whitepaper:

- Formalizes the OIF coordination trilemma and existing solution inadequacies
- Presents VPNL’s three-layer architecture (verification, registry, credentials)
- **Introduces DIA Lumina integration for trustless, permissionless verification**
- Details privacy-preserving reputation via cryptographic commitments and ZK proofs
- Provides concrete integration examples for protocols, developers, and applications
- Outlines progressive decentralization governance path ensuring credible neutrality
- Demonstrates economic viability through capital efficiency modeling

### 1.2 What’s New in v1.1.0

**DIA Lumina Integration:**

- Partnership with DIA for Phase 2 decentralization infrastructure
- Permissionless feeder network replaces centralized verifier
- Crypto-economic security (staking + slashing) replaces trust-based model
- Cross-chain reputation delivery to 140+ blockchains via DIA Spectra
- Accelerated timeline: 3 months vs 9 months for Phase 2
- Cost reduction: $8k vs $20k for Phase 2 development

-----

## 2. The Interoperability Trilemma

### 2.1 The Fundamental Challenge

Without verifiable solver reputation, OIF protocols face an impossible choice:

|Condition             |Goal                   |Typical Solution       |Tradeoff            |
|----------------------|-----------------------|-----------------------|--------------------|
|**Safety**            |Prevent fraud/default  |High collateral (100%+)|Capital inefficiency|
|**Permissionlessness**|Open solver access     |Remove whitelists      |Increased risk      |
|**Capital Efficiency**|Minimize locked capital|Trust select solvers   |Centralization      |

**The Trilemma:** Pick any two, sacrifice the third.

Current implementations demonstrate these tradeoffs:

- **Across Protocol:** Safe + Efficient → Centralized allowlist
- **Naive OIF:** Safe + Permissionless → 100% collateral requirement
- **Unverified:** Permissionless + Efficient → Unacceptable risk

### 2.2 Comparison to Existing Solutions

|Approach                   |Permissionless|Capital Efficient|Safe |Transparent|Example            |
|---------------------------|--------------|-----------------|-----|-----------|-------------------|
|**Centralized Allowlist**  |❌             |✅                |✅    |❌          |Across Protocol    |
|**Uniform 100% Collateral**|✅             |❌                |✅    |✅          |Naive baseline     |
|**No Verification**        |✅             |✅                |❌    |❌          |Unsustainable      |
|**KYC-Based Reputation**   |❌             |⚠️                |✅    |❌          |Traditional finance|
|**VPNL (Risk-Adjusted)**   |**✅**         |**✅**            |**✅**|**✅**      |**This paper**     |

#### Why Existing Solutions Fall Short

**Centralized Allowlists (Across Protocol Model):**

- ✅ Achieves safety through manual curation of trusted solvers
- ✅ Capital efficient (verified solvers post minimal collateral)
- ❌ Sacrifices permissionlessness: new solvers face high barriers
- ❌ Opaque selection criteria create bottlenecks
- ❌ Does not scale: every protocol maintains separate allowlist

**Uniform Collateral Requirements:**

- ✅ Permissionless: anyone can participate by posting collateral
- ✅ Safe: 100% collateral eliminates default risk
- ❌ Capital inefficient: proven solvers locked into same requirements as unknowns
- ❌ Competitively disadvantages skilled but under-capitalized entrants
- ❌ Creates systemic liquidity constraints as network scales

**No Verification:**

- ✅ Maximally permissionless and capital efficient
- ❌ Unsafe: protocols exposed to fraud, default, manipulation
- ❌ Unsustainable: single bad actor can drain protocol reserves
- ❌ Users bear excessive risk, harming adoption

### 2.3 VPNL’s Resolution Strategy

VPNL introduces **verifiable but privacy-preserving performance data** as a coordination primitive, enabling:

1. **Permissionless participation:** Anyone can get verified by proving historical performance
1. **Capital efficiency:** Proven solvers post 70-85% less collateral
1. **Maintained safety:** Risk-adjusted requirements maintain solvency bounds
1. **Transparent standards:** Open schemas (W3C VCs, EAS) ensure auditability without revealing PII
1. **Trustless verification:** DIA Lumina’s permissionless oracle network eliminates centralized trust

**Core Insight:** Trust is not binary. By quantifying reliability along a continuous spectrum (scores 0-1000), VPNL enables protocols to implement graduated risk management that is both efficient and safe.

**v1.1.0 Enhancement:** DIA Lumina integration ensures this quantification happens through decentralized, crypto-economically secured infrastructure rather than centralized verification.

-----

## 3. Economic Hypothesis

### 3.1 Capital Efficiency Model

VPNL’s value proposition rests on a quantifiable economic claim: **verifiable solver performance can unlock up to 45% capital efficiency gains** without sacrificing safety or permissionlessness.

**Risk-Adjusted Collateral Formula:**

Let C_max represent baseline collateral (100% of intent value) and S_i ∈ [0,1] the solver’s verifiable performance score. VPNL adjusts collateral requirements via:

```
C_i = C_max × (1 - α × S_i)
```

Where:

- **α ∈ [0,1]:** Tunable risk-weight parameter (default α = 0.8)
- **S_i:** Solver i’s reputation score (0 = unverified, 1 = perfect)
- **C_i:** Required collateral for solver i

**Network Efficiency Metric:**

```
η = (C_baseline - ΣC_i) / C_baseline
```

Where:

- **C_baseline = n × C_max:** Total collateral under uniform policy
- **ΣC_i:** Sum of risk-adjusted collateral across n solvers
- **η:** Proportional capital freed (efficiency gain)

### 3.2 Empirical Validation

**Baseline Scenario:** 100 solvers, $100k average intent value

**Without VPNL (Uniform Policy):**

- All solvers post 100% collateral
- Total locked: 100 × $100k = **$10M**

**With VPNL (Risk-Adjusted, α=0.8):**

Assuming realistic solver distribution (30/40/30 Expert/Advanced/Emerging):

|Tier    |Score   |Collateral|Count|Total |
|--------|--------|----------|-----|------|
|Expert  |S ≥ 0.85|15% ($15k)|30   |$450k |
|Advanced|S ≈ 0.65|50% ($50k)|40   |$2M   |
|Emerging|S ≈ 0.30|85% ($85k)|30   |$2.55M|

**Total locked: $5.45M**

**Result:** η ≈ 0.45 → **45% efficiency gain** → **$4.55M freed capital**

This freed capital can:

- Route additional user intents simultaneously
- Enable under-capitalized but skilled solvers to compete
- Improve prices for users through increased competition
- Scale liquidity across the ecosystem without proportional capital lockup

### 3.3 Robustness Analysis

Detailed sensitivity analysis and attack vector modeling are provided in the companion technical supplement: [VPNL Economic Proof v1](economic-proof.md).

**Key Finding:** The 45% efficiency gain remains >38% across all tested scenarios, including:

- Pessimistic solver distributions
- High fraud rates (2%)
- Low participation (50 solvers)
- Conservative risk weights (α = 0.64)

-----

## 4. System Architecture

VPNL operates across three interoperable layers, each serving a distinct function while maintaining composability. **v1.1.0 adds DIA Lumina integration as a parallel verification path alongside the original architecture.**

### 4.1 Layer 1: Verification Layer

**Purpose:** Accurately verify solver performance without exposing PII

**Components:**

- Exchange API connectors (CEX: Binance, Coinbase, Kraken, etc.)
- DEX transaction analyzer (on-chain PnL calculation)
- Performance metric calculator (Sharpe ratio, win rate, drawdown)
- Cryptographic commitment generator
- **zkTLS proof validator (Phase 2+)**

**Process:**

1. Solver connects exchange account (OAuth or read-only API key)
1. System fetches historical trade data (off-chain)
1. Calculate performance metrics over verification period (typically 90-180 days)
1. Generate commitment: `commitment = H(score || salt || metadata || timestamp)`
1. Store commitment hash on-chain, raw data remains off-chain (encrypted)

**Privacy Guarantee:** Raw PnL data NEVER touches blockchain

**Phase 2 Enhancement:** zkTLS proofs allow solvers to cryptographically prove their exchange data is authentic without sharing API credentials, enabling fully permissionless verification.

### 4.2 Layer 2: On-Chain Registry

**Purpose:** Immutable, queryable record of verifications

VPNL maintains two complementary on-chain systems:

#### 4.2.A Arbitrum Registry (Phase 1 - Current)

**Smart Contract:** `VPNLRegistry.sol` deployed on Arbitrum

**Data Structure:**

```solidity
struct Verification {
    bytes32 commitmentHash;    // Keccak256(score || salt || metadata)
    uint256 verifiedAt;        // UNIX timestamp
    uint256 expiresAt;         // Expiration timestamp
    bool active;               // Current status
    bool revoked;              // Revocation flag
    string revokeReason;       // Public justification if revoked
}
```

**Core Functions:**

- `verify(address, bytes32, uint256)` - Register new verification
- `revoke(address, string)` - Revoke for fraud/staleness
- `isVerified(address)` - Quick boolean status check
- `getVerification(address)` - Full verification details

**Events:**

- `Verified(address solver, bytes32 hash, uint256 timestamp)`
- `Revoked(address solver, string reason, uint256 timestamp)`

These events are indexed by The Graph subgraph for efficient querying.

**Status:** Production-ready, continues operating as fallback/redundancy in Phase 2+

#### 4.2.B DIA Lumina Integration (Phase 2 - Q1-Q2 2026)

**Purpose:** Decentralized, trustless reputation verification at scale

**Infrastructure:** DIA Lasernet (Arbitrum Orbit L2)

**Architecture:**

```
┌──────────────────────────────────────────────────────────────┐
│                   VPNL FEEDER NODES                           │
│  (Modified DIA decentral-feeder)                             │
│                                                               │
│  • Anyone can run (permissionless)                           │
│  • Stake 10k DIA tokens minimum                              │
│  • Process zkTLS proofs from solvers                         │
│  • Calculate reputation scores                               │
│  • Submit to Lasernet for consensus                          │
│                                                               │
│  Economic Security: Earn rewards for accuracy,               │
│                     get slashed for fraud (20-30%)           │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                    DIA LASERNET (L2)                          │
│  Smart Contract: VPNLReputationAggregator.sol                │
│                                                               │
│  • Consensus mechanism (3+ feeders required)                 │
│  • Median scoring reduces manipulation                       │
│  • Dispute resolution for conflicts                          │
│  • 250ms block times, low gas costs                          │
│  • Inherits Ethereum security                                │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│              CROSS-CHAIN DISTRIBUTION                         │
│  (DIA Spectra Messaging Protocol)                            │
│                                                               │
│  • Reputation available on 140+ blockchains                  │
│  • Arbitrum, Base, Optimism, Polygon, etc.                   │
│  • Query: DIAOracle.getValue("VPNL/{solver}")                │
└──────────────────────────────────────────────────────────────┘
```

**Smart Contract Structure:**

```solidity
struct ReputationData {
    uint256 score;              // 0-1000 (scaled)
    bytes32 commitmentHash;     // Cryptographic commitment
    uint256 lastUpdate;         // Timestamp
    address[] feeders;          // Reporting nodes
    uint8 consensusCount;       // Confirming feeders
    bool active;                // Verification status
    bool disputed;              // Under dispute flag
}
```

**Key Features:**

- **Consensus**: Require 3+ independent feeders to confirm reputation
- **Slashing**: 20-30% stake penalty for fraudulent reports
- **Rewards**: Earn DIA tokens for accurate verifications (~20-25% APY)
- **Dispute Resolution**: Governance-led resolution for conflicts

**Why DIA Lumina?**

1. **Eliminates centralization risk** (VPNL’s Phase 1 limitation)
1. **Accelerates timeline** (3 months vs 9 months to build custom infrastructure)
1. **Reduces costs** ($8k vs $20k for Phase 2)
1. **Battle-tested security** (DIA’s production-proven infrastructure)
1. **Network effects** (140+ chains vs manual per-chain integration)

**Backward Compatibility:** Phase 1 Arbitrum registry continues operating. Protocols can query either source or both for redundancy.

### 4.3 Layer 3: Portable Credentials

**Purpose:** Solver-controlled, portable reputation  
**Format:** W3C Verifiable Credentials 2.0

**Issuance Flow:**

1. Solver completes verification (Layer 1)
1. Commitment hash stored on-chain (Layer 2A or 2B)
1. VPNL issues W3C VC to solver’s wallet (self-sovereign identity)
1. Solver presents VC to protocols as needed

**Optional Enhancements:**

- EAS attestation (public discoverability on attestation explorer)
- ENS text records (integrate reputation with ENS profiles)
- SIWE authentication (wallet-based access control)

**Credential Schema:**

```json
{
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  "type": ["VerifiableCredential", "SolverReputationCredential"],
  "credentialSubject": {
    "id": "did:pkh:eip155:42161:0x...",
    "vpnlScore": 0.85,
    "tier": "Expert",
    "verifiedAt": "2025-01-01T00:00:00Z",
    "expiresAt": "2025-07-01T00:00:00Z",
    "commitmentHash": "0x9a3f2b1c...",
    "verificationSource": "DIA_Lumina",
    "consensusCount": 5
  },
  "proof": {
    "type": "EcdsaSecp256k1Signature2019",
    "created": "2025-01-01T00:00:00Z",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:pkh:eip155:42161:0x...",
    "jws": "eyJhbGci..."
  }
}
```

### 4.4 Data Flow

#### Phase 1 Flow (Current)

```
Solver → Verification Service (off-chain)
         ↓
     [Performance calculation]
         ↓
     Cryptographic commitment
         ↓
     VPNLRegistry.sol (Arbitrum)
         ↓
     Event emitted
         ↓
     The Graph indexes
         ↓
     API serves data
         ↓
     Protocol queries → Risk-adjusted routing decision
```

#### Phase 2 Flow (With DIA Lumina)

```
Solver → zkTLS Proof Generation
         ↓
     VPNL Feeder Node (permissionless, anyone can run)
         ↓
     [Validate proof + calculate score]
         ↓
     Submit to DIA Lasernet
         ↓
     VPNLReputationAggregator.sol (consensus mechanism)
         ↓
     Event emitted
         ↓
     DIA Spectra (cross-chain messaging)
         ↓
     Available on 140+ chains
         ↓
     Protocol queries → Risk-adjusted routing
```

**Dual-Path Support:** Protocols can query either Arbitrum registry (Phase 1) or DIA Lumina (Phase 2) for maximum flexibility during transition.

### 4.5 Privacy Model

VPNL’s architecture ensures solver privacy while maintaining verifiability—a critical balance for adoption in pseudonymous DeFi environments.

#### 4.5.1 Three-Tier Data Classification

**Tier 1: Private (Off-Chain Only)**

Never published:

- Raw trading data (individual trades, timestamps, order books)
- Absolute PnL histories (USD or crypto profit/loss amounts)
- Exchange API credentials (OAuth tokens, API keys)
- Geographic location, IP addresses, device fingerprints
- Any personally identifiable information (PII)

Storage: Encrypted databases, access-controlled by solver, deletable on request  
Compliance: GDPR-compatible “right to be forgotten”

**Tier 2: Committed (On-Chain, Hashed)**

Published as cryptographic commitment:

- `commitment = H(score || salt || metadata || timestamp)`
- Keccak256 hash stored in smart contracts
- Original values never revealed on-chain
- Verification method: Zero-knowledge proofs of score range (Phase 2)

Properties:

- Immutable (cannot be altered post-commitment)
- Non-reversible (hash reveals no information about score)
- Verifiable (solver can prove commitment matches credential)
- Timestamped (prevents backdating)

**Tier 3: Public (On-Chain, Plaintext)**

Published transparently:

- Verification status (active/revoked boolean)
- Expiration timestamp (UNIX time)
- Revocation reason (if applicable, e.g., “Fraud detected”)
- Credential issuance transaction hash
- **Phase 2:** Consensus count, feeder participation

Rationale: Protocols need real-time queryability of verification status without accessing private performance data.

#### 4.5.2 Zero-Knowledge Enhancements (Phase 2)

VPNL will implement ZK-SNARKs for selective disclosure:

**Range Proofs:**

```
Prove: score > 0.80 (Expert tier eligibility)
Without revealing: Exact score (e.g., 0.87)
```

**Threshold Proofs:**

```
Prove: collateral_required < $20k
Without revealing: Exact score or calculation
```

**Specialty Proofs:**

```
Prove: "Experienced in cross-chain arbitrage"
Without revealing: Trade count, specific venues, or PnL
```

Technical implementation:

- Groth16 or PLONK proof systems (EVM-compatible)
- Recursive composition for multiple simultaneous claims
- Verification gas cost target: <100k (economically viable)

#### 4.5.3 Data Retention Policy

**Off-Chain (Tier 1):**

- Retained for duration of verification validity (typically 180 days)
- Automatically deleted 30 days after expiration unless solver renews
- Solver can request immediate deletion (purged within 7 days)

**On-Chain (Tier 2 & 3):**

- Immutable: Commitments and status remain permanently
- Justification: Protocols require historical accountability
- Mitigation: Only hashes stored, no reversibility to private data

### 4.6 DIA Lumina Integration Architecture

**Status:** Active development (Phase 2 roadmap)

VPNL’s integration with DIA Lumina represents a paradigm shift from trust-based verification to crypto-economically secured, permissionless infrastructure.

#### 4.6.1 Why DIA Lumina?

Traditional reputation systems face a centralization dilemma: either trust a single verifier (Phase 1 VPNL) or build complex decentralization infrastructure from scratch. DIA Lumina resolves this by providing production-ready, permissionless oracle infrastructure that VPNL adapts for reputation verification.

**Key Alignment:**

- **DIA’s Mission**: Trustless, verifiable data for Web3
- **VPNL’s Mission**: Trustless, verifiable reputation for solvers
- **Technical Fit**: Both use cryptographic commitments, on-chain storage, and cross-chain delivery

**Strategic Benefits:**

1. **Accelerated Timeline**: 3 months integration vs 9 months custom build
1. **Cost Efficiency**: $8k vs $20k (60% savings on Phase 2)
1. **Battle-Tested Security**: DIA’s infrastructure is production-proven
1. **Network Effects**: Immediate access to 140+ blockchain integrations
1. **Credible Neutrality**: Permissionless from day 1 vs gradual decentralization

#### 4.6.2 Technical Architecture

**VPNL Feeder Node:**

- Modified version of DIA’s `decentral-feeder` for reputation scoring
- Docker-containerized for easy deployment
- Processes zkTLS proofs instead of price data
- Calculates performance metrics (Sharpe, win rate, drawdown)
- Submits scores to Lasernet with cryptographic proof

**Economic Model:**

```
Feeder Incentives:
- Minimum Stake: 10,000 DIA tokens (~$10k)
- Rewards: ~20-25% APY for accurate reports
- Slashing: 20-30% for fraudulent data
- Consensus: 3+ feeders must agree

Game Theory:
- Cost of manipulation: 30k+ DIA at risk (3 colluding feeders)
- Benefit of manipulation: ~$20-30k exploitable value
- Result: Not economically rational to manipulate
```

**Smart Contract: VPNLReputationAggregator.sol (Lasernet)**

- Stores reputation scores with multi-feeder consensus
- Implements slashing for fraudulent reports
- Dispute resolution via governance
- Cross-chain sync via DIA Spectra

**Cross-Chain Delivery:**

- DIA Spectra messaging protocol
- Reputation queryable on 140+ chains
- Format: `DIAOracle.getValue("VPNL/0x{solverAddress}")`
- Backward compatible with Arbitrum registry

#### 4.6.3 Security Model Enhancement

**Phase 1 (Current):**

- Centralized verifier with transparent processes
- Acknowledged limitation: single point of trust

**Phase 2 (With DIA Lumina):**

- **Permissionless Feeders**: Anyone can run verification nodes
- **Crypto-Economic Security**: Feeder operators stake DIA tokens
- **Slashing Mechanism**: False verifications result in stake loss
- **Multi-Feeder Consensus**: Scores validated by multiple independent nodes
- **zkTLS Proofs**: Cryptographic verification of exchange API data

**Threat Model Comparison:**

|**Attack Vector**      |**Phase 1 Mitigation**|**Phase 2 Mitigation**              |
|-----------------------|----------------------|------------------------------------|
|Fake verifications     |Manual review         |Multi-feeder consensus + zkTLS      |
|Sybil attacks          |Address-bound VCs     |10k DIA stake per feeder            |
|Collusion              |N/A                   |Economic disincentive (30k+ at risk)|
|Data manipulation      |Transparent process   |Slashing + reputation loss          |
|Single point of failure|**Acknowledged risk** |**Eliminated via decentralization** |

#### 4.6.4 Benefits Over Custom Infrastructure

|**Aspect**         |**Custom Build**         |**DIA Lumina Integration**      |
|-------------------|-------------------------|--------------------------------|
|Development Time   |6-9 months               |2-3 months                      |
|Development Cost   |$20k+                    |~$8k                            |
|Security Model     |Need to design/audit     |Battle-tested (DIA’s network)   |
|Cross-chain Support|Per-chain integration    |140+ chains included            |
|Permissionless     |Complex governance needed|Built-in (day 1)                |
|zkTLS Integration  |Build from scratch       |Use DIA’s infrastructure        |
|Network Effects    |Start from zero          |Leverage DIA’s ecosystem        |
|Risk               |Unproven custom system   |Production-proven infrastructure|

#### 4.6.5 Integration Roadmap

**Q1 2026:**

- Deploy VPNL Feeder Node prototype on Lasernet testnet
- Validate reputation scoring logic
- Smart contract development (`VPNLReputationAggregator.sol`)
- Security testing with mock solvers

**Q2 2026:**

- Mainnet deployment on Lasernet
- Enable permissionless feeder participation
- Cross-chain reputation delivery via Spectra
- Onboard first 5+ feeder operators

**Q3 2026:**

- Full decentralization: community-run feeders
- Integration with DIA’s zkTLS infrastructure
- 10+ protocol integrations consuming VPNL data from DIA
- DAO governance transition

**Technical Resources:**

- **DIA Lumina Docs**: https://www.diadata.org/lumina/
- **Feeder Node Repo**: https://github.com/diadata-org/decentral-feeder
- **VPNL Integration Spec**: <docs/dia-lumina-integration.md>

### 4.7 Protocol Integration Examples

#### 4.7.1 Smart Contract Integration

**Phase 1 (Arbitrum Registry):**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IVPNLRegistry {
    function getReputation(address solver) 
        external view returns (uint256 score, bool active, uint256 expiresAt);
}

contract IntentRouter {
    IVPNLRegistry public vpnlRegistry;
    uint256 public constant BASELINE_COLLATERAL_BPS = 10000; // 100%
    uint256 public constant RISK_WEIGHT_BPS = 8000; // α = 0.8
    
    constructor(address _vpnlRegistry) {
        vpnlRegistry = IVPNLRegistry(_vpnlRegistry);
    }
    
    function calculateRequiredCollateral(
        address solver,
        uint256 intentValue
    ) public view returns (uint256) {
        (uint256 score, bool active, uint256 expiresAt) = 
            vpnlRegistry.getReputation(solver);
        
        // Check validity
        if (!active || block.timestamp > expiresAt) {
            return intentValue; // Unverified: 100% collateral
        }
        
        // Risk-adjusted: C = C_max * (1 - α * S)
        // Score stored as 0-1000, so divide by 1000
        uint256 reduction = (intentValue * RISK_WEIGHT_BPS * score) 
            / (BASELINE_COLLATERAL_BPS * 1000);
        
        return intentValue - reduction;
    }
}
```

**Phase 2 (DIA Lumina Oracle):**

```solidity
import "@diadata-org/contracts/DIAOracleV2.sol";

contract IntentRouter {
    DIAOracleV2 public diaOracle;
    
    function getReputationScore(address solver) 
        public view returns (uint256) 
    {
        (uint256 score, uint256 timestamp) = 
            diaOracle.getValue(
                string(abi.encodePacked("VPNL/", solver))
            );
        require(block.timestamp - timestamp < 30 days, "Stale reputation");
        return score;
    }
    
    function calculateRequiredCollateral(
        address solver,
        uint256 intentValue
    ) public view returns (uint256) {
        uint256 score = getReputationScore(solver);
        
        // Risk-adjusted collateral
        uint256 reduction = (intentValue * 800 * score) / 1000000;
        return intentValue - reduction;
    }
}
```

#### 4.7.2 TypeScript SDK Integration

```typescript
import { VPNLClient } from '@vpnl/sdk';
import { ethers } from 'ethers';

const vpnl = new VPNLClient({
  network: 'arbitrum',
  registryAddress: '0x...',
  diaOracleEnabled: true, // Phase 2+
  provider: ethersProvider
});

// Query reputation
const rep = await vpnl.getReputation(solverAddress);
console.log(`Score: ${rep.score}, Tier: ${rep.tier}`);
console.log(`Source: ${rep.source}`); // "Arbitrum" or "DIA_Lumina"

// Calculate collateral
const intentValue = ethers.parseEther("100");
const required = await vpnl.calculateCollateral(solverAddress, intentValue);
console.log(`Required: ${ethers.formatEther(required)} ETH`);

// Check verification status
const isVerified = await vpnl.isVerified(solverAddress);
if (!isVerified) {
  console.log("Solver not verified - require 100% collateral");
}
```

-----

## 5. Governance and Progressive Decentralization

VPNL achieves credible neutrality through progressive decentralization, leveraging DIA Lumina’s infrastructure for trustless verification while maintaining protocol-specific governance over reputation parameters.

### 5.1 Phase 1: Foundation (Q4 2025 - Q1 2026)

**Duration:** 3-4 months  
**Authority:** Centralized verification service (founder-controlled)  
**Scope:** Initial protocol integrations, system testing, DIA integration research

**Rationale:** Early-stage systems require rapid iteration. Centralized verification enables:

- Quick feedback loops for methodology refinement
- Quality control during prototype phase
- Relationship building with pilot protocols
- DIA Lumina integration planning and testing

**Safeguards:**

- All verification logic is transparent and auditable (open source)
- Verification decisions logged on-chain with justification
- Community can review and contest decisions
- Clear transition timeline published (3-4 months maximum)

**Risk:** Single point of control  
**Mitigation:** Transparent processes, short duration, community oversight, parallel DIA integration development

**Status:** Active (Q4 2025)

### 5.2 Phase 2: DIA Lumina Integration (Q1-Q2 2026)

**Duration:** 2-3 months  
**Authority:** Decentralized feeder network (permissionless participation)  
**Security Model:** Crypto-economic (staking + slashing)  
**Infrastructure:** DIA Lasernet (Arbitrum Orbit L2)

**Key Changes:**

- **Replaces:** Centralized verifier → Permissionless feeder nodes
- **Replaces:** Trust-based security → Crypto-economic security via staking
- **Adds:** zkTLS integration for exchange API verification
- **Adds:** Cross-chain reputation delivery (140+ chains)
- **Maintains:** VPNL DAO governance over reputation parameters

#### Governed Parameters

VPNL maintains two-layer governance:

**Layer 1: VPNL DAO (Application-Level Parameters)**

|Parameter          |Symbol            |Default      |Governance|Description                        |
|-------------------|------------------|-------------|----------|-----------------------------------|
|Risk weight        |α                 |0.80         |VPNL DAO  |Collateral reduction aggressiveness|
|Memory decay       |β                 |0.90         |VPNL DAO  |Recent vs. historical weighting    |
|Expert threshold   |S_expert          |0.80         |VPNL DAO  |Top-tier minimum score             |
|Advanced threshold |S_advanced        |0.60         |VPNL DAO  |Mid-tier minimum score             |
|Verification period|T_valid           |180 days     |VPNL DAO  |Verification validity duration     |
|Metric weights     |W_{sharpe, win, …}|0.35, 0.25, …|VPNL DAO  |Performance calculation weights    |

**Layer 2: DIA DAO (Infrastructure Parameters)**

|Parameter               |Symbol     |Default    |Governance|Description                   |
|------------------------|-----------|-----------|----------|------------------------------|
|Feeder stake requirement|S_min      |10,000 DIA |DIA DAO   |Minimum stake to run feeder   |
|Slashing percentage     |λ          |20-30%     |DIA DAO   |Penalty for fraudulent reports|
|Consensus threshold     |N_consensus|3 feeders  |DIA DAO   |Required feeder agreement     |
|Reward rate             |R_base     |~20-25% APY|DIA DAO   |Feeder operator rewards       |

**Separation Rationale:**

- VPNL controls its reputation methodology
- DIA provides neutral infrastructure
- Neither can unilaterally compromise the system
- Clear responsibility boundaries

#### Decentralization Mechanism

```
Anyone → Run VPNL Feeder Node
    ↓
Stake 10k DIA tokens (economic security)
    ↓
Process solver verifications (zkTLS proofs)
    ↓
Submit scores to Lasernet (consensus)
    ↓
Earn rewards for accuracy / Get slashed for fraud
```

**Economic Incentives:**

- **Honest Reporting:** ~20-25% APY on staked capital
- **False Reporting:** Lose 20-30% of stake
- **Collusion:** Requires coordinating 3+ feeders (30k+ DIA at risk)

**Result:** Economically rational actors choose honest reporting.

#### Change Process

**VPNL DAO Parameter Updates:**

1. Proposal submitted with rationale and impact analysis
1. 14-day community comment period
1. Token-weighted voting (or reputation-weighted for early stage)
1. If approved: 7-day time-lock before execution
1. Emergency override: 4-of-5 multisig for critical vulnerabilities

**DIA DAO Infrastructure Updates:**

- Managed by DIA’s existing governance processes
- VPNL can propose changes but doesn’t control infrastructure
- Ensures infrastructure remains neutral public good

### 5.3 Phase 3: Full DAO Governance (Q3 2026+)

**Duration:** Long-term (permanent governance model)  
**Authority:** VPNL DAO (community-governed)  
**Scope:** All application parameters, methodology updates, treasury management  
**Infrastructure:** Continues on DIA Lumina (community maintains feeders)

**Governance Features:**

**Voting Mechanisms:**

- Time-weighted voting (long-term stakers have higher weight)
- Quadratic voting for high-impact parameters (α, β thresholds)
- 30-day time-lock for non-emergency changes
- Emergency multisig override retained for critical security issues

**Constitutional Limits:**
Certain values enshrined in immutable contracts to prevent extreme risk-taking:

- α_max = 0.9 (maximum risk weight)
- β_min = 0.7 (minimum memory decay)
- T_valid_min = 90 days (minimum verification period)

**Community Participation:**

- Feeder operators gain voting power
- Protocol integrators have advisory voice
- Solver representatives included in governance

**Long-Term Vision:** Self-sustaining, community-governed public goods infrastructure analogous to Ethereum protocol governance.

### 5.4 Comparison to Original Roadmap

**Original Plan (Pre-DIA Partnership):**

|Phase  |Duration  |Cost|Security Model |Risk                   |
|-------|----------|----|---------------|-----------------------|
|Phase 1|3-4 months|$15k|Centralized    |Single point of failure|
|Phase 2|6-9 months|$20k|3-of-5 multisig|Signer collusion       |
|Phase 3|3-6 months|$10k|DAO            |Governance capture     |

**Updated Plan (With DIA Lumina):**

|Phase  |Duration  |Cost|Security Model          |Risk                                      |
|-------|----------|----|------------------------|------------------------------------------|
|Phase 1|3-4 months|$15k|Centralized             |Single point (mitigated by short duration)|
|Phase 2|2-3 months|$8k |Crypto-economic         |Economically irrational to attack         |
|Phase 3|3-6 months|$10k|DAO + DIA infrastructure|Distributed risk                          |

**Key Improvements:**

- ✅ **Timeline reduced:** 12-19 months → 8-13 months (30-40% faster)
- ✅ **Cost reduced:** $45k → $33k (27% savings)
- ✅ **Security enhanced:** Trust-based → Crypto-economic
- ✅ **Decentralization accelerated:** Permissionless from Phase 2 (not Phase 3)
- ✅ **Risk diversified:** Single point → Distributed network

-----

## 6. Roadmap and Success Metrics

### Phase 1: Foundation & Audit (Q4 2025 - Q1 2026)

**Duration:** 30-45 days  
**Funding Goal:** $15k

**Deliverables:**

- ✅ Smart contract security audit (third-party firm)
- ✅ Arbitrum mainnet deployment with verified source code
- ✅ Public subgraph deployment (The Graph)
- ✅ Production API with 99.9% uptime SLA
- ✅ **DIA Lumina integration research and prototype** *(NEW)*
- ✅ 2-3 pilot protocol integrations

**Success Metrics:**

- Zero critical vulnerabilities in audit
- 15-20 initial solver verifications
- Measurable collateral reduction for verified solvers
- <100ms API response time (p95)
- DIA feeder node prototype functional on testnet

**Key Milestone:** Foundation secured, partnership established, clear path to decentralization

### Phase 2: Decentralization via DIA Lumina (Q1-Q2 2026)

**Duration:** 60-90 days  
**Funding Goal:** $8k *(reduced from $20k via infrastructure partnership)*

**Deliverables:**

- ✅ **Deploy VPNL Feeder Nodes on DIA Lasernet**
- ✅ **Integrate DIA’s zkTLS infrastructure for exchange verification**
- ✅ **Enable permissionless reputation verification**
- ✅ **Cross-chain reputation delivery via DIA Spectra**
- ✅ **VPNLReputationAggregator.sol deployed on Lasernet**
- ✅ Enhanced verification schemas (CEX + DEX)
- ✅ Community dispute & appeals mechanism
- ✅ External security review of integration

**Success Metrics:**

- 5+ independent feeder operators running nodes
- 50+ verified solvers via Lumina
- 99.9% oracle uptime
- <500ms cross-chain query latency
- <0.1% fraud rate (slashing events)
- Zero successful manipulation attempts
- 3+ protocol integrations consuming DIA Lumina data

**Key Milestone:** Full decentralization achieved, centralization risk eliminated

**Changes from Original Plan:**

- ~Build custom ZK infrastructure~ → Use DIA’s zkTLS
- ~3-of-5 multisig governance~ → Crypto-economic security via staking
- **Timeline accelerated:** 9 months → 3 months
- **Cost reduced:** 60% savings via partnership

### Phase 3: Ecosystem Validation & Growth (Q2-Q3 2026)

**Duration:** 90-120 days  
**Funding Goal:** $10k

**Deliverables:**

- ✅ Developer SDK (TypeScript, Python)
- ✅ Comprehensive documentation and tutorials
- ✅ 7-10+ total protocol integrations
- ✅ DAO governance module deployment
- ✅ Public analytics dashboard
- ✅ Community-run feeder nodes (15+ operators)
- ✅ Cross-chain expansion (20+ chains)

**Success Metrics:**

- 100+ verified solvers
- Real-world validation of 45% efficiency hypothesis
- 10+ active protocol integrations
- $10M+ in intents routed using VPNL reputation
- SDK downloads: 1000+
- Zero security incidents
- Measurable capital efficiency gains documented

**Key Milestone:** Ecosystem adoption validated, sustainable growth trajectory established

### Phase 4: Long-Term Vision (2027+)

**Future Directions:**

- Advanced ZK features (recursive proofs, cross-chain aggregation)
- Machine learning for fraud detection and predictive scoring
- Integration with additional intent frameworks beyond OIF
- Cross-chain reputation aggregation protocols
- Time-weighted reputation decay mechanisms
- Expanded metric suite (MEV-resistance, user satisfaction, etc.)
- Protocol-specific performance tracking

-----

## 7. Comparison to Related Work

### 7.1 Reputation Systems

**Traditional Web2 (eBay, Uber, Upwork):**

- Centralized, non-portable, opaque algorithms, privacy-invasive
- **VPNL advantage:** Decentralized, portable (W3C VCs), transparent, pseudonymous

**Blockchain Reputation (Gitcoin Passport):**

- Focus: Identity verification and Sybil resistance, not performance
- Use case: Grant allocation, not capital efficiency
- **VPNL difference:** Performance-based, continuous scoring, enables capital efficiency primitive

**On-Chain Credit Scores (Spectral, ARCx):**

- Focus: DeFi lending behavior (repayment history)
- Use case: Under-collateralized lending
- **VPNL difference:** Trading performance for solver routing, not borrowing

### 7.2 Collateral Optimization

**DeFi Lending (Aave, Compound):**

- Over-collateralization (125-150%), no reputation adjustments
- **VPNL parallel:** Similar trust-for-capital tradeoff, applied to solver routing instead of lending

**MEV Relays (Flashbots, Eden Network):**

- Trusted builder networks, implicit reputation via past behavior
- **VPNL improvement:** Explicit, quantified, portable with open standards

**Staking Networks (Eigenlayer Restaking):**

- Crypto-economic security via slashing
- **VPNL alignment:** Similar economic model applied to reputation verification via DIA Lumina

### 7.3 Open Intents Implementations

**Across Protocol:**

- Manual curation, efficient but not permissionless
- Opaque solver selection criteria
- **VPNL complement:** Provides data layer for permissionless version

**UniswapX:**

- Permissionless competition, uniform capital requirements
- Dutch auction pricing mechanism
- **VPNL addition:** Adds trust primitive to reduce capital while maintaining competition

**Everclear (formerly Connext):**

- Liquidity management for intent networks
- Solver coordination via rebalancing
- **VPNL integration:** Reputation can inform liquidity allocation decisions

**LI.FI:**

- Cross-chain routing aggregator
- Multiple solver sources
- **VPNL enhancement:** Reputation scoring can improve routing algorithm

### 7.4 Oracle Infrastructure

**Chainlink (Traditional Oracles):**

- Focus: Price feeds, VRF, external API data
- Architecture: Centralized node operators, reputation-based security
- **VPNL difference:** Builds on DIA’s crypto-economic model instead

**DIA (Decentralized Information Asset):**

- Focus: Transparent, verifiable price feeds for DeFi
- Architecture: Permissionless feeder network + Lasernet L2
- **VPNL Relationship:** Strategic infrastructure partner

**VPNL’s Positioning:**

- DIA: Provides price/market data oracle infrastructure
- VPNL: Provides reputation/performance data using DIA’s infrastructure
- Complementary, not competitive: VPNL is a data source *on* DIA Lumina

**Synergy:**

- VPNL becomes DIA’s first non-price oracle use case
- Proves Lumina can handle any data type (not just prices)
- VPNL gains trustless infrastructure without building from scratch
- Both projects benefit from shared ecosystem growth

### 7.5 Cross-Chain Infrastructure

**Hyperlane (Modular Interoperability):**

- Focus: General message passing between chains
- **VPNL integration:** Can use Hyperlane for credential transport

**DIA Spectra:**

- Focus: Oracle data delivery across chains
- **VPNL integration:** Primary cross-chain reputation delivery mechanism

**LayerZero:**

- Focus: Omnichain messaging protocol
- **VPNL potential:** Alternative cross-chain bridge if needed

-----

## 8. References

[1] Ethereum Foundation. “ERC-7683: Cross-Chain Intent Standard.” 2024.  
[2] Hyperlane Protocol. “Modular Interoperability Framework.” 2024.  
[3] Ethereum Attestation Service. “Technical Documentation.” 2024.  
[4] W3C. “Verifiable Credentials Data Model 2.0.” 2023.  
[5] Across Protocol. “Intents-Based Architecture.” 2024.  
[6] LI.FI Protocol. “Any-to-Any Cross-Chain Swaps.” 2024.  
[7] Buterin, V. “Credible Neutrality as a Guiding Principle.” 2020.  
[8] Everclear. “Liquidity Management in Intent Networks.” 2024.  
[9] OpenZeppelin. “EAS Integration Patterns.” 2024.  
[10] Nomial. “Intent Matching Algorithms.” 2024.  
[11] Arbitrum Foundation. “Security Model.” 2024.  
[12] The Graph Protocol. “Decentralized Indexing.” 2024.  
[13] UniswapX. “Dutch Auction Protocol.” 2023.  
[14] Flashbots. “MEV-Boost Documentation.” 2023.  
[15] Gitcoin Passport. “Decentralized Identity.” 2024.  
[16] VPNL Network. “GitHub Repository.” 2025. https://github.com/vpnlnetwork/vpnl  
[17] VPNL Network. “Economic Proof v1” 2025.  
[18] DIA. “Lumina: The Rollup-Enabled Oracle.” 2024. https://www.diadata.org/lumina/  
[19] DIA. “Oracles Got Boring: How Did We Get Here?” 2025. https://www.diadata.org/blog/post/oracles-got-boring-how-did-we-get-here/  
[20] DIA. “Distributed Feeder Network.” 2024. https://www.diadata.org/blog/post/dia-distributed-feeder-network/  
[21] DIA. “Lasernet Mainnet is Live.” 2025. https://www.diadata.org/blog/post/dia-lumina-mainnet-live/

-----

## Appendix A: Glossary

**Intent:** User expression of desired outcome without specifying execution path

**Solver:** Entity that fulfills intents by finding optimal execution routes

**Collateral:** Assets locked by solvers to guarantee fulfillment

**Risk-Adjusted Routing:** Dynamic collateral requirements based on reputation

**Verifiable Credential (VC):** W3C standard for portable attestations

**EAS:** Ethereum Attestation Service for on-chain claims

**Commitment Hash:** Cryptographic hash (Keccak256) of performance data

**Zero-Knowledge Proof:** Cryptographic method to prove statement without revealing underlying value

**Progressive Decentralization:** Gradual transition from centralized to DAO governance

**Capital Efficiency (η):** Percentage reduction in locked collateral

**DIA Lumina:** First fully on-chain oracle network with permissionless architecture

**Lasernet:** DIA’s Arbitrum Orbit L2 for oracle data storage and computation

**Feeder Node:** Independent operator that sources and validates data for DIA Lumina

**zkTLS:** Zero-knowledge Transport Layer Security for cryptographic proof of HTTPS data

**Crypto-Economic Security:** Security model based on economic incentives (staking + slashing)

**Slashing:** Penalty mechanism where staked assets are forfeited for malicious behavior

**Consensus Mechanism:** Process requiring multiple independent parties to agree on data validity

**Cross-Chain Messaging:** Protocol for transmitting data between different blockchains

**DIA Spectra:** Cross-chain messaging protocol for delivering oracle data

-----

## Appendix B: Version History

**v1.0.0 (Initial Release - January 2025)**

- Original architecture with three-layer design
- Phase 1: Centralized verification
- Phase 2: 3-of-5 multisig governance (planned)
- Phase 3: DAO governance (planned)
- Economic model and 45% efficiency hypothesis
- Comparison to existing solutions

**v1.1.0 (DIA Lumina Integration - October 2025)**

- Added Section 4.6: DIA Lumina Integration Architecture
- Updated Section 5: Governance with crypto-economic security model
- Updated Section 6: Roadmap with accelerated timeline and reduced costs
- Added Section 7.4: Oracle Infrastructure comparison
- Updated Abstract and Introduction with partnership details
- Added new references [18-21] for DIA documentation
- Expanded Glossary with DIA-related terms
- Updated all code examples to include DIA oracle queries
- Added comparison tables: Phase 1 vs Phase 2 throughout
- Enhanced security model analysis

**Key Changes:**

- Timeline: 12-19 months → 8-13 months (30-40% faster)
- Phase 2 Cost: $20k → $8k (60% savings)
- Security: Trust-based → Crypto-economic
- Decentralization: Delayed to Phase 3 → Active in Phase 2

-----

## Citation

Johnson, M. (2025). *VPNL: The Verifiable Performance Network Layer* (v1.1.0). Zenodo. DOI: [To be assigned]

**Updates:**

- v1.0.0: Initial publication
- v1.1.0: DIA Lumina integration architecture

-----

## Acknowledgments

**Infrastructure Partners:**

- [DIA (Decentralized Information Asset)](https://www.diadata.org/) - Trustless oracle infrastructure for Phase 2 decentralization

**Built for the Open Intents Framework ecosystem:**

- [Ethereum Foundation](https://ethereum.foundation)
- [Hyperlane](https://hyperlane.xyz)
- [LI.FI](https://li.fi)
- [OpenZeppelin](https://www.openzeppelin.com)
- [Across Protocol](https://across.to)
- [Everclear](https://everclear.network)
- [Nomial](https://nomial.xyz)

Special thanks to the DIA team for their collaboration on the Lumina integration and for building open, transparent oracle infrastructure for Web3.

-----

**Document Information:**

- Version: 1.1.0 (DIA Lumina Integration Update)
- Last Updated: October 19, 2025
- License: MIT
- ORCID: 0009-0002-4391-2934
- Repository: https://github.com/vpnlnetwork/vpnl
- Contact: [Telegram @vpnlnetwork](https://t.me/vpnlnetwork)

-----

**VPNL:** Open standards for solver reputation.  
Enabling permissionless intent routing at scale.  
Powered by DIA Lumina’s trustless oracle infrastructure.