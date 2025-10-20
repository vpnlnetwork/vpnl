# VPNL Architecture

## Overview

VPNL is designed as a **multi-layer system** that separates verification, registry, and credentials for maximum flexibility, privacy, and decentralization. The architecture integrates with **DIA Lumina** for trustless, permissionless reputation verification at scale.

---

## Layer 1: Off-Chain Verification

**Purpose:** Accurately verify solver performance without exposing PII.

### Components
- Exchange API connectors (CEX: Binance, Coinbase, etc.)
- DEX transaction analyzer (on-chain PnL calculation)
- Performance metric calculator (Sharpe ratio, win rate, etc.)
- Cryptographic commitment generator
- **zkTLS proof validator** *(Phase 2+)*

### Process
1. Solver connects exchange account (OAuth or API key)  
2. System fetches historical trade data  
3. Calculate performance metrics  
4. Generate commitment: `H(score || salt || metadata)`  
5. Store commitment hash on-chain, raw data off-chain  

**Privacy:** Raw PnL data **never** touches the blockchain.

**Phase 2 Enhancement:** zkTLS proofs allow solvers to prove exchange data authenticity without sharing API keys with VPNL.

---

## Layer 2: On-Chain Registry

VPNL maintains two complementary on-chain systems for different phases of decentralization:

### 2A: Arbitrum Registry (Phase 1 - Current)

**Purpose:** Immutable, queryable record of verifications during initial launch.

**Smart Contract:** `VPNLRegistry.sol` (Arbitrum)

#### Storage
```solidity
struct Verification {
    bytes32 commitmentHash;    // Zero PII
    uint256 verifiedAt;        
    uint256 expiresAt;         
    bool active;               
    bool revoked;              
    string revokeReason;       
}
```

#### Functions
- `verify(address, bytes32, uint256)` - Register verification
- `revoke(address, string)` - Revoke for fraud/staleness
- `isVerified(address)` - Quick status check
- `getVerification(address)` - Full details

#### Events
- `Verified` - Indexed by The Graph
- `Revoked` - Triggers protocol alerts

**Status:** Production-ready, serves as fallback/redundancy in Phase 2+

---

### 2B: DIA Lumina Integration (Phase 2 - Q1-Q2 2026)

**Purpose:** Decentralized, trustless reputation verification at scale.

**Infrastructure:** DIA Lasernet (Arbitrum Orbit L2)

#### Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                   VPNL FEEDER NODES                           │
│  (Modified DIA decentral-feeder)                             │
│                                                               │
│  • Permissionless operation (anyone can run)                 │
│  • Stake DIA tokens (10k minimum)                            │
│  • Process zkTLS proofs from solvers                         │
│  • Calculate reputation scores                               │
│  • Submit to Lasernet for consensus                          │
│                                                               │
│  Economic Security: Staking + slashing for accuracy          │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                    DIA LASERNET (L2)                          │
│  Smart Contract: VPNLReputationAggregator.sol                │
│                                                               │
│  • Store reputation scores on-chain                          │
│  • Consensus mechanism (3+ feeders required)                 │
│  • Median scoring reduces manipulation                       │
│  • Dispute resolution for conflicting reports                │
│  • 250ms block times, low transaction costs                  │
│                                                               │
│  Security: Inherits Ethereum security via Arbitrum Orbit     │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│              CROSS-CHAIN DISTRIBUTION                         │
│  (DIA Spectra Messaging Protocol)                            │
│                                                               │
│  • Reputation available on 140+ blockchains                  │
│  • Arbitrum (backward compatibility with Phase 1)            │
│  • Base, Optimism, Polygon, etc.                             │
│  • Any chain integrated with DIA                             │
│                                                               │
│  Query Format: DIAOracle.getValue("VPNL/{address}")          │
└──────────────────────────────────────────────────────────────┘
```

#### Smart Contract: VPNLReputationAggregator.sol

**Core Storage:**
```solidity
struct ReputationData {
    uint256 score;              // 0-1000 (scaled from 0-1)
    bytes32 commitmentHash;     // Cryptographic commitment
    uint256 lastUpdate;         // Timestamp
    address[] feeders;          // Reporting nodes
    uint8 consensusCount;       // Number of confirming feeders
    bool active;                // Verification status
    bool disputed;              // Under dispute flag
}
```

**Key Features:**
- **Consensus Mechanism**: Require 3+ independent feeders to confirm
- **Median Scoring**: Use median if scores vary <10%
- **Dispute Resolution**: Flag for review if variance >10%
- **Slashing**: 20-30% stake penalty for fraudulent reports
- **Rewards**: Earn DIA tokens for accurate verifications

#### Security Model

| **Threat** | **Mitigation** |
|-------------|----------------|
| Centralized verification | **Permissionless feeder network** (anyone can participate) |
| Sybil attacks | **10k DIA stake per feeder** + pattern detection |
| Score manipulation | **Multi-feeder consensus** + median scoring |
| Data fraud | **zkTLS proofs** + crypto-economic penalties (slashing) |
| Collusion | **Economic disincentive** (30k+ DIA at risk for 3 feeders) |

#### Comparison: Phase 1 vs Phase 2

| **Aspect** | **Phase 1 (Arbitrum)** | **Phase 2 (DIA Lumina)** |
|------------|------------------------|--------------------------|
| Verification | Centralized service | Permissionless feeders |
| Trust Model | Reputation-based | Crypto-economic (staking) |
| Participation | Gated | Open to anyone |
| Cross-chain | Manual per-chain | 140+ chains via Spectra |
| Security | Transparency + multisig | Staking + slashing |
| Cost | ~$50-100 per verification | ~$5-10 per verification |
| Timeline | 3-4 months (complete) | 2-3 months (integration) |

**Backward Compatibility:** Phase 1 registry continues operating as fallback. Protocols can query either source.

---

## Layer 3: Portable Credentials

**Purpose:** Solver-controlled, portable reputation.  
**Format:** W3C Verifiable Credentials 2.0

### Issuance Flow
1. Solver completes verification (Layer 1)
2. Commitment stored on-chain (Layer 2A or 2B)
3. VPNL issues W3C VC to solver's wallet
4. Solver presents VC to protocols

### Credential Structure

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
    "verificationSource": "DIA_Lumina", // Phase 2+
    "consensusCount": 5 // Number of feeders confirmed
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

### Optional Enhancements
- **EAS attestation** (public discoverability)
- **ENS text records** (profile integration)
- **SIWE authentication** (wallet-based access)

### Phase 2 Addition: Zero-Knowledge Proofs

Solvers can prove properties without revealing exact scores:

```
Prove: score > 0.80 (Expert tier)
Without revealing: Exact score (e.g., 0.87)

Prove: collateral_required < $20k
Without revealing: Score or calculation details
```

**Benefits:**
- Enhanced privacy
- Selective disclosure
- Competitive advantage preservation

---

## Data Flow

### Phase 1 Flow (Current)

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
     Protocol queries → Routing decision
```

### Phase 2 Flow (With DIA Lumina)

```
Solver → zkTLS Proof Generation
         ↓
     VPNL Feeder Node (permissionless)
         ↓
     [Validate proof + calculate score]
         ↓
     Submit to DIA Lasernet
         ↓
     VPNLReputationAggregator.sol (consensus)
         ↓
     Event emitted
         ↓
     DIA Spectra (cross-chain messaging)
         ↓
     Available on 140+ chains
         ↓
     Protocol queries → Risk-adjusted routing
```

**Dual-Path Support:** Protocols can query either Arbitrum registry (Phase 1) or DIA Lumina (Phase 2) for maximum flexibility.

---

## Privacy Model

VPNL implements a three-tier data classification system:

### Tier 1: Private (Off-Chain Only)

**Never Published:**
- Raw trading data (individual trades, timestamps)
- Absolute PnL histories (USD/crypto amounts)
- Exchange API credentials
- Geographic location, IP addresses
- Any personally identifiable information (PII)

**Storage:** Encrypted databases, solver-controlled, deletable on request  
**Compliance:** GDPR "right to be forgotten" compatible

### Tier 2: Committed (On-Chain, Hashed)

**Published as Cryptographic Commitment:**
```
commitment = H(score || salt || metadata || timestamp)
```

**Properties:**
- Immutable (cannot be altered post-commitment)
- Non-reversible (hash reveals nothing about score)
- Verifiable (solver can prove commitment matches credential)
- Timestamped (prevents backdating)

**Stored On:**
- Arbitrum: `VPNLRegistry.sol`
- Lasernet: `VPNLReputationAggregator.sol`

### Tier 3: Public (On-Chain, Plaintext)

**Published Transparently:**
- Verification status (active/revoked boolean)
- Expiration timestamp
- Revocation reason (if applicable)
- Credential issuance transaction hash
- **Phase 2:** Consensus count, feeder participation

**Rationale:** Protocols need real-time queryability without accessing private performance data.

### Zero-Knowledge Enhancements (Phase 2)

