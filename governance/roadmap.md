# Governance & Roadmap (Decentralization Path)

VPNL aims to be a **neutral, open reputation oracle**. The code here is MIT-licensed;
operations are performed by independent participants. This roadmap outlines the path
from initial single-writer deployments to a decentralized multi-operator network.

## Phase 0 — Single Writer (MVP)

- Oracle Alpha: single-writer, public-read contract for fast demos.
- Score cadence: daily refresh; staleness bound enforced on-chain.
- Public transparency: events + explorer to view current scores.

**Exit criteria**
- Reference integrations live (e.g., Uniswap v4 gating hook).
- 50–200 active identities with scores.

## Phase 1 — Multi-Feeder via DIA (Credible Neutrality)

- Introduce **Feeder Operators** that recompute inputs and sign score updates.
- Aggregation: median/committee; slashing or reputation for misreporting.
- Distribution: publish on DIA Lasernet; read across chains via Spectra.
- Feeder registry: list pubkeys + minimal stake/attestation.

**Exit criteria**
- ≥5 independent feeders; ≥99.5% oracle availability.
- ≥3 production integrations (DEX hooks / protocols).

## Phase 2 — Open Registry & Community Standards

- Public **schema registry** for scores (Trader / LP / Solver, etc.).
- On-chain governance for parameter changes (bounds, freshness windows).
- Community-maintained reference models and test vectors.

**Exit criteria**
- Governance process adopted; external PRs merging changes.
- ≥10 feeders; ≥5 integrator protocols.

## Phase 3 — Federation / DAO (Optional)

- Tokenless or minimal-governance DAO to coordinate specs and emergencies.
- Emergency pause mechanism with strict quorum and sunset clauses.
- Budget for audits, bounties, infra grants (if needed).

**Principles**
- Privacy-first: publish **scores**, not raw personal data.
- Open participation: no entity lock-in; operators can join/exit.
- Transparency: configs, contracts, and processes are public.
