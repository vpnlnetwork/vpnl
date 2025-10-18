# DIA Lumina Integration Specification

**Status:** Phase 2 Development (Q1-Q2 2026)  
**Version:** v0.1.0-draft  
**Last Updated:** October 2025

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [VPNL Feeder Node](#vpnl-feeder-node)
4. [Smart Contracts](#smart-contracts)
5. [Economic Model](#economic-model)
6. [Integration Timeline](#integration-timeline)
7. [Security Considerations](#security-considerations)
8. [Open Questions](#open-questions)
9. [Success Metrics](#success-metrics)
10. [Resources](#resources)

---

## Executive Summary

VPNL is integrating with DIA Lumina to achieve decentralized, trustless reputation verification for intent solvers. This integration eliminates VPNL's Phase 1 centralization risk while accelerating the decentralization timeline from 9 months to 3 months and reducing Phase 2 costs by ~60%.

### Key Benefits

**For VPNL:**
- ✅ Permissionless verification (anyone can run feeder nodes)
- ✅ Crypto-economic security (staking replaces centralized trust)
- ✅ Cross-chain distribution (140+ blockchains via DIA Spectra)
- ✅ Accelerated timeline (2-3 months vs 6-9 months)
- ✅ Reduced costs (~$8k vs $20k for Phase 2)

**For DIA:**
- ✅ First non-price oracle use case
- ✅ Proves Lumina can handle any data type
- ✅ Expands into intent/solver ecosystem
- ✅ Real-world validation of permissionless architecture

**For Ecosystem:**
- ✅ Trustless reputation infrastructure for Open Intents Framework
- ✅ 45% capital efficiency gains for protocols
- ✅ Public goods infrastructure anyone can use

---

## Architecture Overview

### High-Level Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                        SOLVER                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  1. Connect exchange account (Binance, Coinbase, etc.) │ │
│  │  2. Generate zkTLS proof of trading history            │ │
│  │  3. Submit proof to VPNL feeder network                │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                   VPNL FEEDER NODE                            │
│  (Modified DIA decentral-feeder)                             │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  FETCHER MODULE                                         │ │
│  │  - Receives zkTLS proof from solver                    │ │
│  │  - Validates proof authenticity                        │ │
│  │  - Extracts historical trade data                      │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  PROCESSOR MODULE                                       │ │
│  │  - Calculate performance metrics:                      │ │
│  │    * Sharpe ratio                                      │ │
│  │    * Win rate                                          │ │
│  │    * Max drawdown                                      │ │
│  │    * Risk-adjusted returns                             │ │
│  │  - Generate reputation score (0-1000)                  │ │
│  │  - Create commitment hash                              │ │
│  │    H(score || salt || metadata || timestamp)           │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  PUBLISHER MODULE                                       │ │
│  │  - Submit score to Lasernet                            │ │
│  │  - Update triggers:                                    │ │
│  │    * Deviation >5% from last score                     │ │
│  │    * Time-based: Every 7 days                          │ │
│  │    * Request-based: On-demand updates                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  Economic Security: Staked DIA tokens (slashable)            │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                    DIA LASERNET (L2)                          │
│  (Arbitrum Orbit - 250ms blocks, low-cost txs)              │
│                                                               │
│  Smart Contract: VPNLReputationAggregator.sol                │
│                                                               │
│  Storage Structure:                                           │
│  mapping(address => ReputationData) public solverScores;     │
│                                                               │
│  struct ReputationData {                                     │
│    uint256 score;           // 0-1000 (scaled)              │
│    bytes32 commitmentHash;  // Cryptographic commitment     │
│    uint256 lastUpdate;      // Timestamp                    │
│    address[] feeders;       // Reporting nodes              │
│    bool active;             // Verification status          │
│    uint8 consensusCount;    // Number of confirming feeders │
│  }                                                            │
│                                                               │
│  Consensus Mechanism:                                         │
│  - Require 3+ feeders to confirm reputation                  │
│  - Use median if scores vary <10%                            │
│  - Flag for review if variance >10%                          │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│              CROSS-CHAIN DELIVERY (DIA Spectra)               │
│                                                               │
│  Reputation data available on:                               │
│  • Arbitrum (primary VPNL registry)                          │
│  • Base, Optimism, Polygon                                   │
│  • All 140+ DIA-supported chains                             │
│                                                               │
│  Protocols query:                                            │
│  DIAOracle.getValue("VPNL/0x{solverAddress}")                │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                    PROTOCOL CONSUMERS                         │
│                                                               │
│  Intent-based protocols use reputation for:                  │
│  • Risk-adjusted collateral requirements                     │
│  • Routing priority decisions                                │
│  • Solver discovery and selection                            │
│                                                               │
│  Formula: C = C_max × (1 - α × score/1000)                  │
└──────────────────────────────────────────────────────────────┘
```

### Three-Layer Integration

**Layer 1: VPNL Feeder Nodes (Off-Chain Verification)**
- Modified DIA decentral-feeder containers
- Process zkTLS proofs from solvers
- Calculate reputation metrics
- Submit to Lasernet with stake

**Layer 2: DIA Lasernet (On-Chain Storage)**
- Ethereum L2 (Arbitrum Orbit stack)
- Store reputation scores with consensus
- Emit events for indexing
- Cross-chain message passing

**Layer 3: Cross-Chain Distribution (Universal Access)**
- DIA Spectra messaging protocol
- Reputation available on 140+ chains
- Backward compatibility with existing VPNL registry on Arbitrum

---

## VPNL Feeder Node

### Base Implementation

**Starting Point:** [DIA decentral-feeder](https://github.com/diadata-org/decentral-feeder)

**Key Modifications:**
1. Replace price aggregation logic with reputation scoring
2. Accept zkTLS proofs as primary input
3. Implement performance metric calculations
4. Generate cryptographic commitments

### Configuration

**Docker Deployment:**

```bash
docker run -d \
  -e FEEDER_TYPE="reputation" \
  -e DATA_SOURCE="zkTLS_proof" \
  -e PRIVATE_KEY="0x..." \
  -e LASERNET_CONTRACT="0x..." \
  -e UPDATE_FREQUENCY="7d" \
  -e DEVIATION_TRIGGER="5" \
  -e MIN_STAKE="10000" \
  --name vpnl-feeder \
  vpnl/reputation-feeder:v1.0.0
```

**Configuration File (config.yaml):**

```yaml
feeder:
  type: "reputation"
  version: "1.0.0"
  
network:
  lasernet_rpc: "https://rpc.lasernet.diadata.org"
  chain_id: 42170 # Lasernet
  
data:
  source: "zkTLS_proof"
  verification_period: "90d"
  min_trade_count: 50
  
scoring:
  sharpe_weight: 0.35
  winrate_weight: 0.25
  drawdown_weight: 0.20
  consistency_weight: 0.20
  
updates:
  frequency: "7d"
  deviation_trigger: 5 # percent
  max_gas_price: "1gwei"
  
security:
  min_stake: 10000 # DIA tokens
  stake_contract: "0x..." # Lasernet staking
  slashing_percentage: 20
  
consensus:
  min_feeders: 3
  max_score_variance: 10 # percent
  dispute_period: "24h"
```

### Performance Metric Calculations

**Sharpe Ratio:**
```python
def calculate_sharpe(returns, risk_free_rate=0.02):
    """
    Calculate annualized Sharpe ratio
    
    Args:
        returns: List of daily returns
        risk_free_rate: Annual risk-free rate (default 2%)
    
    Returns:
        float: Sharpe ratio (higher is better)
    """
    excess_returns = returns - (risk_free_rate / 365)
    return (np.mean(excess_returns) / np.std(excess_returns)) * np.sqrt(365)
```

**Win Rate:**
```python
def calculate_win_rate(trades):
    """
    Calculate percentage of profitable trades
    
    Args:
        trades: List of trade objects with 'pnl' field
    
    Returns:
        float: Win rate (0-1)
    """
    profitable = sum(1 for t in trades if t.pnl > 0)
    return profitable / len(trades)
```

**Max Drawdown:**
```python
def calculate_max_drawdown(cumulative_returns):
    """
    Calculate maximum peak-to-trough decline
    
    Args:
        cumulative_returns: Cumulative returns over time
    
    Returns:
        float: Max drawdown (negative value, closer to 0 is better)
    """
    peak = cumulative_returns[0]
    max_dd = 0
    
    for value in cumulative_returns:
        if value > peak:
            peak = value
        dd = (value - peak) / peak
        if dd < max_dd:
            max_dd = dd
    
    return max_dd
```

**Composite Score:**
```python
def calculate_reputation_score(metrics, weights):
    """
    Generate final reputation score (0-1000)
    
    Args:
        metrics: Dict with sharpe, winrate, drawdown, consistency
        weights: Dict with corresponding weights (must sum to 1.0)
    
    Returns:
        int: Reputation score (0-1000)
    """
    # Normalize metrics to 0-1 scale
    sharpe_norm = min(max(metrics['sharpe'] / 3.0, 0), 1)
    winrate_norm = metrics['winrate']  # Already 0-1
    drawdown_norm = 1 + metrics['drawdown']  # Convert negative to positive
    consistency_norm = metrics['consistency']  # Already 0-1
    
    # Weighted score
    score = (
        sharpe_norm * weights['sharpe'] +
        winrate_norm * weights['winrate'] +
        drawdown_norm * weights['drawdown'] +
        consistency_norm * weights['consistency']
    )
    
    return int(score * 1000)  # Scale to 0-1000
```

### Commitment Hash Generation

```python
def generate_commitment(score, solver_address, metadata):
    """
    Generate cryptographic commitment for privacy
    
    Args:
        score: Reputation score (0-1000)
        solver_address: Solver's Ethereum address
        metadata: Dict with verification details
    
    Returns:
        bytes32: Keccak256 hash commitment
    """
    import hashlib
    from eth_utils import keccak
    
    # Generate random salt
    salt = os.urandom(32)
    
    # Pack data
    data = {
        'score': score,
        'solver': solver_address,
        'verified_at': int(time.time()),
        'verification_period': metadata['period'],
        'trade_count': metadata['trades'],
        'salt': salt.hex()
    }
    
    # Create commitment
    packed = json.dumps(data, sort_keys=True).encode()
    commitment = keccak(packed)
    
    # Store salt off-chain for later verification
    store_salt(solver_address, salt, data)
    
    return commitment
```

---

## Smart Contracts

### VPNLReputationAggregator.sol (Lasernet)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VPNLReputationAggregator
 * @notice Decentralized reputation aggregation on DIA Lasernet
 * @dev Implements consensus mechanism for multi-feeder verification
 */
contract VPNLReputationAggregator {
    
    // ============ State Variables ============
    
    struct ReputationData {
        uint256 score;              // 0-1000 scaled score
        bytes32 commitmentHash;     // Cryptographic commitment
        uint256 lastUpdate;         // Timestamp of last update
        address[] feeders;          // Nodes that reported this
        uint8 consensusCount;       // Number of confirming feeders
        bool active;                // Active verification status
        bool disputed;              // Under dispute flag
    }
    
    struct FeederInfo {
        uint256 stake;              // Staked DIA tokens
        uint256 successfulReports;  // Accurate reports count
        uint256 slashedAmount;      // Total slashed
        bool active;                // Registration status
        uint256 registeredAt;       // Registration timestamp
    }
    
    mapping(address => ReputationData) public solverScores;
    mapping(address => FeederInfo) public feeders;
    mapping(address => mapping(address => bool)) public feederReported;
    
    uint256 public constant MIN_STAKE = 10000 ether; // 10k DIA
    uint8 public constant CONSENSUS_THRESHOLD = 3;
    uint256 public constant MAX_SCORE_VARIANCE = 100; // 10% of 1000
    uint256 public constant DISPUTE_PERIOD = 1 days;
    uint256 public constant SLASHING_PERCENTAGE = 20;
    
    address public governance;
    address public diaToken;
    
    // ============ Events ============
    
    event ReputationSubmitted(
        address indexed solver,
        address indexed feeder,
        uint256 score,
        bytes32 commitmentHash
    );
    
    event ReputationUpdated(
        address indexed solver,
        uint256 score,
        bytes32 commitmentHash,
        uint8 consensusCount
    );
    
    event FeederRegistered(
        address indexed feeder,
        uint256 stake
    );
    
    event FeederSlashed(
        address indexed feeder,
        uint256 amount,
        string reason
    );
    
    event DisputeRaised(
        address indexed solver,
        address indexed challenger,
        string reason
    );
    
    // ============ Modifiers ============
    
    modifier onlyRegisteredFeeder() {
        require(feeders[msg.sender].active, "Not registered feeder");
        require(feeders[msg.sender].stake >= MIN_STAKE, "Insufficient stake");
        _;
    }
    
    modifier onlyGovernance() {
        require(msg.sender == governance, "Only governance");
        _;
    }
    
    // ============ Constructor ============
    
    constructor(address _diaToken, address _governance) {
        diaToken = _diaToken;
        governance = _governance;
    }
    
    // ============ Core Functions ============
    
    /**
     * @notice Register as a feeder node
     * @param stakeAmount Amount of DIA to stake
     */
    function registerFeeder(uint256 stakeAmount) external {
        require(stakeAmount >= MIN_STAKE, "Insufficient stake");
        require(!feeders[msg.sender].active, "Already registered");
        
        // Transfer stake
        IERC20(diaToken).transferFrom(msg.sender, address(this), stakeAmount);
        
        feeders[msg.sender] = FeederInfo({
            stake: stakeAmount,
            successfulReports: 0,
            slashedAmount: 0,
            active: true,
            registeredAt: block.timestamp
        });
        
        emit FeederRegistered(msg.sender, stakeAmount);
    }
    
    /**
     * @notice Submit reputation score for a solver
     * @param solver Solver address
     * @param score Reputation score (0-1000)
     * @param commitmentHash Cryptographic commitment
     */
    function submitReputation(
        address solver,
        uint256 score,
        bytes32 commitmentHash
    ) external onlyRegisteredFeeder {
        require(solver != address(0), "Invalid solver");
        require(score <= 1000, "Score out of range");
        require(commitmentHash != bytes32(0), "Invalid commitment");
        require(!feederReported[solver][msg.sender], "Already reported");
        
        ReputationData storage rep = solverScores[solver];
        
        // First report for this solver
        if (rep.lastUpdate == 0) {
            rep.score = score;
            rep.commitmentHash = commitmentHash;
            rep.lastUpdate = block.timestamp;
            rep.feeders.push(msg.sender);
            rep.consensusCount = 1;
            rep.active = false; // Not active until consensus
        } else {
            // Check variance with existing score
            uint256 variance = score > rep.score 
                ? score - rep.score 
                : rep.score - score;
            
            if (variance <= MAX_SCORE_VARIANCE) {
                // Within acceptable range - add to consensus
                rep.feeders.push(msg.sender);
                rep.consensusCount++;
                
                // Update to median score
                rep.score = _calculateMedian(rep.feeders, solver);
                
                // Activate if consensus reached
                if (rep.consensusCount >= CONSENSUS_THRESHOLD) {
                    rep.active = true;
                    emit ReputationUpdated(
                        solver,
                        rep.score,
                        rep.commitmentHash,
                        rep.consensusCount
                    );
                }
            } else {
                // High variance - flag for dispute
                rep.disputed = true;
                emit DisputeRaised(
                    solver,
                    msg.sender,
                    "Score variance exceeds threshold"
                );
            }
        }
        
        feederReported[solver][msg.sender] = true;
        feeders[msg.sender].successfulReports++;
        
        emit ReputationSubmitted(solver, msg.sender, score, commitmentHash);
    }
    
    /**
     * @notice Get reputation score and metadata
     * @param solver Solver address
     * @return score Reputation score (0-1000)
     * @return timestamp Last update timestamp
     */
    function getValue(address solver) 
        external 
        view 
        returns (uint256 score, uint256 timestamp) 
    {
        ReputationData memory rep = solverScores[solver];
        require(rep.active, "No active reputation");
        require(!rep.disputed, "Under dispute");
        
        return (rep.score, rep.lastUpdate);
    }
    
    /**
     * @notice Check if solver has active verified reputation
     * @param solver Solver address
     * @return bool Active status
     */
    function isVerified(address solver) external view returns (bool) {
        ReputationData memory rep = solverScores[solver];
        return rep.active && 
               !rep.disputed && 
               rep.consensusCount >= CONSENSUS_THRESHOLD;
    }
    
    /**
     * @notice Slash feeder for fraudulent reporting
     * @param feeder Feeder address to slash
     * @param reason Reason for slashing
     */
    function slashFeeder(
        address feeder,
        string calldata reason
    ) external onlyGovernance {
        require(feeders[feeder].active, "Not active feeder");
        
        uint256 slashAmount = 
            (feeders[feeder].stake * SLASHING_PERCENTAGE) / 100;
        
        feeders[feeder].stake -= slashAmount;
        feeders[feeder].slashedAmount += slashAmount;
        
        // Deactivate if stake falls below minimum
        if (feeders[feeder].stake < MIN_STAKE) {
            feeders[feeder].active = false;
        }
        
        emit FeederSlashed(feeder, slashAmount, reason);
    }
    
    /**
     * @notice Resolve dispute for a solver's reputation
     * @param solver Solver address
     * @param correctScore Verified correct score
     */
    function resolveDispute(
        address solver,
        uint256 correctScore
    ) external onlyGovernance {
        ReputationData storage rep = solverScores[solver];
        require(rep.disputed, "Not disputed");
        
        rep.score = correctScore;
        rep.disputed = false;
        rep.active = true;
        
        // Slash feeders with significant variance
        for (uint i = 0; i < rep.feeders.length; i++) {
            // Implementation: compare each feeder's reported score
            // Slash if variance > threshold
        }
    }
    
    // ============ Internal Functions ============
    
    function _calculateMedian(
        address[] memory reportingFeeders,
        address solver
    ) internal view returns (uint256) {
        // Implementation: collect all scores and return median
        // This simplifies consensus and reduces manipulation
        return solverScores[solver].score; // Placeholder
    }
    
    // ============ Admin Functions ============
    
    function updateGovernance(address newGovernance) 
        external 
        onlyGovernance 
    {
        governance = newGovernance;
    }
    
    function updateMinStake(uint256 newMinStake) 
        external 
        onlyGovernance 
    {
        // Implementation with timelock
    }
}
```

### Cross-Chain Bridge Contract (Arbitrum)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./VPNLRegistry.sol";

/**
 * @title VPNLLasernetBridge
 * @notice Syncs reputation from Lasernet to Arbitrum registry
 * @dev Uses DIA Spectra for cross-chain messaging
 */
contract VPNLLasernetBridge {
    
    VPNLRegistry public registry;
    address public diaSpectra;
    address public governance;
    
    mapping(address => uint256) public lastSync;
    
    event ReputationSynced(
        address indexed solver,
        uint256 score,
        uint256 timestamp
    );
    
    constructor(
        address _registry,
        address _diaSpectra,
        address _governance
    ) {
        registry = VPNLRegistry(_registry);
        diaSpectra = _diaSpectra;
        governance = _governance;
    }
    
    /**
     * @notice Sync reputation from Lasernet via DIA Spectra
     * @param solver Solver address
     */
    function syncFromLasernet(address solver) external {
        // Query DIA Spectra for latest reputation
        (uint256 score, uint256 timestamp) = 
            IDIASpectra(diaSpectra).getMessage("VPNL", solver);
        
        require(timestamp > lastSync[solver], "Already synced");
        
        // Update local registry
        // Note: Adapt based on VPNLRegistry interface
        bytes32 commitmentHash = keccak256(abi.encodePacked(score, timestamp));
        uint256 expiresAt = timestamp + 180 days;
        
        // This requires adding a sync function to VPNLRegistry
        // or using existing verify() with bridge authorization
        
        lastSync[solver] = timestamp;
        
        emit ReputationSynced(solver, score, timestamp);
    }
}
```

---

## Economic Model

### Feeder Incentives

**Staking Requirements:**
- Minimum Stake: 10,000 DIA tokens (~$10k at current prices)
- Stake is locked while feeder is active
- Can be withdrawn after deregistration + dispute period

**Earning Rewards:**
```
Monthly Rewards = Base_Reward × Accuracy_Multiplier × Uptime_Multiplier

Where:
- Base_Reward: 100 DIA tokens per month
- Accuracy_Multiplier: 1.0-2.0 based on consensus participation
- Uptime_Multiplier: 0.5-1.0 based on node availability
```

**Example:**
- Feeder with 95% accuracy, 99% uptime
- Monthly reward: 100 × 1.9 × 0.99 = 188 DIA tokens
- Annual yield: ~22.5% on 10k stake

**Slashing Conditions:**
1. **False Reporting (20% slash):**
   - Score variance >10% from consensus
   - Proven manipulation attempt
   - Repeated accuracy issues

2. **Downtime (5% slash):**
   - Offline >7 consecutive days
   - Missing >50% of expected updates

3. **Dispute Loss (30% slash):**
   - Governance determines feeder submitted fraudulent data
   - Evidence of collusion

### Consensus Economics

**Multi-Feeder Validation:**
- Require 3+ feeders to confirm each reputation
- Use median score to reduce manipulation
- Outliers (>10% variance) trigger dispute process

**Game Theory:**
- **Honest Reporting:** Earn steady rewards, build reputation
- **False Reporting:** Risk 20-30% stake loss
- **Collusion:** Requires coordinating 3+ independent feeders (economically infeasible)

**Break-Even Analysis:**
```
Cost of Manipulation:
- Minimum 3 colluding feeders
- 3 × 10,000 DIA = 30,000 DIA at risk
- Slashing penalty: 30,000 × 0.30 = 9,000 DIA loss

Benefit of Manipulation:
- Boost one solver's score from 0.50 → 0.85
- Collateral reduction: $100k → $15k = $85k freed
- But protocol can still set minimum floors
- Actual exploitable value: ~$20-30k max

Result: Not economically rational
```

---

## Integration Timeline

### Week 1-2: Setup & Research
- [ ] Clone `decentral-feeder` repository
- [ ] Study DIA Lasernet architecture and tooling
- [ ] Set up local Lasernet testnet environment
- [ ] Deploy test DIA token contract for staking
- [ ] Join DIA Discord/Telegram for technical support

**Deliverables:**
- Working local development environment
- Understanding of DIA's feeder architecture
- Initial technical questions documented

---

### Week 3-4: Feeder Development
- [ ] Modify DIA feeder for reputation scoring
- [ ] Implement performance metric calculations
- [ ] Add zkTLS proof validation (mock for now)
- [ ] Build commitment hash generation
- [ ] Create feeder configuration system

**Deliverables:**
- Functional VPNL feeder node (local)
- Unit tests for scoring algorithms
- Docker container build

---

### Week 5-6: Smart Contract Development
- [ ] Write `VPNLReputationAggregator.sol`
- [ ] Implement consensus mechanism
- [ ] Add slashing logic
- [ ] Deploy to Lasernet testnet
- [ ] Create bridge contract for Arbitrum sync

**Deliverables:**
- Audited smart contracts
- Testnet deployment
- Integration tests

---

### Week 7-8: Integration Testing
- [ ] Deploy 3+ test feeder nodes
- [ ] Simulate solver verifications
- [ ] Test consensus with conflicting reports
- [ ] Stress test dispute resolution
- [ ] Validate cross-chain sync to Arbitrum

**Deliverables:**
- Test report with metrics
- Bug fixes and optimizations
- Performance benchmarks

---

### Week 9-10: Mainnet Preparation
- [ ] Security audit by third party
- [ ] Coordinate with DIA team for mainnet deployment
- [ ] Create feeder operator documentation
- [ ] Build monitoring dashboard
- [ ] Prepare launch announcement

**Deliverables:**
- Security audit report
- Operator onboarding guide
- Mainnet deployment plan

---

### Week 11-12: Mainnet Launch
- [ ] Deploy contracts to Lasernet mainnet
- [ ] Onboard first 5+ feeder operators
- [ ] Monitor initial verifications
- [ ] Iterate based on feedback
- [ ] Integrate with first protocol

**Deliverables:**
- Live mainnet deployment
- First solvers verified via Lumina
- Protocol integration example

---

## Security Considerations

### Threat Model

**1. Feeder Collusion**
- **Attack:** 3+ feeders coordinate to boost/suppress scores
- **Mitigation:** 
  - Economic disincentive (30k+ DIA at risk)
  - Geographic distribution requirements
  - Reputation-weighted governance can blacklist colluders
  - Protocols can set minimum collateral floors regardless of score

**2. Sybil Attacks**
- **Attack:** Single entity runs multiple feeders
- **Mitigation:**
  - High staking requirement (10k DIA per feeder)
  - KYC for high-stake feeders (optional governance decision)
  - Pattern detection for correlated behavior
  - Diminishing rewards for feeders with similar IPs

**3. zkTLS Manipulation**
- **Attack:** Fake exchange API proofs
- **Mitigation:**
  - Multiple independent zkTLS implementations
  - Cross-reference with on-chain DEX data
  - Anomaly detection (impossible Sharpe ratios, etc.)
  - Manual review for high-value verifications

**4. Oracle Manipulation**
- **Attack:** Compromise DIA Spectra cross-chain messaging
- **Mitigation:**
  - DIA's existing security model (battle-tested)
  - Dual-source verification (Lasernet + Arbitrum registry)
  - Time-delayed updates reduce front-running
  - Protocols can cache reputation locally

**5. Governance Capture**
- **Attack:** Malicious actors gain control of dispute resolution
- **Mitigation:**
  - Progressive decentralization (DAO governance Phase 3)
  - Time-locked parameter changes
  - Emergency multisig override
  - Transparent on-chain governance

### Audit Requirements

**Smart Contract Audit (Before Mainnet):**
- [ ] `VPNLReputationAggregator.sol` - Full audit
- [ ] Staking/slashing logic - Critical path analysis
- [ ] Consensus mechanism - Game theory review
- [ ] Cross-chain bridge - Message verification audit

**Recommended Auditors:**
- Trail of Bits
- OpenZeppelin
- Quantstamp
- ConsenSys Diligence

**Budget:** $10-15k for comprehensive audit

---

## Open Questions

### For DIA Team

1. **Staking Infrastructure:**
   - Can VPNL feeders use DIA's existing staking contracts?
   - Or do we need custom staking logic?
   - What's the recommended stake amount for custom oracle types?

2. **zkTLS Integration:**
   - Timeline for public zkTLS infrastructure release?
   - Can VPNL get early access for testing?
   - Are there reference implementations we can use?

3. **Lasernet Economics:**
   - Are there gas subsidies for new oracle types?
   - What's the cost per reputation update?
   - How to optimize for frequent updates (deviation-based)?

4. **Cross-Chain Delivery:**
   - Best practices for DIA Spectra integration?
   - How to handle chain-specific reputation queries?
   - Can we batch updates for cost efficiency?

5. **Dispute Resolution:**
   - Does DIA have standard dispute processes we can adopt?
   - How to handle fraudulent feeder detection?
   - What's the typical slashing percentage in DIA ecosystem?

6. **Partnership Details:**
   - Can VPNL be featured as a DIA Lumina use case?
   - Joint marketing/announcement opportunities?
   - Technical support during integration?

### For VPNL Community

1. **Feeder Operations:**
   - Who wants to run the first feeder nodes?
   - What hardware/bandwidth requirements are acceptable?
   - Should we subsidize early feeders?

2. **Scoring Methodology:**
   - Are the metric weights appropriate? (Sharpe 35%, Win Rate 25%, etc.)
   - Should we add more metrics (volatility, consistency)?
   - How to handle different trading strategies (HFT vs. long-term)?

3. **Consensus Parameters:**
   - Is 3 feeders enough for consensus?
   - Should variance threshold be 10% or stricter?
   - How long should dispute periods last?

4. **Integration Priorities:**
   - Which protocols should we integrate first?
   - What SDK features are most needed?
   - Should we support non-EVM chains initially?

---

## Success Metrics

### Phase 2 Launch (Q1-Q2 2026)

**Technical Metrics:**
- ✅ 5+ independent feeder operators running nodes
- ✅ 50+ solvers verified via Lumina
- ✅ 99.9% oracle uptime
- ✅ <500ms average query latency
- ✅ <$0.01 per reputation update (gas costs)

**Security Metrics:**
- ✅ Zero successful manipulation attempts
- ✅ <0.1% fraud rate (slashing events)
- ✅ 100% consensus on non-disputed reputations
- ✅ <1% of verifications requiring manual review

**Economic Metrics:**
- ✅ Positive ROI for feeder operators (>15% APY)
- ✅ Total Value Secured: >$5M in solver collateral
- ✅ Cost per verification: <$50 (including off-chain compute)

**Adoption Metrics:**
- ✅ 3+ protocols integrated and using VPNL data
- ✅ $10M+ in intents routed using VPNL reputation
- ✅ Measurable capital efficiency gains (target: 40%+)

### Phase 3 Goals (Q3 2026)

**Decentralization:**
- ✅ 15+ independent feeder operators
- ✅ Geographic distribution across 5+ countries
- ✅ DAO governance transition complete
- ✅ Community-led feeder onboarding

**Scale:**
- ✅ 200+ verified solvers
- ✅ 10+ protocol integrations
- ✅ Reputation data on 20+ chains via DIA Spectra

**Innovation:**
- ✅ zkTLS integration live (Phase 2+ feature)
- ✅ Machine learning fraud detection pilot
- ✅ Time-weighted reputation decay implemented

---

## Resources

### Technical Documentation

**DIA Lumina:**
- Website: https://www.diadata.org/lumina/
- Docs: https://docs.diadata.org/
- GitHub: https://github.com/diadata-org
- Feeder Repo: https://github.com/diadata-org/decentral-feeder

**VPNL:**
- GitHub: https://github.com/vpnlnetwork/vpnl
- Whitepaper: [docs/whitepaper.md](whitepaper.md)
- Architecture: [docs/architecture.md](architecture.md)

### Community

**DIA:**
- Discord: https://discord.gg/dia
- Telegram: https://t.me/diadata
- Twitter: @DIAdata_org

**VPNL:**
- Telegram: https://t.me/vpnlnetwork
- Twitter: @vpnlnetwork *(if available)*

### Development Tools

**Lasernet:**
- RPC: https://rpc.lasernet.diadata.org
- Explorer: https://explorer.lasernet.diadata.org
- Faucet: *(request in Discord)*

**Testing:**
- Hardhat config for Lasernet
- Foundry integration
- DIA oracle mocks for local testing

---

## Contact

For questions about this integration:

**VPNL Team:**
- Email: [your-email]
- Telegram: @vpnlnetwork

**DIA Partnership Inquiries:**
- Email: partnerships@diadata.org
- Discord: #partnerships channel

---

**Document Version:** v0.1.0-draft  
**Last Updated:** October 19, 2025  
**Status:** Active Development  
**Next Review:** Week of Integration Kickoff

---

## Appendix: Code Examples

### Feeder Node Quickstart

```bash
# Clone VPNL feeder repository
git clone https://github.com/vpnlnetwork/vpnl-feeder
cd vpnl-feeder

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your keys

# Build Docker image
docker build -t vpnl-feeder:latest .

# Run feeder node
docker-compose up -d

# Monitor logs
docker logs -f vpnl-feeder
```

### Query Reputation (TypeScript)

```typescript
import { ethers } from 'ethers';

const LASERNET_RPC = 'https://rpc.lasernet.diadata.org';
const AGGREGATOR_ADDRESS = '0x...'; // VPNLReputationAggregator

const provider = new ethers.JsonRpcProvider(LASERNET_RPC);
const contract = new ethers.Contract(
  AGGREGATOR_ADDRESS,
  ['function getValue(address) view returns (uint256, uint256)'],
  provider
);

async function getReputation(solverAddress: string) {
  const [score, timestamp] = await contract.getValue(solverAddress);
  return {
    score: score.toNumber(),
    timestamp: new Date(timestamp.toNumber() * 1000),
    tier: score >= 800 ? 'Expert' : score >= 600 ? 'Advanced' : 'Emerging'
  };
}
```

### Calculate Collateral (Solidity)

```solidity
function calculateRequiredCollateral(
    address solver,
    uint256 intentValue
) public view returns (uint256) {
    (uint256 score, uint256 timestamp) = 
        vpnlAggregator.getValue(solver);
    
    // Check if verification is recent (< 30 days old)
    if (block.timestamp - timestamp > 30 days) {
        return intentValue; // Expired: 100% collateral
    }
    
    // Risk-adjusted collateral: C = C_max * (1 - α * score/1000)
    // Using α = 0.8
    uint256 reduction = (intentValue * 800 * score) / 1000000;
    return intentValue - reduction;
}
```

---

*This is a living document. Contributions and feedback welcome via GitHub issues.*