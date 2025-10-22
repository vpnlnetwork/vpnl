# Security & Operational Posture

**Project:** VPNL — Verifiable Performance Network Layer  
**Network:** Arbitrum Sepolia (testnet)  
**Contract:** [`0xD3Acf580A28977D24da7d20364A2F557606d439A`](https://sepolia.arbiscan.io/address/0xD3Acf580A28977D24da7d20364A2F557606d439A)

---

## Overview

VPNL provides open, verifiable reputation data for intent-based protocols.  
The system stores **cryptographic commitments** to solver performance while keeping all personally identifiable information (PII) off-chain.

Current deployment is **testnet-only**, with a focus on functional verification and ecosystem integration.

---

## Roles & Access Control

| Role | Description | Implementation (Phase 1) | Planned (Phase 2 + DIA) |
|------|--------------|---------------------------|---------------------------|
| **Admin** | Can update verifier list, pause, or upgrade contracts | Single multisig (testnet) | DAO governance via DIA Lasernet |
| **Verifier** | Issues and revokes solver verifications | Single trusted operator | Permissionless feeder nodes (staking + slashing) |
| **User / Solver** | Requests verification and presents proof to protocols | Any address | Same, with cross-chain attestation via DIA Spectra |

---

## Known Gaps & Planned Mitigations

| Area | Current Status | Planned Resolution |
|------|----------------|--------------------|
| Centralized verifier | Single trusted account for initial testing | DIA Lumina permissionless feeders (Phase 2) |
| Emergency pause | Not yet implemented | Add OpenZeppelin `Pausable` + `PAUSER_ROLE` |
| Timelock / multisig | Manual admin control | 2/3 multisig + optional OZ `TimelockController` |
| Rate limiting | Not enforced | Add per-solver cooldown or minimal fee |
| Max verification duration | Unbounded | Enforce `MAX_EXPIRY` parameter |
| Public audit | Pending | Third-party audit before mainnet (Consensys / OZ / Trail of Bits) |

---

## Incident Response

- **Scope:** Testnet only (no user funds at risk).  
- **If a bug is discovered:**  
  1. Pause or revoke affected verifications (when `Pausable` is live).  
  2. Post advisory to the GitHub repo and Telegram community.  
  3. Patch and redeploy; update `deployments/*.json` and README.  

Security issues can be reported privately to **vpnlnetwork@proton.me**.

---

## Roadmap Alignment

- **Phase 1 (current)** — functional testnet, audit prep, mainnet deployment, subgraph/API.  
- **Phase 2** — DIA Lumina integration (decentralized feeders + zkTLS).  
- **Phase 3** — DAO governance + cross-chain delivery (DIA Spectra).

---

## License & Assurance

- MIT License (public good)  
- No privileged withdrawal or fund movement functions  
- All writes are role-gated and publicly emitted as events  
- Future deployments will include reproducible build hashes