**Range Proofs:**
```solidity
// Prove score is in a range without revealing exact value
function verifyScoreRange(
    address solver,
    uint256 minScore,
    bytes calldata zkProof
) external view returns (bool) {
    // Verify ZK proof that solver's score >= minScore
    // Without revealing actual score
}
```

**Implementation:**
- Groth16 or PLONK proof systems (EVM-compatible)
- Verification gas cost: <100k target
- Enables competitive privacy while maintaining verifiability

---

## Integration Points

### For Protocols

#### Phase 1: Direct Smart Contract Query

**Query via Arbitrum Registry:**
```solidity
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
    
    function routeIntent(address solver, uint256 amount) external {
        require(vpnlRegistry.isVerified(solver), "Unverified solver");
        // Route intent to solver with reduced collateral
    }
}
```

#### Phase 2: Query via DIA Lumina

**Query via DIA Oracle:**
```solidity
import "@diadata-org/contracts/DIAOracleV2.sol";

contract YourProtocol {
    DIAOracleV2 public diaOracle;
    
    function getReputationScore(address solver) 
        public view returns (uint256) 
    {
        (uint256 score, uint256 timestamp) = 
            diaOracle.getValue(
                string(abi.encodePacked("VPNL/", solver))
            );
        require(block.timestamp - timestamp < 30 days, "Stale data");
        return score;
    }
    
    function calculateCollateral(
        address solver,
        uint256 intentValue
    ) public view returns (uint256) {
        uint256 score = getReputationScore(solver);
        
        // Risk-adjusted: C = C_max * (1 - α * score/1000)
        // Using α = 0.8
        uint256 reduction = (intentValue * 800 * score) / 1000000;
        return intentValue - reduction;
    }
}
```

#### GraphQL Query (The Graph)

**Phase 1:**
```graphql
{
  verification(id: "0x...") {
    commitmentHash
    verifiedAt
    expiresAt
    active
    revoked
  }
}
```

**Phase 2:**
```graphql
{
  reputationData(solver: "0x...") {
    score
    commitmentHash
    lastUpdate
    consensusCount
    feeders {
      address
      stake
    }
    active
    disputed
  }
}
```

#### REST API

**Phase 1:**
```
GET https://api.vpnl.network/reputation/0x...
```

**Phase 2:**
```
GET https://api.diadata.org/v1/quotation/VPNL/0x...
```

**Response:**
```json
{
  "solver": "0x...",
  "score": 850,
  "tier": "Expert",
  "verifiedAt": "2025-01-01T00:00:00Z",
  "expiresAt": "2025-07-01T00:00:00Z",
  "source": "DIA_Lumina",
  "consensusCount": 5,
  "active": true
}
```

---

### For Solvers

#### Get Verified (Phase 1)

