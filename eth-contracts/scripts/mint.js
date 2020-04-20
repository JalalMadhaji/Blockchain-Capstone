const HDWalletProvider = require("truffle-hdwallet-provider");
const web3 = require("web3");
const MNEMONIC = "";
const INFURA_URL = "";
const NFT_CONTRACT_ADDRESS = "0x9BE6c9F4a3137d648e26F5659099398581fC5C5C";
const OWNER_ADDRESS = "0x0470989053748dFF261E81FaE29B7234a3607258";
const NFT_CONTRACT_ABI = require("../build/contracts/SolnSquareVerifier.json");
const proofsObject = require("./proofs.json");

async function main() {
  const provider = new HDWalletProvider(MNEMONIC, INFURA_URL);
  const web3Instance = new web3(provider);

  const nftContract = new web3Instance.eth.Contract(
    NFT_CONTRACT_ABI.abi,
    NFT_CONTRACT_ADDRESS,
    { gasLimit: "1000000" }
  );

  // Creatures issued directly to the owner.
  for (var i = 0; i < proofsObject.proofs.length; i++) {
    const result = await nftContract.methods
      .mintNFT(
        OWNER_ADDRESS,
        i,
        proofsObject.proofs[i].proof.a,
        proofsObject.proofs[i].proof.b,
        proofsObject.proofs[i].proof.c,
        proofsObject.proofs[i].inputs
      )
      .send({ from: OWNER_ADDRESS });
    console.log("Minted creature. Transaction: " + result.transactionHash);
  }
}

main();
