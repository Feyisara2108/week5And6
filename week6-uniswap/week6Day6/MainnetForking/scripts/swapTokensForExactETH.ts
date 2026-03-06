const helpers = require("@nomicfoundation/hardhat-network-helpers");
import { ethers } from "hardhat";

const main = async () => {
  const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const WETHAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const TokenHolder = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";

  await helpers.impersonateAccount(TokenHolder);
  const impersonatedSigner = await ethers.getSigner(TokenHolder);

  const USDC = await ethers.getContractAt(
    "IERC20",
    USDCAddress,
    impersonatedSigner
  );

  const UniRouterContract = await ethers.getContractAt(
    "IUniswapV2Router",
    UNIRouter,
    impersonatedSigner
  );

  const amountOut = ethers.parseUnits("1", 18);

  const amountInMax = ethers.parseUnits("3000", 6);

  const path = [ USDCAddress, WETHAddress];

  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  const usdcBalanceBefore = await USDC.balanceOf(impersonatedSigner.address);

  const wethBalanceBefore = await ethers.provider.getBalance(
    impersonatedSigner.address
  );

  console.log("=======Before============");

  console.log("weth balance before", Number(wethBalanceBefore, ));
  console.log("usdc balance before", Number(usdcBalanceBefore, ));

  await USDC.approve(UNIRouter, amountInMax);

  const transaction = await UniRouterContract.swapTokensForExactETH(
    amountOut,
    amountInMax,
    path,
    impersonatedSigner.address,
    deadline,
  );

  await transaction.wait();

  console.log("=======After============");
  const usdcBalanceAfter = await USDC.balanceOf(impersonatedSigner.address);
  const wethBalanceAfter = await ethers.provider.getBalance(impersonatedSigner.address);
  console.log("weth balance after", Number(wethBalanceAfter));
  console.log("usdc balance after", Number(usdcBalanceAfter));

  console.log("=========Difference==========");
  const newUsdcValue = Number(usdcBalanceAfter - usdcBalanceBefore);
  const newWethValue = wethBalanceBefore - wethBalanceAfter;
  console.log("NEW USDC BALANCE: ", ethers.formatUnits(newUsdcValue, 6));
  console.log("NEW WETH BALANCE: ", ethers.formatEther(newWethValue));
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});










