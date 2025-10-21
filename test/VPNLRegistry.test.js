const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("VPNLRegistry", function () {
  let registry;
  let owner;
  let verifier;
  let solver;
  let unauthorized;

  const COMMITMENT_HASH = ethers.keccak256(ethers.toUtf8Bytes("test-commitment"));
  const ONE_MONTH = 30 * 24 * 60 * 60;

  beforeEach(async function () {
    [owner, verifier, solver, unauthorized] = await ethers.getSigners();

    const VPNLRegistry = await ethers.getContractFactory("VPNLRegistry");
    registry = await VPNLRegistry.deploy(verifier.address);
    await registry.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await registry.owner()).to.equal(owner.address);
    });

    it("Should set the correct verifier", async function () {
      expect(await registry.verifier()).to.equal(verifier.address);
    });

    it("Should revert if verifier address is zero", async function () {
      const VPNLRegistry = await ethers.getContractFactory("VPNLRegistry");
      await expect(
        VPNLRegistry.deploy(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid verifier");
    });
  });

  describe("Verification", function () {
    it("Should allow verifier to verify a solver", async function () {
      const expiresAt = (await time.latest()) + ONE_MONTH;

      const tx = await registry.connect(verifier).verify(solver.address, COMMITMENT_HASH, expiresAt);
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);

      await expect(tx)
        .to.emit(registry, "Verified")
        .withArgs(solver.address, COMMITMENT_HASH, block.timestamp, expiresAt);

      expect(await registry.isVerified(solver.address)).to.be.true;
    });

    it("Should store correct verification data", async function () {
      const expiresAt = (await time.latest()) + ONE_MONTH;
      await registry.connect(verifier).verify(solver.address, COMMITMENT_HASH, expiresAt);

      const verification = await registry.getVerification(solver.address);
      expect(verification.commitmentHash).to.equal(COMMITMENT_HASH);
      expect(verification.active).to.be.true;
      expect(verification.revoked).to.be.false;
      expect(verification.expiresAt).to.equal(expiresAt);
    });

    it("Should revert if non-verifier tries to verify", async function () {
      const expiresAt = (await time.latest()) + ONE_MONTH;

      await expect(
        registry.connect(unauthorized).verify(solver.address, COMMITMENT_HASH, expiresAt)
      ).to.be.revertedWith("Only verifier can call");
    });

    it("Should revert if solver address is zero", async function () {
      const expiresAt = (await time.latest()) + ONE_MONTH;

      await expect(
        registry.connect(verifier).verify(ethers.ZeroAddress, COMMITMENT_HASH, expiresAt)
      ).to.be.revertedWith("Invalid solver address");
    });

    it("Should revert if commitment hash is zero", async function () {
      const expiresAt = (await time.latest()) + ONE_MONTH;

      await expect(
        registry.connect(verifier).verify(solver.address, ethers.ZeroHash, expiresAt)
      ).to.be.revertedWith("Invalid commitment");
    });

    it("Should revert if expiration is in the past", async function () {
      const pastTime = (await time.latest()) - 1000;

      await expect(
        registry.connect(verifier).verify(solver.address, COMMITMENT_HASH, pastTime)
      ).to.be.revertedWith("Invalid expiration");
    });
  });

  describe("Revocation", function () {
    beforeEach(async function () {
      const expiresAt = (await time.latest()) + ONE_MONTH;
      await registry.connect(verifier).verify(solver.address, COMMITMENT_HASH, expiresAt);
    });

    it("Should allow verifier to revoke verification", async function () {
      const reason = "Fraudulent activity detected";

      const tx = await registry.connect(verifier).revoke(solver.address, reason);
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);

      await expect(tx)
        .to.emit(registry, "Revoked")
        .withArgs(solver.address, reason, block.timestamp);

      expect(await registry.isVerified(solver.address)).to.be.false;
    });

    it("Should update verification status correctly after revocation", async function () {
      const reason = "Stale data";
      await registry.connect(verifier).revoke(solver.address, reason);

      const verification = await registry.getVerification(solver.address);
      expect(verification.active).to.be.false;
      expect(verification.revoked).to.be.true;
      expect(verification.revokeReason).to.equal(reason);
    });

    it("Should revert if non-verifier tries to revoke", async function () {
      await expect(
        registry.connect(unauthorized).revoke(solver.address, "test")
      ).to.be.revertedWith("Only verifier can call");
    });
  });

  describe("Expiration", function () {
    it("Should return false for expired verification", async function () {
      const shortExpiry = (await time.latest()) + 1000;
      await registry.connect(verifier).verify(solver.address, COMMITMENT_HASH, shortExpiry);

      expect(await registry.isVerified(solver.address)).to.be.true;

      await time.increase(2000);

      expect(await registry.isVerified(solver.address)).to.be.false;
    });

    it("Should return true for valid non-expired verification", async function () {
      const longExpiry = (await time.latest()) + ONE_MONTH;
      await registry.connect(verifier).verify(solver.address, COMMITMENT_HASH, longExpiry);

      await time.increase(ONE_MONTH / 2);

      expect(await registry.isVerified(solver.address)).to.be.true;
    });
  });

  describe("Access Control", function () {
    it("Should allow owner to update verifier", async function () {
      const newVerifier = unauthorized.address;

      await expect(registry.connect(owner).updateVerifier(newVerifier))
        .to.emit(registry, "VerifierUpdated")
        .withArgs(verifier.address, newVerifier);

      expect(await registry.verifier()).to.equal(newVerifier);
    });

    it("Should revert if non-owner tries to update verifier", async function () {
      await expect(
        registry.connect(unauthorized).updateVerifier(unauthorized.address)
      ).to.be.revertedWith("Only owner can call");
    });

    it("Should revert if updating verifier to zero address", async function () {
      await expect(
        registry.connect(owner).updateVerifier(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid address");
    });
  });
});
