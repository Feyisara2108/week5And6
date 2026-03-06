// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test, console2} from "forge-std/Test.sol";

contract SwapTest is Test {
    IU uni;
    IU l;
    IU u;
    address usdc = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    address lisk = 0x6033F7f88332B8db6ad452B7C6D5bB643990aE3f;
    address usdcHolder = 0x28C6c06298d514Db089934071355E5743bf21d60;
    address liskHolder = 0x20D4d2427Ee54780225afa6Ddd65Bc0B93613408;
    address router = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address f = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;

    function setUp() public {
        uni = IU(router);
        l = IU(lisk);
        u = IU(usdc);
    }

    function testSwap() public {
        vm.createSelectFork("https://0xrpc.io/eth");
        vm.startPrank(liskHolder);
        l.transfer(usdcHolder, 10000e18);

        vm.startPrank(usdcHolder);
        u.approve(router, 100000e18);
        l.approve(router, 100000e18);

        //create pair
        IU(f).createPair(usdc, lisk);
        uni.addLiquidity(usdc, lisk, 1000e6, 5000e18, 0, 0, usdcHolder, block.timestamp + 9999);
        address[] memory i = new address[](2);
        i[0] = usdc;
        i[1] = lisk;

        uni.swapExactTokensForTokens(100e6, 0, i, address(0xbeef), block.timestamp + 7999);
    }
}

interface IU {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);
    function swapTokensForExactTokens(
        uint256 amountOut,
        uint256 amountInMax,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);
    function swapExactETHForTokens(uint256 amountOutMin, address[] calldata path, address to, uint256 deadline)
        external
        payable
        returns (uint256[] memory amounts);
    function swapTokensForExactETH(
        uint256 amountOut,
        uint256 amountInMax,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);
    function swapExactTokensForETH(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapETHForExactTokens(uint256 amountOut, address[] calldata path, address to, uint256 deadline)
        external
        payable
        returns (uint256[] memory amounts);

    function transfer(address to, uint256 amount) external;
    function approve(address spender, uint256 amount) external;

    function createPair(address tokenA, address tokenB) external returns (address pair);
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB, uint256 liquidity);
}
