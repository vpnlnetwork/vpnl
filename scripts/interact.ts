import { ethers } from "hardhat";

async function main() {
  const registryAddress = process.env.VPNL_REGISTRY_ADDRESS;
  
  if (!registryAddress) {
    console.error("❌ VPNL_REGISTRY_ADDRESS not set in .env file");
    console.log("   Deploy the contract first with: npm run deploy:local");
    process.exit(1);
  }

  const [owner, verifier, solver] = await ethers.getSigners();

  console.log("Interacting with VPNLRegistry at:", registryAddress);
  console.log("Using accounts:");
  console.log("  Owner:", owner.address);
  console.log("  Verifier:", verifier.address);
  console.log("  Solver:", solver.address);

  const VPNLRegistry = await ethers.getContractFactory("VPNLRegistry");
  const registry = VPNLRegistry.attach(registryAddress);

  const ONE_MONTH = 30 * 24 * 60 * 60;
  const commitmentHash = ethers.keccak256(ethers.toUtf8Bytes("example-commitment-data"));
  const currentTime = Math.floor(Date.now() / 1000);
  const expiresAt = currentTime + ONE_MONTH;

  console.log("\n1️⃣ Checking if solver is verified...");
  let isVerified = await registry.isVerified(solver.address);
  console.log("   Is verified:", isVerified);

  if (!isVerified) {
    console.log("\n2️⃣ Verifying solver...");
    console.log("   Commitment hash:", commitmentHash);
    console.log("   Expires at:", new Date(expiresAt * 1000).toISOString());
    
    const tx = await registry.connect(verifier).verify(solver.address, commitmentHash, expiresAt);
    await tx.wait();
    console.log("   ✅ Solver verified! Tx:", tx.hash);

    isVerified = await registry.isVerified(solver.address);
    console.log("   Is verified now:", isVerified);
  }

  console.log("\n3️⃣ Getting verification details...");
  const verification = await registry.getVerification(solver.address);
  console.log("   Commitment Hash:", verification.commitmentHash);
  console.log("   Verified At:", new Date(Number(verification.verifiedAt) * 1000).toISOString());
  console.log("   Expires At:", new Date(Number(verification.expiresAt) * 1000).toISOString());
  console.log("   Active:", verification.active);
  console.log("   Revoked:", verification.revoked);

  console.log("\n✅ Interaction complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
