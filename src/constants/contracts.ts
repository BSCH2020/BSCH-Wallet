import OrderBook from "@bschswap/settlement/deployments/kovan/OrderBook.json";
import Settlement from "@bschswap/settlement/deployments/mainnet/Settlement.json";
import getEnvVars from '../../environment';
const {CONTRACT,REACT_APP_CHAIN_ID} =getEnvVars()

// export const UNISWAP_ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
export const BSCHSWAP_ROUTER = "0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f";
export const ROUTER = BSCHSWAP_ROUTER;
export const MASTER_CHEF = "0xc2edad668740f1aa35e4d8f227fb8e17dca888cd";
export const BSCH_BAR = "0x8798249c2e607446efb7ad49ec89dd1865ff4272";
export const BSCH_ROLL = "0x16E58463eb9792Bc236d8860F5BC69A81E26E32B";
export const LP_TOKEN_SCANNER = "0xD132Ce8eA8865348Ac25E416d95ab1Ba84D216AF";
export const ZAP_IN = "0xfF350eDc2242Ca4d7252A64746aec4A5487a852B";
export const ZAP_OUT = "0xf12CAB7Acaa14Eed3bEa82199ea2f5c2C2194B81";
export const ORDER_BOOK = OrderBook.address;
export const SETTLEMENT = Settlement.address;

//bsc testnet
export const BSCH = CONTRACT.STOKEN;
export const BSCHFarm = CONTRACT.FARM;
export const BBTC = CONTRACT.RTOKEN;
export const CHAINID = REACT_APP_CHAIN_ID;
