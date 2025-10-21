import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying VPNLRegistry with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));

  const verifierAddress = process.env.VERIFIER_ADDRESS || deployer.address;
  console.log("Verifier address:", verifierAddress);

  const VPNLRegistry = await ethers.getContractFactory("VPNLRegistry");
  const registry = await VPNLRegistry.deploy(verifierAddress);

  await registry.waitForDeployment();

  const registryAddress = await registry.getAddress();
  console.log("\n✅ VPNLRegistry deployed to:", registryAddress);
  console.log("   Owner:", await registry.owner());
  console.log("   Verifier:", await registry.verifier());
  console.log("\n📝 Save this address to your .env file:");
  console.log(`   VPNL_REGISTRY_ADDRESS=${registryAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
