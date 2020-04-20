var VerifierContract = artifacts.require("Verifier");
var SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
var proofObject = require("../scripts/proofs.json");

contract("SolnSquareVerifier contract", (accounts) => {
  let contract;
  beforeEach(async () => {
    contract = await SolnSquareVerifier.new(VerifierContract.address);
  });

  // Test if a new solution can be added for contract - SolnSquareVerifier
  // (addSolution is an internal function so it is called only by mintNFT function) so the below testing tests both cases

  // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
  it("Test if an ERC721 token can be minted for contract - SolnSquareVerifier", async () => {
    let minted;
    try {
      await contract.mintNFT(
        accounts[1],
        1,
        proofObject.proofs[0].proof.a,
        proofObject.proofs[0].proof.b,
        proofObject.proofs[0].proof.c,
        proofObject.proofs[0].inputs,
        { from: accounts[0], gas: 3000000 }
      );
      minted = true;
    } catch (error) {
      minted = false;
    }

    let ownerOfToken = await contract.ownerOf(1);

    assert.equal(minted, true, "Error: Could not minting token");
    assert.equal(ownerOfToken, accounts[1], "Error: Wrong token`s owner");
  });
});
