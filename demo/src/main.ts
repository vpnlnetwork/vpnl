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
  <div class="page-wrapper">
    <div class="search-header">
      <div class="search-header-container">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input 
          type="text" 
          class="search-input-header" 
          id="searchInput"
          placeholder="Search by Address / Txn Hash / Block"
        />
      </div>
    </div>

    <div class="header">
      <div class="header-container">
        <div class="logo-section">
          <img src="/vpnl-logo.png" alt="VPNL" class="logo-image" />
        </div>
        <button class="menu-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>

    <div class="container">
      <div class="contract-header">
        <div class="contract-info-header">
          <h1>Contract</h1>
          <div class="contract-address-display">
            ${REGISTRY_ADDRESS}
            <button class="copy-btn-inline" onclick="navigator.clipboard.writeText('${REGISTRY_ADDRESS}')" title="Copy">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
            <button class="qr-btn" title="QR Code">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="tabs">
        <button class="tab active">Overview</button>
        <button class="tab">Verifications</button>
        <button class="tab">Custom Query</button>
      </div>

      <div class="btn-center" id="connectSection">
        <button id="connectBtn" class="primary-btn">
          Connect to Registry
        </button>
      </div>

      <div id="overviewSection" style="display: none;">
        <div class="card">
          <div class="card-header-simple">
            <h2>Contract Information</h2>
            <a href="${NETWORK_CONFIG.explorer}/address/${REGISTRY_ADDRESS}#code" target="_blank" class="view-source-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              View Source Code
            </a>
          </div>
          <div id="contractInfo">
            <div class="loading">
              <div class="spinner"></div>
              Loading contract information...
            </div>
          </div>
        </div>
      </div>

      <div id="solversSection" style="display: none;">
        <div class="card">
          <div class="card-header-simple">
            <h2>Test Solver Verifications</h2>
          </div>
          <div id="solversList" class="solver-grid"></div>
        </div>
      </div>

      <div id="customQuerySection" style="display: none;">
        <div class="card">
          <div class="card-header-simple">
            <h2>Custom Address Query</h2>
          </div>
          <div class="search-container">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input 
              type="text" 
              class="search-input" 
              id="customAddress" 
              placeholder="Enter solver address (0x...)"
            />
          </div>
          <div class="btn-center">
            <button id="queryBtn" class="primary-btn">Query Address</button>
          </div>
          <div id="queryResult"></div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-powered">
        <img src="/arbitrum-logo.svg" alt="Arbitrum" class="arbitrum-logo" onerror="this.style.display='none'" />
        <span>Powered by Arbitrum Sepolia</span>
      </div>
      <div class="footer-links">
        <a href="https://vpnl.io" target="_blank">About VPNL</a>
        <span class="separator">|</span>
        <a href="${NETWORK_CONFIG.explorer}" target="_blank">Arbiscan</a>
        <span class="separator">|</span>
        <a href="https://t.me/vpnlnetwork" target="_blank">Community</a>
      </div>
      <div class="footer-copyright">
        VPNL Registry © 2025 | Contract: ${shortenAddress(REGISTRY_ADDRESS)}
      </div>
    </div>
  </div>
