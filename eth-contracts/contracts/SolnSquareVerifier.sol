pragma solidity >=0.4.21 <0.6.0;

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import './ERC721Mintable.sol';
// import "./Verifier.sol";
// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Token{
    // add an instance of Verifier interface
    Verifier private verifierContract;
// TODO define a solutions struct that can hold an index & an address
struct Solution {
    uint256 index;
    address account;
}
// TODO define an array of the above struct
Solution[] private solutions;
// TODO define a mapping to store unique solutions submitted
mapping(bytes32 => Solution) private solutionsMapping;
// TODO Create an event to emit when a solution is added
event AddSolution(uint256 index, address account, bytes32 key);

constructor(address account) public{
    verifierContract = Verifier(account);
}
// TODO Create a function to add the solutions to the array and emit the event
function addSolution(uint256 index, address account, bytes32 key) internal{
    Solution memory _solution = Solution({index: index, account: account});
    solutionsMapping[key] = _solution;
    solutions.push(_solution);
    emit AddSolution(index, account, key);
}
// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly
function mintNFT (address account,
            uint256 index,
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[2] memory input) public
            {
        bytes32 key = keccak256(abi.encodePacked(a, b, c, input));
        require(verifierContract.verifyTx(a, b, c, input) == true, "Incorrect proof value");
        require(solutionsMapping[key].account == address(0), "Solution is already exists");
        addSolution(index, account, key);
        super.mint(account, index);
    }
}

contract Verifier{
    function verifyTx(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[2] memory input
        ) public returns (bool r);
}