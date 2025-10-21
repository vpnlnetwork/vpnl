import './style.css'
import { ethers } from 'ethers'

const REGISTRY_ABI = [
  "function isVerified(address solver) view returns (bool)",
  "function getVerification(address solver) view returns (bytes32 commitmentHash, uint256 verifiedAt, uint256 expiresAt, bool active, bool revoked, string revokeReason)",
  "function verifier() view returns (address)",
  "function owner() view returns (address)"
]

const NETWORK_CONFIG = {
  name: "Arbitrum Sepolia",
  chainId: 421614,
  rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc",
  explorer: "https://sepolia.arbiscan.io"
}

const REGISTRY_ADDRESS = "0xD3Acf580A28977D24da7d20364A2F557606d439A"

const TEST_SOLVERS = [
  { name: "Expert Solver Alpha", address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", tier: "Expert", score: 0.85 },
  { name: "Advanced Solver Beta", address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", tier: "Advanced", score: 0.65 },
  { name: "Emerging Solver Gamma", address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", tier: "Emerging", score: 0.30 },
  { name: "Expert Solver Delta", address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65", tier: "Expert", score: 0.92 }
]

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="stars"></div>
  <div class="container">
    <div class="header">
      <div class="logo">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M24 4L6 14V34L24 44L42 34V14L24 4Z" stroke="url(#gradient)" stroke-width="3" fill="none"/>
          <circle cx="24" cy="24" r="8" fill="url(#gradient)"/>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#6366f1"/>
              <stop offset="100%" style="stop-color:#a855f7"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <h1>VPNL Registry</h1>
      <p class="subtitle">Verifiable Performance Network Layer</p>
      <div class="network-badge">
        <span class="status-dot"></span>
        ${NETWORK_CONFIG.name}
      </div>
    </div>
    
    <div class="info-box">
      <div class="info-icon">ℹ️</div>
      <div>
        <h3>About This Demo</h3>
        <p>VPNL provides open reputation standards for solver verification in the Open Intents Framework. This demo connects to the live Arbitrum Sepolia testnet to query real solver verifications.</p>
      </div>
    </div>

    <div class="registry-card" id="registryInfo">
      <div class="card-header">
        <h3>📋 Registry Information</h3>
      </div>
      <div class="loading">
        <div class="spinner"></div>
        Connect to view registry details
      </div>
    </div>

    <div class="actions">
      <button id="connectBtn" class="primary-btn">
        <span class="btn-icon">🔗</span>
        Connect to Arbitrum Sepolia
      </button>
    </div>

    <div id="solversSection" class="solvers-section" style="display: none;">
      <h3>🎯 Test Solver Verifications</h3>
      <div id="solversList"></div>
    </div>

    <div id="customQuery" class="custom-query" style="display: none;">
      <h3>🔍 Custom Address Query</h3>
      <div class="input-group">
        <input type="text" id="customAddress" placeholder="Enter solver address (0x...)" />
        <button id="queryBtn" class="secondary-btn">Query</button>
      </div>
      <div id="queryResult"></div>
    </div>

    <div class="footer">
      <a href="${NETWORK_CONFIG.explorer}/address/${REGISTRY_ADDRESS}" target="_blank" class="explorer-link">
        View Contract on Arbiscan →
      </a>
    </div>
  </div>
`

let provider: ethers.JsonRpcProvider | null = null
let registry: ethers.Contract | null = null

async function connectToNode() {
  const connectBtn = document.getElementById('connectBtn') as HTMLButtonElement
  const registryInfo = document.getElementById('registryInfo')!
  const solversSection = document.getElementById('solversSection')!
  const customQuery = document.getElementById('customQuery')!
  
  try {
    connectBtn.disabled = true
    connectBtn.innerHTML = '<div class="spinner"></div> Connecting...'
    
    provider = new ethers.JsonRpcProvider(NETWORK_CONFIG.rpcUrl)
    const network = await provider.getNetwork()
    
    registry = new ethers.Contract(REGISTRY_ADDRESS, REGISTRY_ABI, provider)
    
    const owner = await registry.owner()
    const verifier = await registry.verifier()
    
    registryInfo.innerHTML = `
      <div class="card-header success">
        <h3>✅ Connected to Registry</h3>
      </div>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">Network</span>
          <span class="value">${NETWORK_CONFIG.name} <span class="chain-id">Chain ${network.chainId}</span></span>
        </div>
        <div class="info-item">
          <span class="label">Registry</span>
          <span class="value address"><a href="${NETWORK_CONFIG.explorer}/address/${REGISTRY_ADDRESS}" target="_blank">${shortenAddress(REGISTRY_ADDRESS)}</a></span>
        </div>
        <div class="info-item">
          <span class="label">Owner</span>
          <span class="value address"><a href="${NETWORK_CONFIG.explorer}/address/${owner}" target="_blank">${shortenAddress(owner)}</a></span>
        </div>
        <div class="info-item">
          <span class="label">Verifier</span>
          <span class="value address"><a href="${NETWORK_CONFIG.explorer}/address/${verifier}" target="_blank">${shortenAddress(verifier)}</a></span>
        </div>
      </div>
    `
    
    connectBtn.style.display = 'none'
    
    solversSection.style.display = 'block'
    customQuery.style.display = 'block'
    
    loadTestSolvers()
  } catch (error: any) {
    registryInfo.innerHTML = `
      <div class="card-header error">
        <h3>❌ Connection Failed</h3>
      </div>
      <div class="error-message">
        <p><strong>Error:</strong> ${error.message}</p>
        <p class="hint">Unable to connect to Arbitrum Sepolia RPC. Please try again.</p>
      </div>
    `
    connectBtn.disabled = false
    connectBtn.innerHTML = '<span class="btn-icon">🔄</span> Retry Connection'
  }
}

async function loadTestSolvers() {
  const solversList = document.getElementById('solversList')!
  
  solversList.innerHTML = '<div class="loading"><div class="spinner"></div> Loading solver verifications...</div>'
  
  const solversHtml = await Promise.all(TEST_SOLVERS.map(async (solver) => {
    try {
      const isVerified = await registry!.isVerified(solver.address)
      const verification = await registry!.getVerification(solver.address)
      
      if (isVerified) {
        const expiresAt = new Date(Number(verification.expiresAt) * 1000)
        const verifiedAt = new Date(Number(verification.verifiedAt) * 1000)
        const daysUntilExpiry = Math.floor((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        
        return `
          <div class="solver-card verified">
            <div class="card-header-inline">
              <h4>${solver.name}</h4>
              <span class="tier-badge ${solver.tier.toLowerCase()}">${solver.tier}</span>
            </div>
            <div class="solver-details">
              <div class="detail-row">
                <span class="label">Address</span>
                <span class="value address">
                  <a href="${NETWORK_CONFIG.explorer}/address/${solver.address}" target="_blank">${shortenAddress(solver.address)}</a>
                </span>
              </div>
              <div class="detail-row">
                <span class="label">Status</span>
                <span class="status-badge verified">✓ Verified</span>
              </div>
              <div class="detail-row">
                <span class="label">Score</span>
                <span class="value">
                  <div class="score-bar">
                    <div class="score-fill" style="width: ${solver.score * 100}%"></div>
                  </div>
                  <span class="score-text">${(solver.score * 100).toFixed(0)}%</span>
                </span>
              </div>
              <div class="detail-row">
                <span class="label">Verified</span>
                <span class="value">${verifiedAt.toLocaleDateString()}</span>
              </div>
              <div class="detail-row">
                <span class="label">Expires</span>
                <span class="value">${daysUntilExpiry} days</span>
              </div>
            </div>
          </div>
        `
      } else {
        return `
          <div class="solver-card unverified">
            <div class="card-header-inline">
              <h4>${solver.name}</h4>
            </div>
            <div class="solver-details">
              <div class="detail-row">
                <span class="label">Address</span>
                <span class="value address">${shortenAddress(solver.address)}</span>
              </div>
              <div class="detail-row">
                <span class="label">Status</span>
                <span class="status-badge unverified">✗ Not Verified</span>
              </div>
            </div>
          </div>
        `
      }
    } catch (error) {
      return `
        <div class="solver-card error-card">
          <h4>${solver.name}</h4>
          <div class="error-message">Failed to query verification</div>
        </div>
      `
    }
  }))
  
  solversList.innerHTML = solversHtml.join('')
}

async function queryCustomAddress() {
  const input = document.getElementById('customAddress') as HTMLInputElement
  const result = document.getElementById('queryResult')!
  const address = input.value.trim()
  
  if (!ethers.isAddress(address)) {
    result.innerHTML = '<div class="error-message">⚠️ Invalid Ethereum address format</div>'
    return
  }
  
  try {
    result.innerHTML = '<div class="loading"><div class="spinner"></div> Querying blockchain...</div>'
    
    const isVerified = await registry!.isVerified(address)
    const verification = await registry!.getVerification(address)
    
    if (isVerified) {
      const verifiedAt = new Date(Number(verification.verifiedAt) * 1000)
      const expiresAt = new Date(Number(verification.expiresAt) * 1000)
      
      result.innerHTML = `
        <div class="query-card verified">
          <div class="card-header-inline">
            <h4>✅ Verified Solver</h4>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Address</span>
              <span class="value address"><a href="${NETWORK_CONFIG.explorer}/address/${address}" target="_blank">${address}</a></span>
            </div>
            <div class="info-item">
              <span class="label">Commitment</span>
              <span class="value hash">${verification.commitmentHash}</span>
            </div>
            <div class="info-item">
              <span class="label">Verified At</span>
              <span class="value">${verifiedAt.toLocaleString()}</span>
            </div>
            <div class="info-item">
              <span class="label">Expires At</span>
              <span class="value">${expiresAt.toLocaleString()}</span>
            </div>
            <div class="info-item">
              <span class="label">Active</span>
              <span class="value">${verification.active ? '✅ Yes' : '❌ No'}</span>
            </div>
            <div class="info-item">
              <span class="label">Revoked</span>
              <span class="value">${verification.revoked ? '⚠️ Yes' : '✅ No'}</span>
            </div>
          </div>
        </div>
      `
    } else {
      result.innerHTML = `
        <div class="query-card unverified">
          <div class="card-header-inline">
            <h4>❌ Not Verified</h4>
          </div>
          <p>This address has no verification record in the VPNL Registry.</p>
        </div>
      `
    }
  } catch (error: any) {
    result.innerHTML = `<div class="error-message">❌ Query failed: ${error.message}</div>`
  }
}

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

document.getElementById('connectBtn')!.addEventListener('click', connectToNode)
document.getElementById('queryBtn')!.addEventListener('click', queryCustomAddress)

document.getElementById('customAddress')!.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    queryCustomAddress()
  }
})