`

let provider: ethers.JsonRpcProvider | null = null
let registry: ethers.Contract | null = null

async function connectToRegistry() {
  const connectBtn = document.getElementById('connectBtn') as HTMLButtonElement
  const connectSection = document.getElementById('connectSection')!
  const contractInfo = document.getElementById('contractInfo')!
  const overviewSection = document.getElementById('overviewSection')!
  const solversSection = document.getElementById('solversSection')!
  const customQuerySection = document.getElementById('customQuerySection')!
  
  try {
    connectBtn.disabled = true
    connectBtn.innerHTML = '<div class="spinner" style="width: 20px; height: 20px; border-width: 2px;"></div> Connecting...'
    
    provider = new ethers.JsonRpcProvider(NETWORK_CONFIG.rpcUrl)
    const network = await provider.getNetwork()
    
    registry = new ethers.Contract(REGISTRY_ADDRESS, REGISTRY_ABI, provider)
    
    const owner = await registry.owner()
    const verifier = await registry.verifier()
    
    contractInfo.innerHTML = `
      <div class="info-grid">
        <div class="info-row">
          <div class="info-label">Contract Address</div>
          <div class="info-value">
            <span class="address-value">
              <a href="${NETWORK_CONFIG.explorer}/address/${REGISTRY_ADDRESS}" target="_blank" class="address-link">${REGISTRY_ADDRESS}</a>
              <button class="copy-btn" onclick="navigator.clipboard.writeText('${REGISTRY_ADDRESS}')" title="Copy address">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </span>
          </div>
        </div>
        <div class="info-row">
          <div class="info-label">Network</div>
          <div class="info-value">
            <span class="network-badge-small">
              <span class="status-dot"></span>
              ${NETWORK_CONFIG.name}
            </span>
            (Chain ${network.chainId})
          </div>
        </div>
        <div class="info-row">
          <div class="info-label">Owner</div>
          <div class="info-value">
            <span class="address-value">
              <a href="${NETWORK_CONFIG.explorer}/address/${owner}" target="_blank" class="address-link">${shortenAddress(owner)}</a>
              <button class="copy-btn" onclick="navigator.clipboard.writeText('${owner}')" title="Copy address">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </span>
          </div>
        </div>
        <div class="info-row">
          <div class="info-label">Verifier</div>
          <div class="info-value">
            <span class="address-value">
              <a href="${NETWORK_CONFIG.explorer}/address/${verifier}" target="_blank" class="address-link">${shortenAddress(verifier)}</a>
              <button class="copy-btn" onclick="navigator.clipboard.writeText('${verifier}')" title="Copy address">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </span>
          </div>
        </div>
      </div>
    `
    
    connectSection.style.display = 'none'
    overviewSection.style.display = 'block'
    solversSection.style.display = 'block'
    customQuerySection.style.display = 'block'
    
    loadTestSolvers()
  } catch (error: any) {
    contractInfo.innerHTML = `
      <div class="error-message">
        <strong>Connection Failed</strong><br>
        ${error.message}<br>
        <small>Unable to connect to Arbitrum Sepolia RPC. Please try again.</small>
      </div>
    `
    connectBtn.disabled = false
    connectBtn.innerHTML = 'Retry Connection'
  }
}

async function loadTestSolvers() {
  const solversList = document.getElementById('solversList')!
  
  solversList.innerHTML = '<div class="loading"><div class="spinner"></div>Loading solver verifications...</div>'
  
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
            <div class="solver-header">
              <h3 class="solver-name">${solver.name}</h3>
              <span class="tier-badge ${solver.tier.toLowerCase()}">${solver.tier}</span>
            </div>
            <div class="solver-details">
              <div class="detail-item">
                <span class="detail-label">Address</span>
                <span class="address-value">
                  <span class="detail-value">${shortenAddress(solver.address)}</span>
                  <button class="copy-btn" onclick="navigator.clipboard.writeText('${solver.address}')" title="Copy">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Status</span>
                <span class="status-badge verified">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Verified
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Performance Score</span>
                <div class="score-container">
                  <div class="score-bar">
                    <div class="score-fill" style="width: ${solver.score * 100}%"></div>
                  </div>
                  <span class="score-text">${(solver.score * 100).toFixed(0)}%</span>
                </div>
              </div>
              <div class="detail-item">
                <span class="detail-label">Verified</span>
                <span class="detail-value">${verifiedAt.toLocaleDateString()}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Expires In</span>
                <span class="detail-value">${daysUntilExpiry} days</span>
              </div>
            </div>
            <div class="arbiscan-link">
              <a href="${NETWORK_CONFIG.explorer}/address/${solver.address}" target="_blank">
                View on Arbiscan
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>
          </div>
        `
      } else {
        return `
          <div class="solver-card">
            <div class="solver-header">
              <h3 class="solver-name">${solver.name}</h3>
            </div>
            <div class="solver-details">
              <div class="detail-item">
                <span class="detail-label">Address</span>
                <span class="detail-value">${shortenAddress(solver.address)}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Status</span>
                <span style="color: var(--etherscan-text-gray);">Not Verified</span>
              </div>
            </div>
          </div>
        `
      }
    } catch (error) {
      return `
        <div class="solver-card">
          <h3 class="solver-name">${solver.name}</h3>
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
    result.innerHTML = '<div class="error-message">Invalid Ethereum address format</div>'
    return
  }
  
  try {
    result.innerHTML = '<div class="loading"><div class="spinner"></div>Querying blockchain...</div>'
    
    const isVerified = await registry!.isVerified(address)
    const verification = await registry!.getVerification(address)
    
    if (isVerified) {
      const verifiedAt = new Date(Number(verification.verifiedAt) * 1000)
      const expiresAt = new Date(Number(verification.expiresAt) * 1000)
      
      result.innerHTML = `
        <div style="margin-top: 20px;">
          <div class="info-grid">
            <div class="info-row">
              <div class="info-label">Address</div>
              <div class="info-value">
                <span class="address-value">
                  <a href="${NETWORK_CONFIG.explorer}/address/${address}" target="_blank" class="address-link">${address}</a>
                  <button class="copy-btn" onclick="navigator.clipboard.writeText('${address}')" title="Copy">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                </span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-label">Status</div>
              <div class="info-value">
                <span class="status-badge verified">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Verified
                </span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-label">Commitment Hash</div>
              <div class="info-value">
                <span class="address-value" style="font-size: 12px; word-break: break-all;">${verification.commitmentHash}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-label">Verified At</div>
              <div class="info-value">${verifiedAt.toLocaleString()}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Expires At</div>
              <div class="info-value">${expiresAt.toLocaleString()}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Active</div>
              <div class="info-value">${verification.active ? 'Yes' : 'No'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Revoked</div>
              <div class="info-value">${verification.revoked ? 'Yes' : 'No'}</div>
            </div>
          </div>
        </div>
      `
    } else {
      result.innerHTML = `
        <div style="margin-top: 20px;">
          <div class="error-message" style="background: #fff8dc; border-color: var(--etherscan-warning); color: var(--etherscan-text);">
            <strong>Not Verified</strong><br>
            This address has no verification record in the VPNL Registry.
          </div>
        </div>
      `
    }
  } catch (error: any) {
    result.innerHTML = `<div class="error-message">Query failed: ${error.message}</div>`
  }
}

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Search functionality
const searchInput = document.getElementById('searchInput') as HTMLInputElement
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && searchInput.value.trim()) {
    const customInput = document.getElementById('customAddress') as HTMLInputElement
    customInput.value = searchInput.value.trim()
    customInput.scrollIntoView({ behavior: 'smooth' })
    if (registry) {
      queryCustomAddress()
    }
  }
})

document.getElementById('connectBtn')!.addEventListener('click', connectToRegistry)
document.getElementById('queryBtn')!.addEventListener('click', queryCustomAddress)

document.getElementById('customAddress')!.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    queryCustomAddress()
  }
})
