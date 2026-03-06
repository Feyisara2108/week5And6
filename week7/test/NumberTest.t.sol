//SPDX-License-Identifier:MIT
pragma solidity ^0.8.28;
import {Test, console2} from "forge-std/Test.sol";
import "../src/NumberFactory.sol";

contract NumberTest is Test {
    NumberFactory public nFactory;

    function setUp() public {
        vm.prank(address(0xdead), address(0xdead));
        nFactory = new NumberFactory();
        console2.logBytes(type(NumberChildren).creationCode);
    }

    function testChildDep() external {
        // vm.prank(address(0xdead));       // moved inside a function
        nFactory.registerNumber(123456);
    }
}
