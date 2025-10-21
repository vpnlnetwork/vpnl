const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const networkName = hre.network.name;
  console.log(`\n🧪 Creating test data on ${networkName}...`);
  console.log("==========================================\n");

  const deploymentFile = path.join(__dirname, "..", "deployments", `${networkName}.json`);

  if (!fs.existsSync(deploymentFile)) {
    console.error("❌ Deployment file not found!");
    console.error(`   Expected: ${deploymentFile}`);
    console.error("   Please run deployment first: npm run deploy:sepolia");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  const registryAddress = deploymentInfo.registry;

  console.log("📋 Configuration:");
  console.log("  Network:", networkName);
  console.log("  Registry:", registryAddress);
  console.log();

  const registry = await hre.ethers.getContractAt("VPNLRegistry", registryAddress);
  const [signer] = await hre.ethers.getSigners();

  const verifier = await registry.verifier();
  if (verifier.toLowerCase() !== signer.address.toLowerCase()) {
    console.error("❌ Only the verifier can create test data!");
    console.error(`   Current verifier: ${verifier}`);
    console.error(`   Your address: ${signer.address}`);
    process.exit(1);
  }

  const mockSolvers = [
    {
      address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      name: "Expert Solver Alpha",
      score: 0.85,
      tier: "Expert",
      specialties: ["cross-chain", "high-volume"]
    },
    {
      address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      name: "Advanced Solver Beta",
      score: 0.65,
      tier: "Advanced",
      specialties: ["low-latency"]
    },
    {
      address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      name: "Emerging Solver Gamma",
      score: 0.30,
      tier: "Emerging",
      specialties: []
    },
    {
      address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
      name: "Expert Solver Delta",
      score: 0.92,
      tier: "Expert",
      specialties: ["exotic-pairs", "cross-chain"]
    },
  ];

  console.log("🔨 Creating verifications for mock solvers…\n");

  const testDataResults = [];

  for (const solver of mockSolvers) {
    console.log(`Processing: ${solver.name}`);
    console.log(`  Address: ${solver.address}`);
    console.log(`  Score: ${solver.score} (${solver.tier})`);

    const existingVerification = await registry.getVerification(solver.address);
    if (existingVerification.active) {
      console.log(`  ⚠️  Already verified - skipping`);
      console.log();
      continue;
    }

    const scoreScaled = Math.floor(solver.score * 1000);
    const salt = hre.ethers.randomBytes(32);
    const metadata = hre.ethers.encodeBytes32String(solver.tier);

    const commitment = hre.ethers.keccak256(
      hre.ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256", "bytes32", "bytes32"],
        [scoreScaled, salt, metadata]
      )
    );

    const currentTime = Math.floor(Date.now() / 1000);
    const expiresAt = currentTime + (180 * 24 * 60 * 60);

    console.log(`  Commitment: ${commitment.slice(0, 10)}...`);

    try {
      const tx = await registry.verify(solver.address, commitment, expiresAt);
      console.log(`  Transaction: ${tx.hash}`);
      
      const receipt = await tx.wait();
      console.log(`  ✅ Verified in block ${receipt.blockNumber}`);
      console.log(`  Gas used: ${receipt.gasUsed.toString()}`);

      testDataResults.push({
        solver: solver.address,
        name: solver.name,
        tier: solver.tier,
        score: solver.score,
        commitment: commitment,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        expiresAt: new Date(expiresAt * 1000).toISOString(),
      });
    } catch (error) {
      console.log(`  ❌ Failed: ${error.message}`);
    }

    console.log();
  }

  const testDataFile = path.join(__dirname, "..", "deployments", `${networkName}-testdata.json`);
  fs.writeFileSync(
    testDataFile,
    JSON.stringify({
      network: networkName,
      registry: registryAddress,
      createdAt: new Date().toISOString(),
      solvers: testDataResults,
    }, null, 2)
  );

  console.log("💾 Test data info saved to:", testDataFile);
  console.log();

  console.log("✨ Test data creation complete!");
  console.log();
  console.log("📋 Summary:");
  console.log(`  Created: ${testDataResults.length} verifications`);
  console.log(`  Registry: ${registryAddress}`);
  console.log(`  Explorer: ${deploymentInfo.explorerUrl}`);
  console.log();
  console.log("🔗 Test these addresses in your frontend:");
  testDataResults.forEach(r => {
    console.log(`  ${r.name}: ${r.solver}`);
  });
  console.log();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test data creation failed:");
    console.error(error);
    process.exit(1);
  });
