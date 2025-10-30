const hre = require("hardhat");

async function main() {
  console.log("Deploying Resume contract to Base network...");

  const Resume = await hre.ethers.getContractFactory("Resume");
  const resume = await Resume.deploy();

  await resume.waitForDeployment();

  const address = await resume.getAddress();
  console.log("Resume contract deployed to:", address);
  console.log("Entry fee:", await resume.entryFee());

  console.log("\nVerify with:");
  console.log(`npx hardhat verify --network base ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});