const helpers = require("@nomicfoundation/hardhat-network-helpers");
import { ethers } from "hardhat";

const main = async () => {
  const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const TokenHolder = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";

  await helpers.impersonateAccount(TokenHolder);
  const impersonatedSigner = await ethers.getSigner(TokenHolder);

  const token = ethers.parseUnits("10000", 18);
  const amountTokenDesired = ethers.parseUnits("10000", 18);
  const amountTokenMin = ethers.parseUnits("9000", 18);
  const amountETHMin = ethers.parseEther("1");
  const ethToSend = ethers.parseEther("5");

  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  const DAI = await ethers.getContractAt("IERC20", DAIAddress, impersonatedSigner);
  const ROUTER = await ethers.getContractAt("IUniswapV2Router", UNIRouter, impersonatedSigner);

  await DAI.approve(UNIRouter, amountTokenDesired);
  const daiBalBefore = await DAI.balanceOf(impersonatedSigner.address);
  const ethBalBefore = await ethers.provider.getBalance(impersonatedSigner.address);

  console.log("=================Before========================================");
  console.log("DAI Balance before:", ethers.formatUnits(daiBalBefore, 18));
  console.log("ETH Balance before:", ethers.formatEther(ethBalBefore));

  const tx = await ROUTER.addLiquidityETH(
    DAIAddress,           
    amountTokenDesired,  
    amountTokenMin,       
    amountETHMin,        
    impersonatedSigner.address,
    deadline,
    { value: ethToSend }  
  );

  await tx.wait();

  const daiBalAfter = await DAI.balanceOf(impersonatedSigner.address);
  const ethBalAfter = await ethers.provider.getBalance(impersonatedSigner.address);

  console.log("=================After========================================");
  console.log("DAI Balance after:", ethers.formatUnits(daiBalAfter, 18));
  console.log("ETH Balance after:", ethers.formatEther(ethBalAfter));

  console.log("=========Difference===========================================");
  const daiUsed = daiBalBefore - daiBalAfter;
  const ethUsed = ethBalBefore - ethBalAfter;
  console.log("DAI USED:", ethers.formatUnits(daiUsed, 18));
  console.log("ETH USED:", ethers.formatEther(ethUsed));
  console.log("Liquidity added successfully!");
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});





























