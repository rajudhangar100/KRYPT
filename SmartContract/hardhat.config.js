require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports={
  solidity: '0.8.28',
  networks:{
    sepolia:{
      url: 'https://eth-sepolia.g.alchemy.com/v2/qft2K2u07O2qfBLlvvIw8iFT4Z4-OhBl',
      accounts: ['5942f95dfe2f0d274ae2458a0469de8968ebfc91e7dd38331b90862b92efae2d']
    }
  }
}
//Decorators are used to add special functionality to ur class and methods here it was @require