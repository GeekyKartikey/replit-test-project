// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {MonadNFT} from "../src/MonadNFT.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();
        address deployer = msg.sender;
        MonadNFT nft = new MonadNFT(deployer);
        console.log("MonadNFT deployed to:", address(nft));
        console.log("Owner:", deployer);
        vm.stopBroadcast();
    }
}
