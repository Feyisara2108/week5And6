const helpers = require("@nomicfoundation/hardhat-network-helpers");
import { ethers } from "hardhat";
import { main as addLiquidityETH } from "./addLiquidityETH";

const main = async () => {
  const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const WETHAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const UNIFactory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
  const TokenHolder = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";

  // addLiquidityETH  should tun first to get LP tokens
  await addLiquidityETH();

  await helpers.impersonateAccount(TokenHolder);
  const impersonatedSigner = await ethers.getSigner(TokenHolder);

  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  const DAI = await ethers.getContractAt("IERC20", DAIAddress, impersonatedSigner);
  const UniRouterContract = await ethers.getContractAt("IUniswapV2Router", UNIRouter, impersonatedSigner);
  const UniFactoryContract = await ethers.getContractAt(
    ["function getPair(address,address) view returns (address)"],
    UNIFactory,
    impersonatedSigner
  );

  const pairAddress = await UniFactoryContract.getPair(DAIAddress, WETHAddress);
  const LPToken = await ethers.getContractAt("IERC20", pairAddress, impersonatedSigner);

  const lpBalance = await LPToken.balanceOf(impersonatedSigner.address);
  const daiBalanceBefore = await DAI.balanceOf(impersonatedSigner.address);
  const ethBalanceBefore = await ethers.provider.getBalance(impersonatedSigner.address);

  console.log("=======Before============");
  console.log("lp balance before", ethers.formatUnits(lpBalance, 18));
  console.log("dai balance before", ethers.formatUnits(daiBalanceBefore, 18));
  console.log("eth balance before", ethers.formatEther(ethBalanceBefore));

  await LPToken.approve(UNIRouter, lpBalance);

  const transaction = await UniRouterContract.removeLiquidityETH(
    DAIAddress,
    lpBalance,
    0n,
    0n,
    impersonatedSigner.address,
    deadline
  );

  await transaction.wait();

  const daiBalanceAfter = await DAI.balanceOf(impersonatedSigner.address);
  const ethBalanceAfter = await ethers.provider.getBalance(impersonatedSigner.address);

  console.log("=======After============");
  console.log("dai balance after", ethers.formatUnits(daiBalanceAfter, 18));
  console.log("eth balance after", ethers.formatEther(ethBalanceAfter));

  console.log("=========Difference==========");
  const daiReceived = daiBalanceAfter - daiBalanceBefore;
  const ethReceived = ethBalanceAfter - ethBalanceBefore;
  console.log("DAI RECEIVED:", ethers.formatUnits(daiReceived, 18));
  console.log("ETH RECEIVED:", ethers.formatEther(ethReceived));
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});