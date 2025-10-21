const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("\n🔍 VPNL Deployment Setup Verification");
  console.log("=====================================\n");

  let errors = [];
  let warnings = [];
  let checks = 0;
  let passed = 0;

  checks++;
  console.log("1️⃣  Checking Node.js version…");
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.split('.')[0].replace('v', ''));
  if (majorVersion >= 18) {
    console.log(`   ✅ Node.js ${nodeVersion} (>= v18 required)\n`);
    passed++;
  } else {
    console.log(`   ❌ Node.js ${nodeVersion} (v18+ required)\n`);
    errors.push("Update Node.js to v18 or higher");
  }

  checks++;
  console.log("2️⃣  Checking .env configuration…");
  const envPath = path.join(__dirname, "..", ".env");
  if (fs.existsSync(envPath)) {
    console.log("   ✅ .env file exists\n");
    passed++;
  } else {
    console.log("   ⚠️  .env file not found (optional for local testing)\n");
    warnings.push("Create .env file for testnet deployment: cp .env.example .env");
    passed++;
  }

  checks++;
  console.log("3️⃣  Compiling smart contracts…");
  try {
    await hre.run("compile");
    console.log("   ✅ Contracts compiled successfully\n");
    passed++;
  } catch (error) {
    console.log(`   ❌ Compilation failed: ${error.message}\n`);
    errors.push("Fix contract compilation errors");
  }

  checks++;
  console.log("4️⃣  Checking VPNLRegistry.sol…");
  const contractPath = path.join(__dirname, "..", "contracts", "VPNLRegistry.sol");
  if (fs.existsSync(contractPath)) {
    console.log("   ✅ VPNLRegistry.sol found\n");
    passed++;
  } else {
    console.log("   ❌ VPNLRegistry.sol not found\n");
    errors.push("Ensure VPNLRegistry.sol is in contracts/ directory");
  }

  console.log("=====================================");
  console.log("📊 SUMMARY");
  console.log("=====================================\n");

  console.log(`Checks completed: ${passed}/${checks}`);
  console.log();

  if (warnings.length > 0) {
    console.log("⚠️  WARNINGS:");
    warnings.forEach((warning, i) => {
      console.log(`  ${i + 1}. ${warning}`);
    });
    console.log();
  }

  if (errors.length > 0) {
    console.log("❌ ERRORS (must fix before deployment):");
    errors.forEach((error, i) => {
      console.log(`  ${i + 1}. ${error}`);
    });
    console.log();
    console.log("🔧 Fix these issues and run: npm run verify:setup\n");
    process.exit(1);
  } else if (warnings.length > 0) {
    console.log("✅ Setup is valid but has warnings");
    console.log("💡 Review warnings above before deployment\n");
    console.log("Ready to deploy? Run: npm run deploy:sepolia\n");
    process.exit(0);
  } else {
    console.log("✅ All checks passed! Setup is complete.\n");
    console.log("🚀 Ready to deploy? Run: npm run deploy:sepolia\n");
    process.exit(0);
  }
}

main()
  .catch((error) => {
    console.error("\n❌ Verification failed:");
    console.error(error);
    process.exit(1);
  });
