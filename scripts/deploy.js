const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const networkName = hre.network.name;
  console.log(`\n🚀 Deploying VPNLRegistry to ${networkName}...`);
  console.log("==========================================\n");

  const [deployer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(deployer.address);

  console.log("📋 Deployment Configuration:");
  console.log("  Deployer address:", deployer.address);
  console.log("  Account balance:", hre.ethers.formatEther(balance), "ETH");
  console.log("  Network:", networkName);
  console.log("  Chain ID:", (await hre.ethers.provider.getNetwork()).chainId);
  console.log();

  if (balance < hre.ethers.parseEther("0.01")) {
    console.error("❌ Insufficient balance for deployment!");
    console.error("   Please fund your address with testnet ETH");
    console.error("   Arbitrum Sepolia Faucet: https://faucet.quicknode.com/arbitrum/sepolia");
    process.exit(1);
  }

  console.log("📦 Deploying VPNLRegistry contract…");
  const VPNLRegistry = await hre.ethers.getContractFactory("VPNLRegistry");

  const verifier = deployer.address;

  const registry = await VPNLRegistry.deploy(verifier);
  await registry.waitForDeployment();

  const registryAddress = await registry.getAddress();
  const deploymentTx = registry.deploymentTransaction();

  console.log("✅ VPNLRegistry deployed successfully!");
  console.log();
  console.log("📍 Contract Details:");
  console.log("  Registry address:", registryAddress);
  console.log("  Verifier address:", verifier);
  console.log("  Deployment tx:", deploymentTx.hash);
  console.log("  Block number:", (await deploymentTx.wait()).blockNumber);
  console.log();

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentInfo = {
    network: networkName,
    chainId: Number((await hre.ethers.provider.getNetwork()).chainId),
    registry: registryAddress,
    verifier: verifier,
    deployer: deployer.address,
    deploymentTx: deploymentTx.hash,
    blockNumber: (await deploymentTx.wait()).blockNumber,
    timestamp: new Date().toISOString(),
    explorerUrl: networkName === "arbitrumSepolia"
      ? `https://sepolia.arbiscan.io/address/${registryAddress}`
      : `https://arbiscan.io/address/${registryAddress}`,
  };

  const deploymentFile = path.join(deploymentsDir, `${networkName}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

  console.log("💾 Deployment info saved to:", deploymentFile);
  console.log();

  console.log("⏳ Waiting for 5 block confirmations before verification…");
  await deploymentTx.wait(5);
  console.log("✅ Confirmations complete!");
  console.log();

  console.log("🔍 Verifying contract on block explorer…");
  try {
    await hre.run("verify:verify", {
      address: registryAddress,
      constructorArguments: [verifier],
    });
    console.log("✅ Contract verified successfully!");
    console.log();
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("ℹ️  Contract already verified");
      console.log();
    } else {
      console.log("⚠️  Verification failed:", error.message);
      console.log();
      console.log("📝 Manual verification command:");
      console.log(`   npx hardhat verify --network ${networkName} ${registryAddress} ${verifier}`);
      console.log();
    }
  }

  console.log("🔗 Explorer Links:");
  console.log("  Contract:", deploymentInfo.explorerUrl);
  console.log("  Transaction:",
    networkName === "arbitrumSepolia"
      ? `https://sepolia.arbiscan.io/tx/${deploymentTx.hash}`
      : `https://arbiscan.io/tx/${deploymentTx.hash}`
  );
  console.log();

  console.log("✨ Deployment complete!");
  console.log();
  console.log("📋 Next steps:");
  console.log("  1. Save the deployment info from:", deploymentFile);
  console.log("  2. Create test verifications: npm run populate:testdata");
  console.log("  3. Update DEMO.md with contract addresses");
  console.log("  4. Test queries using the frontend demo");
  console.log();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
