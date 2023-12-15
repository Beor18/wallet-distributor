import { ethers } from "hardhat";
import type { WalletDistributor__factory } from "../typechain-types";

async function main(): Promise<void> {
  const walletDistributorFactory = (await ethers.getContractFactory(
    "WalletDistributor"
  )) as WalletDistributor__factory;

  const walletDistributor = await walletDistributorFactory.deploy();

  await walletDistributor.deployed();

  console.log(`WalletDistributor deployed to: ${walletDistributor.address}`);
}

main().catch((error: Error) => {
  console.error(error);
  process.exit(1);
});
