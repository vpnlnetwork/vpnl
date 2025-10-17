solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VPNLRegistry
 * @notice On-chain registry for solver reputation commitments
 * @dev Stores cryptographic commitments (zero PII), manages verification lifecycle
 */
contract VPNLRegistry {
    
    /// @notice Verification record structure
    struct Verification {
        bytes32 commitmentHash;    // H(score || salt || metadata)
        uint256 verifiedAt;        // Timestamp of verification
        uint256 expiresAt;         // Expiration timestamp
        bool active;               // Active status
        bool revoked;              // Revocation status
        string revokeReason;       // Reason for revocation (if any)
    }
    
    /// @notice Mapping: solver address => verification record
    mapping(address => Verification) public verifications;
    
    /// @notice Verifier address (initially centralized, will be multisig)
    address public verifier;
    
    /// @notice Contract owner
    address public owner;
    
    /// @notice Events
    event Verified(
        address indexed solver,
        bytes32 commitmentHash,
        uint256 verifiedAt,
        uint256 expiresAt
    );
    
    event Revoked(
        address indexed solver,
        string reason,
        uint256 revokedAt
    );
    
    event VerifierUpdated(
        address indexed oldVerifier,
        address indexed newVerifier
    );
    
    /// @notice Modifiers
    modifier onlyVerifier() {
        require(msg.sender == verifier, "Only verifier can call");
        _;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call");
        _;
    }
    
    /**
     * @notice Constructor
     * @param _verifier Initial verifier address
     */
    constructor(address _verifier) {
        require(_verifier != address(0), "Invalid verifier");
        verifier = _verifier;
        owner = msg.sender;
    }
    
    /**
     * @notice Register a new verification
     * @param solver Solver address
     * @param commitmentHash Cryptographic commitment hash
     * @param expiresAt Expiration timestamp
     */
    function verify(
        address solver,
        bytes32 commitmentHash,
        uint256 expiresAt
    ) external onlyVerifier {
        require(solver != address(0), "Invalid solver address");
        require(commitmentHash != bytes32(0), "Invalid commitment");
        require(expiresAt > block.timestamp, "Invalid expiration");
        
        verifications[solver] = Verification({
            commitmentHash: commitmentHash,
            verifiedAt: block.timestamp,
            expiresAt: expiresAt,
            active: true,
            revoked: false,
            revokeReason: ""
        });
        
        emit Verified(solver, commitmentHash, block.timestamp, expiresAt);
    }
    
    /**
     * @notice Revoke a verification
     * @param solver Solver address
     * @param reason Reason for revocation
     */
    function revoke(
        address solver,
        string calldata reason
    ) external onlyVerifier {
        require(verifications[solver].active, "Not verified");
        
        verifications[solver].active = false;
        verifications[solver].revoked = true;
        verifications[solver].revokeReason = reason;
        
        emit Revoked(solver, reason, block.timestamp);
    }
    
    /**
     * @notice Check if solver is currently verified
     * @param solver Solver address
     * @return bool Active verification status
     */
    function isVerified(address solver) external view returns (bool) {
        Verification memory v = verifications[solver];
        return v.active && 
               !v.revoked && 
               block.timestamp < v.expiresAt;
    }
    
    /**
     * @notice Get verification details
     * @param solver Solver address
     * @return Verification struct
     */
    function getVerification(address solver) 
        external 
        view 
        returns (Verification memory) 
    {
        return verifications[solver];
    }
    
    /**
     * @notice Update verifier address
     * @param newVerifier New verifier address
     */
    function updateVerifier(address newVerifier) external onlyOwner {
        require(newVerifier != address(0), "Invalid address");
        address oldVerifier = verifier;
        verifier = newVerifier;
        emit VerifierUpdated(oldVerifier, newVerifier);
    }
    
    /**
     * @notice Transfer ownership
     * @param newOwner New owner address
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}
