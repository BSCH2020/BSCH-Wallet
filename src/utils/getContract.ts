import ERC20 from "@bschswap/core/build/contracts/ERC20.json";
import IUniswapV2Factory from "@bschswap/core/build/contracts/IUniswapV2Factory.json";
import IUniswapV2Pair from "@bschswap/core/build/contracts/IUniswapV2Pair.json";
import IUniswapV2Router02 from "@bschswap/core/build/contracts/IUniswapV2Router02.json";
import IWETH from "@bschswap/core/build/contracts/IWETH.json";
import MasterChef from "@bschswap/core/build/contracts/MasterChef.json";
import BSCHBar from "@bschswap/core/build/contracts/BSCHBar.json";
import BSCHRoll from "@bschswap/core/build/contracts/BSCHRoll.json";
import OrderBook from "@bschswap/settlement/deployments/kovan/OrderBook.json";
import Settlement from "@bschswap/settlement/deployments/mainnet/Settlement.json";
import ZapIn from "@bschswap/zapper/artifacts/BSCHswap_ZapIn_General_V2.json";
import ZapOut from "@bschswap/zapper/artifacts/BSCHswap_ZapOut_General_V1.json";
import { ethers } from "ethers";
import LPTokenScanner from "../constants/abi/LPTokenScanner.json";

import IBEP20 from "../core/build/contracts/IBEP20.json";
import IMiningFarm from "../core/build/contracts/IMiningFarm.json";
import ISTokenERC20 from "../core/build/contracts/ISTokenERC20.json";
import V2FarmWithApiWithUpgrade from "../core/build/contracts/V2FarmWithApiWithUpgrade.json";
const CONTRACTS = {
    IBEP20,
    IMiningFarm,
    ISTokenERC20,
    V2FarmWithApiWithUpgrade,
    ERC20,
    IUniswapV2Factory,
    IUniswapV2Pair,
    IUniswapV2Router02,
    IWETH,
    MasterChef,
    BSCHBar,
    BSCHRoll,
    OrderBook,
    Settlement,
    LPTokenScanner: { abi: LPTokenScanner },
    ZapIn,
    ZapOut
};

const getContract = (name: string, address: string, signerOrProvider: ethers.Signer | ethers.providers.Provider) => {
    const contract = CONTRACTS[name];
    return new ethers.Contract(address, contract.abi, signerOrProvider);
};

export default getContract;
