// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Transactions {
    uint256 TransactionCount;

    event transactionEvent(address from,address to,uint amount,string message,uint timestamp,string keyword);
    struct Transaction{
        address sender;
        address receiver;
        uint amount;
        string message;
        uint timestamp;
        string keyword;
    }
    Transaction[] transactions;
    function addtoBlockchain(address payable receiver,uint amount,string memory message,string memory keyword) public {
        TransactionCount+=1;
        transactions.push(Transaction(msg.sender,receiver,amount,message,block.timestamp,keyword));

        emit transactionEvent(msg.sender,receiver,amount,message,block.timestamp,keyword);
    }
    function AllTransactions() public view returns (Transaction[] memory){
        return transactions;
    }
    function totalTransactions() public view returns (uint256){
        return TransactionCount;
    }
}
