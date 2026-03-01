const helpers = require("@nomicfoundation/hardhat-network-helpers");
import { ethers } from "hardhat";

const main = async () => {
    const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const USDTAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
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

    const USDT = await ethers.getContractAt(
        "IERC20",
        USDTAddress,
        impersonatedSigner
    );

    const amountIn = ethers.parseUnits("1000", 6);

    const amountOutMin = ethers.parseUnits("1000", 6);

    const path = [USDTAddress, USDCAddress];

    const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

    const usdcBalanceBefore = await USDC.balanceOf(TokenHolder);

    const usdtBalanceBefore = await USDT.balanceOf(TokenHolder);

    console.log("=======Before============");

    console.log("usdt balance before", Number(usdtBalanceBefore));
    console.log("usdc balance before", Number(usdcBalanceBefore));

    await USDT.approve(UNIRouter, amountIn);
    const transaction = await UniRouterContract.swapExactTokensForTokens(
        amountIn,
        amountOutMin,
        path,
        TokenHolder,
        deadline,

    );

    await transaction.wait();

    console.log("=======After============");
    const usdcBalanceAfter = await USDC.balanceOf(TokenHolder);
    const usdtBalanceAfter = await USDT.balanceOf(TokenHolder);
    console.log("usdt balance after", ethers.formatUnits(usdtBalanceAfter, 6));
    console.log("usdc balance after", ethers.formatUnits(usdcBalanceAfter, 6));


    console.log("=========Difference==========");
    const newUsdcValue = Number(usdcBalanceAfter - usdcBalanceBefore);
    const newUsdtValue = usdtBalanceBefore - usdtBalanceAfter;
    console.log("NEW USDC BALANCE: ", ethers.formatUnits(newUsdcValue, 6));
    console.log("NEW USDT BALANCE: ", ethers.formatUnits(newUsdtValue));
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;

});