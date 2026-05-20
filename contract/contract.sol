// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Donation{
    address public owner ;

    uint256 totalDonations;

    uint256 donorCount ;

    event Donated(address sender, uint256 amount);

    constructor(){
        owner=msg.sender;
    }

    function donate() external payable {
        require(msg.value>0,"Should be money");
        totalDonations += msg.value ;
        donorCount++;

        emit Donated(msg.sender, msg.value);
    }

    function getBalance() external view returns (uint256){
            return totalDonations;
    }
}