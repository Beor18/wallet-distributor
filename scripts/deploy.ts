import { ethers } from "hardhat";
import type { WalletDistributor__factory } from "../typechain-types";

async function main(): Promise<void> {
  const [deployer] = await ethers.getSigners();

  // Verificar si la cuenta de despliegue tiene una clave privada asignada
  if (!deployer) {
    throw new Error("No deployer account found");
  }

  console.log(`Deploying contract with the account: ${deployer.address}`);

  // const balance = await deployer.getBalance();
  // console.log(`Account balance: ${ethers.utils.formatEther(balance)} ETH`);

  const walletDistributorFactory = (await ethers.getContractFactory(
    "WalletDistributor",
    deployer
  )) as WalletDistributor__factory;

  console.log("Deploying WalletDistributor...");
  const walletDistributor = await walletDistributorFactory.deploy();

  await walletDistributor.deployed();

  console.log(`WalletDistributor deployed to: ${walletDistributor.address}`);

  // Opcional: Obtener y mostrar el costo del gas utilizado para el despliegue
  const receipt = await ethers.provider.getTransactionReceipt(
    walletDistributor.deployTransaction.hash
  );
  console.log(`Gas used for deployment: ${receipt.gasUsed.toString()}`);
}

main().catch((error: Error) => {
  console.error("Error during deployment:", error);
  process.exit(1);
});
