const hre=require("hardhat");
const main = async () => {
  
  // Get the ContractFactory and Signers from the hardhat environment
  const Transactions = await hre.ethers.getContractFactory("Transactions");
  const transactions = await Transactions.deploy(); // Deploying the contract
  
  await transactions.waitForDeployment();
  
  console.log("Transactions deployed to:", await transactions.getAddress());
};

// Run the deployment function
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
