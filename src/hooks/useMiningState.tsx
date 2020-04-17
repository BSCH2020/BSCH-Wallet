import { useContext, useEffect, useState } from "react";

import { ethers } from "ethers";
import bschData from "@bschswap/bsch-data";
import useAsyncEffect from "use-async-effect";
import Fraction from "../constants/Fraction";
import { EthersContext } from "../context/EthersContext";
import LPTokenWithValue from "../types/LPTokenWithValue";
import { isWETH } from "../utils";
import { fetchLPTokenWithValue, fetchMyLPTokens, fetchMyPools } from "../utils/fetch-utils";
import useSDK from "./useSDK";
import { viewUserInfo,totalSupplyOfSToken,fetchTotalMinedRTokenInpool, fetchCurrentTotalStakedSTokenInpool,viewTotalRewardInPoolFrom} from "../utils/api-utils";
import { getContract, parseBalance } from "../utils";
import { BSCH,BSCHFarm,BBTC } from "../constants/contracts";
import MiningUserInfo from "../types/MiningUserInfo";
import MiningStakeRecord from "../types/MiningStakeRecord";

export interface MiningState {
    totalMinedBTC:ethers.BigNumber;
    loadingTotalMined:boolean;
    btcInpool:ethers.BigNumber;
    loadingBTCInpool:boolean;
    yourMiningPower:ethers.BigNumber;
    loadingYourMiningPower:boolean; 
    userInfo:MiningUserInfo;
    loadingUserInfo:boolean;
}

// tslint:disable-next-line:max-func-body-length
const useMiningState = () => {
    const { provider, signer, address } = useContext(EthersContext);

    const [totalMinedBTC,setTotalMinedBTC] = useState<ethers.BigNumber>();
    const [loadingTotalMined,setLoadingTotalMined] = useState(true);
    
    const [btcInpool,setBtcInpool] = useState<ethers.BigNumber>();
    const [loadingBTCInpool,setloadingBTCInpool] = useState(true);

    const [yourMiningPower,setYourMiningPower] = useState<ethers.BigNumber>();
    const [loadingYourMiningPower,setLoadingYourMiningPower] = useState(true);
    
    const [userInfo,setUserInfo] = useState<MiningUserInfo>();
    const [loadingUserInfo,setLoadingUserInfo] = useState(true);

    useEffect(() => {
        setTotalMinedBTC(undefined);
        setLoadingTotalMined(true);
        setBtcInpool(undefined);
        setloadingBTCInpool(true);
        setYourMiningPower(undefined);
        setLoadingYourMiningPower(true);
        setLoadingUserInfo(true);
    }, [address]);

    //load total mined BTC in all
    useAsyncEffect(async()=>{
        if (provider && signer) {
            setLoadingTotalMined(true);
            const fetched = await fetchTotalMinedRTokenInpool(provider);
            try{
                setTotalMinedBTC(await fetched);
            }finally{
                setLoadingTotalMined(false);
            }
        }
    },[provider,signer]);
    //load current total staked bsch
    useAsyncEffect(async()=>{
        if (provider && signer ){
            setloadingBTCInpool(true);
            try{
                const rtokenContract = getContract("ERC20", BBTC, signer);
                setBtcInpool(await rtokenContract.balanceOf(BSCHFarm)); 
            }finally{
                setloadingBTCInpool(false);
            }
        }
    },[provider,signer]);
    useAsyncEffect(async()=>{
        if (provider && signer ){
            setLoadingYourMiningPower(true);
            setLoadingUserInfo(true);
            const userInfoInFarm = await viewUserInfo(await signer.getAddress(),provider);
            try{
                const amnt = (await userInfoInFarm).amount;
                const lockedAmnt = (await userInfoInFarm).lockedAmount;
                setYourMiningPower(ethers.BigNumber.from(amnt).add(ethers.BigNumber.from(lockedAmnt)));
                setUserInfo(await userInfoInFarm);
            }finally{
                setLoadingYourMiningPower(false);
                setLoadingUserInfo(false);
            }
        }
    },[provider,signer]);
    
    return {
        totalMinedBTC,
        loadingTotalMined,
        btcInpool,
        loadingBTCInpool,
        yourMiningPower,
        loadingYourMiningPower,
        userInfo,
        loadingUserInfo
    };
};

export default useMiningState;
