// define a variable to import the <Verifier> or <renamedVerifier> solidity contract generated by Zokrates
var VerifierContract = artifacts.require("Verifier");
var proofObject = require("../scripts/proofs.json");
var FP_Object = require("../scripts/false-proof.json");

contract("VerifierContract", (accounts) => {
  let contract;
  beforeEach(async () => {
    contract = await VerifierContract.new();
  });

  // Test verification with correct proof
  // - use the contents from proof.json generated from zokrates steps
  it("Test verification with correct proof", async () => {
    let isVerified = await contract.verifyTx.call(
      proofObject.proofs[0].proof.a,
      proofObject.proofs[0].proof.b,
      proofObject.proofs[0].proof.c,
      proofObject.proofs[0].inputs,
      { gas: 300000 }
    );

    assert.equal(isVerified, true, "Error: Verifing went wrong");
  });

  // Test verification with incorrect proof
  it("Test verification with incorrect proof", async () => {
    let isVerified;
    try {
      isVerified = await contract.verifyTx.call(
        FP_Object.proof.a,
        FP_Object.proof.b,
        FP_Object.proof.c,
        FP_Object.inputs,
        { gas: 300000 }
      );
      isVerified = true;
    } catch (error) {
      isVerified = false;
    }

    assert.equal(isVerified, false, "Error: false proof is working");
  });
});
