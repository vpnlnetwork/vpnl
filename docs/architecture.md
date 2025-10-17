# VPNL Architecture

## Overview

VPNL is designed as a **three-layer system** that separates verification, registry, and credentials for maximum flexibility and privacy.

---

## Layer 1: Off-Chain Verification

**Purpose:** Accurately verify solver performance without exposing PII.

### Components
- Exchange API connectors (CEX: Binance, Coinbase, etc.)
- DEX transaction analyzer (on-chain PnL calculation)
- Performance metric calculator (Sharpe ratio, win rate, etc.)
- Cryptographic commitment generator

### Process
1. Solver connects exchange account (OAuth or API key)  
2. System fetches historical trade data  
3. Calculate performance metrics  
4. Generate commitment: `H(score || salt || metadata)`  
5. Store commitment hash on-chain, raw data off-chain  

**Privacy:** Raw PnL data **never** touches the blockchain.

---

## Layer 2: On-Chain Registry

**Purpose:** Immutable, queryable record of verifications.

**Smart Contract:** `VPNLRegistry.sol` (Arbitrum)

### Storage
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

### Functions
	•	verify(address, bytes32, uint256) - Register verification
	•	revoke(address, string) - Revoke for fraud/staleness
	•	isVerified(address) - Quick status check
	•	getVerification(address) - Full details

### Events
	•	Verified - Indexed by The Graph
	•	Revoked - Triggers protocol alerts

---

## Layer 3: Portable Credentials

**Purpose:** Solver-controlled, portable reputation.  
**Format:** W3C Verifiable Credentials 2.0

### Issuance
	1.	Solver completes verification (Layer 1)
	2.	Commitment stored on-chain (Layer 2)
	3.	VPNL issues W3C VC to solver’s wallet
	4.	Solver presents VC to protocols

### Optional Enhancements
	•	EAS attestation (public discoverability)
	•	ENS text records (profile integration)
	•	SIWE authentication (wallet-based access)

---

## Data Flow

```
Solver → Verification Service
         ↓
     [Off-chain processing]
         ↓
     Commitment hash
         ↓
     VPNLRegistry.sol (Arbitrum)
         ↓
     Event emitted
         ↓
     The Graph indexes
         ↓
     API serves data
         ↓
     Protocol queries → Routing decis
```

---

## Security Model

| **Threat** | **Mitigation** |
|-------------|----------------|
| Fake verifications | Centralized verifier initially (Phase 1), multisig in Phase 2 |
| Commitment hash collision | Keccak256 with salt (practically impossible) |
| Replay attacks | Expiration timestamps + nonce in commitment |
| Privacy leaks | Zero PII on-chain; ZK proofs added in Phase 2 |

---

## Integration Points

### For Protocols

**Query via Smart Contract:**
```solidity
bool verified = registry.isVerified(solverAddress);
```

**Query via GraphQL (The Graph):**
```graphql
{
  verification(id: "0x...") {
    commitmentHash
    verifiedAt
    active
  }
}
```

**Query via API:**
```
GET https://api.vpnl.network/reputation/0x...
```

---

### For Solvers

**Get Verified**
1. Visit [vpnl.io/verify](https://vpnl.io/verify)  
2. Connect wallet  
3. Connect exchange  
4. Verify identity  
5. Receive Verifiable Credential  

**Present Credential**
1. Protocol requests reputation  
2. Solver presents W3C VC  
3. Protocol verifies signature  
4. Protocol queries on-chain commitment  
5. Match confirmed → routing decision

---

## Scalability

| **Phase** | **Verifier Model** | **Governance** |
|------------|--------------------|----------------|
| Current | Single verifier (manual review) | Centralized |
| Phase 2 | 3-of-5 multisig | Semi-decentralized |
| Phase 3 | DAO governance | Community verifiers |

**Query Performance**
- On-chain: `O(1)` lookup via mapping  
- Subgraph: Indexed, <100ms response  
- API: Cached, CDN-backed  

---

## Future Enhancements
- ZK-SNARKs for private score ranges (“score > 80” without revealing exact score)
- Machine learning for fraud detection  
- Cross-chain reputation aggregation  
- Time-weighted reputation decay  

---

## Next
See **`integration-guide.md`** for protocol integration steps.
