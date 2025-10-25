# Operators (Feeder / Data / Oracle)

This repo is **open-source** under MIT. Operational deployments are run by **independent operators**.
This page lists *types* of operators and how to participate — it does **not** endorse or name specific entities.

## Operator Types

- **Data Source Operators**: platforms exporting performance telemetry (e.g., trading performance).
- **Feeder Operators**: independent verifiers that recompute/validate scores and sign updates.
- **Oracle Publishers**: entities that publish aggregated values on-chain (e.g., via DIA).

## Expectations (all operators)
- Publish **no PII**; use stable, privacy-preserving identifiers (e.g., `zkHash`).
- Keep **audit trails** for data and score computations.
- Follow **rate limits** and update cadences agreed upon per schema.
- Support **dispute resolution**: be able to replay and justify a score update.
- Run with **high availability** and rotate keys safely.

## Participate

1. Read the schema in `/schemas` and the scoring docs in `/scoring/docs`.
2. Implement the adapter using templates in `/integrations` (no secrets committed).
3. Operate a feeder to recompute scores; sign updates according to the spec.
4. (When DIA-enabled) register your feeder/public key per the feeder registry.
5. Announce your availability in GitHub Discussions under **feeder-ops**.

> Note: Operators are independent. The VPNL repo maintainer does **not** run or certify operators.
