# VPNL — Verifiable PnL

> *The trust infrastructure for competitive intent markets.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built for ERC-7683](https://img.shields.io/badge/Built%20for-ERC--7683-3C3C3D.svg)]()
[![Deployed: Arbitrum Sepolia](https://img.shields.io/badge/Deployed-Arbitrum%20Sepolia-orange.svg)](https://sepolia.arbiscan.io/address/0xD3Acf580A28977D24da7d20364A2F557606d439A)
[![Powered by DIA Lumina](https://img.shields.io/badge/Powered%20by-DIA%20Lumina-orange.svg)]()

-----

## The Problem

DeFi spent a decade removing human judgment from markets. AMMs replaced market makers. Orderbooks replaced negotiation. Algorithms replaced discretion.

It worked — for simple, single-chain, liquid swaps.

Then intent markets arrived.

Intent protocols reintroduce what algorithms can’t provide: competitive human optimization. Solvers hold inventory across chains in anticipation of flow, route orders across venues, and compete to deliver the best outcome for users. The result is better prices, cross-chain execution, and capital efficiency that no orderbook or AMM can match.

But competitive discretionary markets have a structural requirement that mechanical markets don’t: **trust.**

When a solver commits to fill your cross-chain order, you’re relying on their infrastructure, their inventory, their incentive to perform. The protocol needs to know how much collateral to require. The user needs to know their order will be filled. New solvers need a way to prove themselves without posting 100% collateral on every trade.

Without reputation infrastructure, intent markets stay small, overcollateralized, and gated behind centralized allowlists — defeating the purpose entirely.

-----

## What VPNL Is

VPNL is the verifiable PnL layer for ERC-7683 intent markets.

It derives solver performance scores directly from on-chain settlement events — no self-reporting, no trusted intermediaries. Scores are committed to an on-chain registry and delivered cross-chain via DIA Lumina, making them queryable by any protocol on any chain.

The ERC-7683 standard — co-authored by Uniswap Labs and Across Protocol — explicitly identified this gap in its Security Considerations:

> *“We hope that this standard can eventually support an ERC dedicated to standardizing a safe, trustless, crosschain verification system.”*

VPNL is that system.

-----

## How It Works

### Data Source

Every ERC-7683 compliant settlement emits verifiable on-chain data:

```
Open event → orderId, resolvedOrder (maxSpent, minReceived, fillInstructions)
fill() call → actual execution, timing, destination chain delivery
```

VPNL indexes these events across all compliant settlers. The blockchain is the source of truth — not solver claims, not protocol attestations.

### Scoring Model

From settlement events, VPNL derives three universal base metrics for v1:

|Metric                 |Definition                                     |Source                   |
|-----------------------|-----------------------------------------------|-------------------------|
|**Fill Rate**          |Fills completed / orders opened by solver      |Open + fill events       |
|**Deadline Adherence** |Fills before `fillDeadline` / total fills      |Timestamp vs fillDeadline|
|**Activity Continuity**|Active epochs / total epochs since registration|Epoch tracking           |

Each normalized to [0,1]. Composite score is a weighted average with governance-adjustable weights.

Extended metrics (v2, requires DIA oracle integration):

|Metric                     |Definition                                          |
|---------------------------|----------------------------------------------------|
|**Price Quality**          |Realized fill price vs DIA oracle price at fill time|
|**Capital Efficiency**     |Actual output vs maxSpent ceiling                   |
|**Latency**                |Time between Open event and fill(), chain-normalized|
|**Adverse Selection Ratio**|Orders quoted vs actually filled                    |
|**Stress Performance**     |Fill rate during high-volatility windows            |

### Commitment Scheme

Raw metrics never touch the chain. Only cryptographic commitments:

```
commitmentHash = keccak256(score || salt || context)
```

Zero PII. Privacy-preserving. ZK-ready for v2.

### Cross-Chain Delivery

DIA Lumina delivers scores across 140+ chains via Spectra. Any protocol on any chain can query a solver’s VPNL score natively — no bridge assumptions, no trusted relayer.

-----

## For Protocols: Collateral Policy Integration

Minimal integration interface:

```solidity
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
```

Example risk-adjusted collateral policy:

```solidity
function calculateCollateral(address solver, uint256 intentValue)
    public view returns (uint256)
{
    if (!vpnlRegistry.isVerified(solver)) {
        return intentValue;           // 100% for unverified
    }
    return intentValue * 15 / 100;   // 15% for verified (protocol-defined)
}
```

**Capital efficiency at scale:**

|Solver Tier      |Collateral Required|100 Solvers     |
|-----------------|-------------------|----------------|
|Unverified       |100% ($100k)       |$10M locked     |
|Verified (VPNL)  |15% ($15k)         |$1.5M locked    |
|**Freed capital**|                   |**$8.5M (~85%)**|

-----

## Architecture

```
ERC-7683 Settlement Events (all compliant protocols)
    ↓
VPNL Indexer (derives metrics from Open + fill events)
    ↓
Scoring Model (weighted composite, epoch-based, decay function)
    ↓
VPNLRegistry (Arbitrum — commitment hashes, no PII)
    ↓
DIA Lumina (decentralized oracle delivery)
    ↓
DIA Spectra (140+ chains)
    ↓
Protocol Collateral Policy (queryable anywhere)
```

-----

## The TradFi Parallel

Intent markets are DeFi’s RFQ markets. Solvers are market makers. The trust infrastructure that makes these markets work in traditional finance — prime broker counterparty assessment, ECN reputation scoring, CLS membership tiers — is bilateral, private, gatekept, and controlled by incumbents.

VPNL rebuilds that infrastructure on open, permissionless, programmable rails:

|TradFi                        |VPNL Equivalent                       |
|------------------------------|--------------------------------------|
|Prime broker credit assessment|On-chain performance registry         |
|ECN reputation scoring        |Continuous epoch-based scoring        |
|CLS membership tiers          |Verified / unverified collateral tiers|
|Audited PnL track record      |Verifiable PnL from settlement events |
|Bilateral credit agreements   |Protocol-queryable score interface    |

The function is identical. The architecture is open.

-----

## Relationship to Cred Protocol

VPNL and Cred Protocol are complementary, not competitive.

**Cred Protocol** scores financial behavior — borrowing, repayment, collateral management. It answers: *is this entity creditworthy?*

**VPNL** scores operational execution — fill rates, latency, price quality under pressure. It answers: *does this entity perform as a market maker?*

A solver could be perfectly creditworthy and a terrible filler. Or an excellent filler with thin capital. Protocols need both signals for complete counterparty assessment.

Together they provide the full institutional-grade picture that intent markets need to absorb serious capital.

-----

## Deployment

|Network         |Contract    |Address                                                                                                                       |Status      |
|----------------|------------|------------------------------------------------------------------------------------------------------------------------------|------------|
|Arbitrum Sepolia|VPNLRegistry|[`0xD3Acf580A28977D24da7d20364A2F557606d439A`](https://sepolia.arbiscan.io/address/0xD3Acf580A28977D24da7d20364A2F557606d439A)|Testnet live|
|Arbitrum One    |VPNLRegistry|—                                                                                                                             |Post-audit  |

-----

## Quickstart

```bash
# Install
npm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy locally
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost

# Deploy testnet
npx hardhat run scripts/deploy.js --network arbitrum-sepolia
```

-----

## Roadmap

**Phase 1 — Foundation**

- [ ] Security audit
- [ ] Arbitrum mainnet deployment
- [ ] First protocol integration (collateral policy)
- [ ] Public subgraph + open API

**Phase 2 — Decentralization**

- [ ] DIA Lumina feeder nodes
- [ ] zkTLS for off-chain data verification
- [ ] Extended scoring metrics (price quality, latency, stress performance)
- [ ] Cross-chain score delivery via Spectra

**Phase 3 — Ecosystem**

- [ ] TypeScript + Python SDKs
- [ ] ERC-7683 subtype for inline reputation attestation via `fillerData`
- [ ] 10+ protocol integrations
- [ ] Community governance for scoring model parameters

-----

## Project Structure

```
vpnl/
├── contracts/          # VPNLRegistry.sol — core on-chain registry
├── schemas/            # W3C VC-compatible performance credential schemas
├── scripts/            # Deployment + verification scripts
├── test/               # Unit tests
├── docs/               # Architecture, scoring model spec, DIA integration
├── deployments/        # Network deployment records
└── demo/               # Testnet explorer UI
```

-----

## Resources

- 🌐 Website: [vpnl.io](https://vpnl.io)
- 📚 Docs: [`/docs`](docs/)
- 💬 Telegram: [t.me/vpnlnetwork](https://t.me/vpnlnetwork)
- 🐦 Twitter: [@vpnlnetwork](https://twitter.com/vpnlnetwork)
- 🔗 DIA Lumina: [diadata.org/lumina](https://www.diadata.org/lumina/)
- 📄 ERC-7683: [eips.ethereum.org/EIPS/eip-7683](https://eips.ethereum.org/EIPS/eip-7683)

-----

## Contributing

VPNL is open source and welcomes contributions. See <CONTRIBUTING.md>.

## License

MIT — see <LICENSE>.

-----

*VPNL: Open standards for verifiable solver performance.*
*Building the trust infrastructure that competitive intent markets require.*