1. Visit [vpnl.io/verify](https://vpnl.io/verify)  
2. Connect wallet  
3. Connect exchange via OAuth  
4. Verify identity  
5. Receive Verifiable Credential  

**Timeline:** 2-3 days for manual review

#### Get Verified (Phase 2 - Permissionless)

1. Generate zkTLS proof of exchange account
2. Submit proof to VPNL feeder network
3. Wait for 3+ feeders to validate (automated)
4. Receive Verifiable Credential

**Timeline:** 1-24 hours (automated consensus)

#### Present Credential

1. Protocol requests reputation  
2. Solver presents W3C VC  
3. Protocol verifies signature  
4. Protocol queries on-chain commitment (Arbitrum or Lasernet)
5. Match confirmed → routing decision with reduced collateral

---

## Scalability

### Verifier Model Evolution

| **Phase** | **Verifier Model** | **Governance** | **Timeline** |
|-----------|-------------------|----------------|--------------|
| **Phase 1** | Single verifier (manual review) | Centralized | Q4 2025 - Q1 2026 |
| **Phase 2** | Permissionless feeders (DIA Lumina) | Crypto-economic | Q1-Q2 2026 |
| **Phase 3** | DAO governance + community feeders | Decentralized | Q3 2026+ |

### Query Performance

**Phase 1 (Arbitrum):**
- On-chain: `O(1)` lookup via mapping  
- Subgraph: Indexed, <100ms response  
- API: Cached, CDN-backed  

**Phase 2 (DIA Lumina):**
- Lasernet: `O(1)` lookup, <50ms (250ms blocks)
- Cross-chain: <200ms via DIA Spectra
- Multi-chain caching for frequently queried solvers

### Cost Analysis

| **Operation** | **Phase 1 (Arbitrum)** | **Phase 2 (Lasernet)** |
|---------------|------------------------|------------------------|
| Verification write | ~$2-5 (depending on gas) | ~$0.10-0.50 |
| Query (on-chain) | Free (view function) | Free (view function) |
| Update | ~$2-5 | ~$0.10-0.50 |
| Cross-chain sync | N/A | ~$1-2 per destination |

**Efficiency Gain:** Phase 2 reduces operational costs by 80-95%

---

## Security Model Comparison

### Phase 1 Security

| **Threat** | **Mitigation** |
|-------------|----------------|
| Fake verifications | Manual review by founder (transparent process) |
| Commitment collision | Keccak256 with salt (2^256 security) |
| Replay attacks | Expiration timestamps + nonce |
| Privacy leaks | Zero PII on-chain |
| Single point of failure | **Acknowledged risk** → Resolved in Phase 2 |

### Phase 2 Security (DIA Lumina)

| **Threat** | **Mitigation** |
|-------------|----------------|
| Fake verifications | **Multi-feeder consensus** + zkTLS proofs |
| Commitment collision | Keccak256 with salt (unchanged) |
| Replay attacks | Expiration + nonce + feeder signatures |
| Privacy leaks | Zero PII on-chain + ZK proofs |
| Feeder collusion | **Economic disincentive** (30k+ DIA at risk) |
| Sybil attacks | **10k DIA stake per feeder** + pattern detection |
| Oracle manipulation | **DIA's battle-tested security model** |
| Governance capture | **Progressive decentralization** + time-locks |

**Result:** Phase 2 eliminates centralization risk while maintaining all Phase 1 security properties.

---

## Future Enhancements

### Phase 3+ Roadmap

1. **Advanced ZK Features**
   - Threshold proofs for score ranges
   - Recursive composition for multiple claims
   - Privacy-preserving solver rankings

2. **Machine Learning Integration**
   - Anomaly detection for fraudulent patterns
   - Predictive scoring based on trading behavior
   - Automated feeder quality assessment

3. **Cross-Chain Aggregation**
   - Combine DEX data from multiple chains
   - Unified reputation across ecosystems
   - Chain-specific specialization scores

4. **Time-Weighted Reputation**
   - Decay function for stale performance
   - Recency bias in scoring
   - Adaptive expiration based on activity

5. **Expanded Metrics**
   - Liquidity provision efficiency
   - MEV-resistance scoring
   - User satisfaction ratings
   - Protocol-specific performance tracking

---

## Architecture Decision Records

### Why DIA Lumina?

**Decision:** Integrate with DIA Lumina for Phase 2 decentralization instead of building custom infrastructure.

**Context:**
- VPNL Phase 1 identified centralization as key weakness
- Original plan: Build custom ZK infrastructure + multisig (6-9 months, $20k)
- DIA Lumina launched with permissionless oracle network (production-ready)

**Rationale:**
1. **Accelerated Timeline:** 3 months vs 9 months
2. **Cost Reduction:** $8k vs $20k (60% savings)
3. **Battle-Tested:** DIA's infrastructure is production-proven
4. **Network Effects:** Access to 140+ chains immediately
5. **Credible Neutrality:** Permissionless participation from day 1
6. **Strategic Alignment:** Both building verifiable data infrastructure

**Consequences:**
- ✅ Faster time to decentralization
- ✅ Lower development risk
- ✅ Stronger security model (crypto-economic)
- ⚠️ Dependency on DIA's roadmap
- ⚠️ Need to maintain Arbitrum registry as fallback

**Status:** Accepted, integration in progress

### Why Maintain Dual Registries?

**Decision:** Keep Arbitrum registry (Phase 1) operational alongside DIA Lumina integration (Phase 2).

**Rationale:**
1. **Backward Compatibility:** Existing protocol integrations continue working
2. **Redundancy:** Fallback if Lasernet has issues
3. **Migration Path:** Gradual transition, no breaking changes
4. **Cross-Validation:** Can compare results between sources
5. **Protocol Choice:** Let protocols decide which source to trust

**Implementation:**
- Phase 1 registry remains active indefinitely
- Phase 2 adds Lumina as primary source
- Bridge contract syncs between sources
- Protocols can query either or both

---

## Next Steps

See **[`docs/dia-lumina-integration.md`](dia-lumina-integration.md)** for detailed integration specification.

See **[`docs/integration-guide.md`](integration-guide.md)** for protocol integration steps.

---

**Document Version:** 2.0.0 (DIA Lumina Update)  
**Last Updated:** October 19, 2025  
**Status:** Active Development  
**Next Review:** Phase 2 Kickoff
