const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WalletDistributor", () => {
  let walletDistributor;
  let owner, addr1, addr2;

  before(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();

    const WalletDistributor =
      await ethers.getContractFactory("WalletDistributor");
    walletDistributor = await WalletDistributor.deploy();
    await walletDistributor.deployed();
  });

  it("Should set the right owner", async () => {
    const ownerAddress = await owner.getAddress();
    expect(await walletDistributor.owner()).to.equal(ownerAddress);
  });

  it("Should add recipients correctly", async () => {
    const addr1Address = await addr1.getAddress();
    const addr2Address = await addr2.getAddress();

    await walletDistributor.connect(owner).addRecipient(addr1Address);
    await walletDistributor.connect(owner).addRecipient(addr2Address);

    const recipients = await walletDistributor.recipientWallets();
    expect(recipients).to.include(addr1Address);
    expect(recipients).to.include(addr2Address);
  });

  it("Should distribute funds equally", async () => {
    const sendValue = ethers.utils.parseEther("1.0");

    const addr1Address = await addr1.getAddress();
    const addr2Address = await addr2.getAddress();

    await walletDistributor.connect(owner).addRecipient(addr1Address);
    await walletDistributor.connect(owner).addRecipient(addr2Address);

    const initialContractBalance = await ethers.provider.getBalance(
      walletDistributor.address
    );
    await owner.sendTransaction({
      to: walletDistributor.address,
      value: sendValue,
    });

    const postSendContractBalance = await ethers.provider.getBalance(
      walletDistributor.address
    );
    expect(postSendContractBalance.sub(initialContractBalance)).to.equal(
      sendValue
    );

    const initialBalanceAddr1 = await ethers.provider.getBalance(addr1Address);
    const initialBalanceAddr2 = await ethers.provider.getBalance(addr2Address);

    const tx = await walletDistributor.connect(owner).distributeFunds();
    await tx.wait();

    const finalBalanceAddr1 = await ethers.provider.getBalance(addr1Address);
    const finalBalanceAddr2 = await ethers.provider.getBalance(addr2Address);

    expect(finalBalanceAddr1.sub(initialBalanceAddr1)).to.equal(
      sendValue.div(2)
    );
    expect(finalBalanceAddr2.sub(initialBalanceAddr2)).to.equal(
      sendValue.div(2)
    );
  });
});
