import './style.css'
import { ethers } from 'ethers'

const REGISTRY_ABI = [
  "function isVerified(address solver) view returns (bool)",
  "function getVerification(address solver) view returns (bytes32 commitmentHash, uint256 verifiedAt, uint256 expiresAt, bool active, bool revoked, string revokeReason)",
  "function verifier() view returns (address)",
  "function owner() view returns (address)"
]

const TEST_SOLVERS = [
  { name: "Expert Solver Alpha", address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1", tier: "Expert", score: 0.85 },
  { name: "Advanced Solver Beta", address: "0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678", tier: "Advanced", score: 0.65 },
  { name: "Emerging Solver Gamma", address: "0x03C6FcED478cde53Abb47b5dC3Bb8B3c1f2A0C2F", tier: "Emerging", score: 0.30 },
  { name: "Expert Solver Delta", address: "0x1234567890AbcdEF1234567890aBcdef12345678", tier: "Expert", score: 0.92 }
]

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
    <h1>🛡️ VPNL Registry Demo</h1>
    <p class="subtitle">Verifiable Performance Network Layer</p>
    
    <div class="info-box">
      <h3>About VPNL</h3>
      <p>VPNL provides open reputation standards for solver verification in the Open Intents Framework. This demo connects to a local Hardhat node to query solver verifications.</p>
    </div>

    <div class="registry-info" id="registryInfo">
      <h3>Registry Information</h3>
      <div class="loading">Connect to view registry details</div>
    </div>

    <div class="actions">
      <button id="connectBtn" class="primary-btn">Connect to Local Node</button>
    </div>

    <div id="solversSection" class="solvers-section" style="display: none;">
      <h3>Test Solvers</h3>
      <div id="solversList"></div>
    </div>

    <div id="customQuery" class="custom-query" style="display: none;">
      <h3>Custom Query</h3>
      <input type="text" id="customAddress" placeholder="Enter solver address (0x...)" />
      <button id="queryBtn" class="secondary-btn">Check Verification</button>
      <div id="queryResult"></div>
    </div>
  </div>
`

let provider: ethers.JsonRpcProvider | null = null
let registry: ethers.Contract | null = null
let registryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3" // Default local deployment

async function connectToNode() {
  const connectBtn = document.getElementById('connectBtn') as HTMLButtonElement
  const registryInfo = document.getElementById('registryInfo')!
  const solversSection = document.getElementById('solversSection')!
  const customQuery = document.getElementById('customQuery')!
  
  try {
    connectBtn.disabled = true
    connectBtn.textContent = 'Connecting...'
    
    provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545')
    const network = await provider.getNetwork()
    
    registry = new ethers.Contract(registryAddress, REGISTRY_ABI, provider)
    
    const owner = await registry.owner()
    const verifier = await registry.verifier()
    
    registryInfo.innerHTML = `
      <h3>✅ Connected to Registry</h3>
      <div class="info-grid">
        <div><strong>Network:</strong> ${network.name} (${network.chainId})</div>
        <div><strong>Registry:</strong> <code>${registryAddress}</code></div>
        <div><strong>Owner:</strong> <code>${owner}</code></div>
        <div><strong>Verifier:</strong> <code>${verifier}</code></div>
      </div>
    `
    
    connectBtn.textContent = '✅ Connected'
    connectBtn.style.display = 'none'
    
    solversSection.style.display = 'block'
    customQuery.style.display = 'block'
    
    loadTestSolvers()
  } catch (error: any) {
    registryInfo.innerHTML = `
      <h3>❌ Connection Failed</h3>
      <p class="error">${error.message}</p>
      <p class="hint">Make sure Hardhat node is running: <code>npx hardhat node</code></p>
    `
    connectBtn.disabled = false
    connectBtn.textContent = 'Retry Connection'
  }
}

async function loadTestSolvers() {
  const solversList = document.getElementById('solversList')!
  
  solversList.innerHTML = '<div class="loading">Loading solver verifications...</div>'
  
  const solversHtml = await Promise.all(TEST_SOLVERS.map(async (solver) => {
    try {
      const isVerified = await registry!.isVerified(solver.address)
      const verification = await registry!.getVerification(solver.address)
      
      if (isVerified) {
        const expiresAt = new Date(Number(verification.expiresAt) * 1000)
        return `
          <div class="solver-card verified">
            <h4>${solver.name}</h4>
            <div class="solver-details">
              <div><strong>Address:</strong> <code>${solver.address.slice(0, 10)}...</code></div>
              <div><strong>Tier:</strong> ${solver.tier}</div>
              <div><strong>Score:</strong> ${solver.score}</div>
              <div class="status verified">✅ Verified</div>
              <div><strong>Expires:</strong> ${expiresAt.toLocaleDateString()}</div>
            </div>
          </div>
        `
      } else {
        return `
          <div class="solver-card unverified">
            <h4>${solver.name}</h4>
            <div class="solver-details">
              <div><strong>Address:</strong> <code>${solver.address.slice(0, 10)}...</code></div>
              <div class="status unverified">❌ Not Verified</div>
              <div class="hint">Run: <code>npm run populate:testdata</code></div>
            </div>
          </div>
        `
      }
    } catch (error) {
      return `
        <div class="solver-card error">
          <h4>${solver.name}</h4>
          <div class="error">Failed to query</div>
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
    result.innerHTML = '<div class="error">Invalid Ethereum address</div>'
    return
  }
  
  try {
    result.innerHTML = '<div class="loading">Querying...</div>'
    
    const isVerified = await registry!.isVerified(address)
    const verification = await registry!.getVerification(address)
    
    if (isVerified) {
      const verifiedAt = new Date(Number(verification.verifiedAt) * 1000)
      const expiresAt = new Date(Number(verification.expiresAt) * 1000)
      
      result.innerHTML = `
        <div class="query-result verified">
          <h4>✅ Verified Solver</h4>
          <div class="info-grid">
            <div><strong>Address:</strong> <code>${address}</code></div>
            <div><strong>Commitment:</strong> <code>${verification.commitmentHash}</code></div>
            <div><strong>Verified:</strong> ${verifiedAt.toLocaleString()}</div>
            <div><strong>Expires:</strong> ${expiresAt.toLocaleString()}</div>
            <div><strong>Active:</strong> ${verification.active ? 'Yes' : 'No'}</div>
            <div><strong>Revoked:</strong> ${verification.revoked ? 'Yes' : 'No'}</div>
          </div>
        </div>
      `
    } else {
      result.innerHTML = `
        <div class="query-result unverified">
          <h4>❌ Not Verified</h4>
          <p>This address has no verification record.</p>
        </div>
      `
    }
  } catch (error: any) {
    result.innerHTML = `<div class="error">Query failed: ${error.message}</div>`
  }
}

document.getElementById('connectBtn')!.addEventListener('click', connectToNode)
document.getElementById('queryBtn')!.addEventListener('click', queryCustomAddress)
