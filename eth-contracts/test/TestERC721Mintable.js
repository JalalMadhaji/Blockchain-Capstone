var ERC721MintableComplete = artifacts.require("CustomERC721Token");

contract("TestERC721Mintable", (accounts) => {
  const account_one = accounts[0];
  const account_two = accounts[1];
  let contract;

  describe("match erc721 spec", () => {
    beforeEach(async () => {
      contract = await ERC721MintableComplete.new({ from: account_one });

      // TODO: mint multiple tokens
      for (let i = 1; i < 10; i++) {
        await contract.mint(accounts[i], i, {
          from: account_one,
        });
      }
    });

    it("should return total supply", async () => {
      let result = await contract.totalSupply();
      assert.equal(result, 9, "Error: Total supply is not working as expected");
    });

    it("should get token balance", async () => {
      let result = await contract.balanceOf(accounts[2], {
        from: accounts[2],
      });
      assert.equal(result, 1, "Error: Wrong token balance");
    });

    // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it("should return token uri", async () => {
      let result = await contract.tokenURI(3);
      assert.equal(
        result,
        "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/3",
        "Error: wrong token URI"
      );
    });

    it("should transfer token from one owner to another", async () => {
      await contract.transferFrom(accounts[4], accounts[5], 4, {
        from: accounts[4],
      });
      let result = await contract.ownerOf(4);
      assert.equal(
        result,
        accounts[5],
        "Error: This address is not the owner of the tokenId"
      );
    });
  });

  describe("have ownership properties", () => {
    it("should fail when minting when address is not contract owner", async () => {
      let isMinted;
      try {
        await contract.mint(accounts[10], 10, {
          from: account_two,
        });
        isMinted = true;
      } catch (error) {
        isMinted = false;
      }
      assert.equal(
        isMinted,
        false,
        "Error: is minted while address is not contract owner"
      );
    });

    it("should return contract owner", async () => {
      let ownerAddress = await contract.owner();
      assert.equal(
        ownerAddress,
        account_one,
        "Error: owner address is not correct"
      );
    });
  });
});
