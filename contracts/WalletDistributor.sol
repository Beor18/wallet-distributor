// SPDX-License-Identifier: MIT
// Builder Fernando (Beor)
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract WalletDistributor is Ownable, ReentrancyGuard {
    event FundsDistributed(address recipient, uint amount);
    event RecipientAdded(address recipient);
    event ReceivedFunds(address from, uint amount);

    address[] public recipientWallets;

    function addRecipient(address wallet) public onlyOwner {
        require(wallet != address(0), "Invalid address");
        recipientWallets.push(wallet);
        emit RecipientAdded(wallet);
    }

    function distributeFunds() public onlyOwner nonReentrant {
        uint totalRecipients = recipientWallets.length;
        require(totalRecipients > 0, "No recipients available");
        uint amountPerRecipient = address(this).balance / totalRecipients;

        for (uint i = 0; i < totalRecipients; i++) {
            (bool sent, ) = payable(recipientWallets[i]).call{
                value: amountPerRecipient
            }("");
            require(sent, "Failed to send Ether");
            emit FundsDistributed(recipientWallets[i], amountPerRecipient);
        }
    }

    receive() external payable {
        emit ReceivedFunds(msg.sender, msg.value);
    }
}
