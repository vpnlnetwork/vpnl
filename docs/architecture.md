# VPNL Architecture

## Overview

VPNL is designed as a three-layer system that separates verification, registry, and credentials for maximum flexibility and privacy.

## Layer 1: Off-Chain Verification

**Purpose**: Accurately verify solver performance without exposing PII

**Components**:
- Exchange API connectors (CEX: Binance, Coinbase, etc.)
- DEX transaction analyzer (on-chain PnL calculation)
- Performance metric calculator (Sharpe ratio, win rate, etc.)
- Cryptographic commitment generator

**Process**:
1. Solver connects exchange account (OAuth or API key)
2. System fetches historical trade data
3. Calculate performance metrics
4. Generate commitment: `H(score || salt || metadata)`
5. Store commitment hash on-chain, raw data off-chain

**Privacy**: Raw PnL data NEVER touches blockchain

## Layer 2: On-Chain Registry

**Purpose**: Immutable, queryable record of verifications

**Smart Contract**: `VPNLRegistry.sol` (Arbitrum)

**Storage**:
```solidity
struct Verification {
    bytes32 commitmentHash;    // Zero PII
    uint256 verifiedAt;        
    uint256 expiresAt;         
    bool active;               
    bool revoked;              
    string revokeReason;       
}
