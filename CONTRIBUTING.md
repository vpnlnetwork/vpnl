# Contributing to VPNL

Thanks for helping build the **Verifiable Performance Network Layer** — open standards for solver reputation and risk-adjusted routing across the Open Intents ecosystem.

---

## Quick Start (Dev)

**Requirements**
- Node.js ≥ 20
- npm ≥ 9
- Git

**Install**
```bash
git clone https://github.com/vpnlnetwork/vpnl.git
cd vpnl
npm install
```

**Test**
```bash
npx hardhat test
```

**Local node + deploy**
```bash
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
node scripts/populate-testdata.js
```

---

## Claude (Anthropic) Integration

You can use Claude locally to summarize, analyze, or generate documentation.

1. Create an Anthropic API key: https://console.anthropic.com/  
2. Set it locally (never commit this key):
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```
3. Run:
```bash
node claude.js
```

Scripts like `ask-file.js` and `ask-multi.js` can analyze repo files interactively.  
See inline comments for usage examples.

---

## Security & Responsible Disclosure

- Testnet-only deployment; see **SECURITY.md** for status.  
- Email vulnerabilities privately to: **vpnlnetwork@proton.me**  
- Never commit secrets or API keys.

**Ensure `.gitignore` includes:**
```
.env
*.env
.replit
```

---

## Contact

- Issues → GitHub  
- Security → vpnlnetwork@proton.me  
- Community → [Telegram](https://t.me/vpnlnetwork)