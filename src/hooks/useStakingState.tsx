import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import { ethers } from "ethers";
import useAsyncEffect from "use-async-effect";
import { BSCH_BAR } from "../constants/contracts";
import { EthersContext } from "../context/EthersContext";
import Token from "../types/Token";
import { getContract, parseBalance } from "../utils";
import useBSCHBar from "./useBSCHBar";

export type StakeAction = "bsch-balance" | "stake";
export type UnstakeAction = "xbsch-balance" | "unstake";

export interface StakingState {
    bsch?: Token;
    xBSCH?: Token;
    bschStaked?: ethers.BigNumber;
    bschSupply?: ethers.BigNumber;
    xBSCHSupply?: ethers.BigNumber;
    amount: string;
    setAmount: (amount: string) => void;
    bschAllowed: boolean;
    setBSCHAllowed: (allowed: boolean) => void;
    xBSCHAllowed: boolean;
    setXBSCHAllowed: (allowed: boolean) => void;
    loading: boolean;
    onEnter: () => Promise<void>;
    entering: boolean;
    onLeave: () => Promise<void>;
    leaving: boolean;
}

// tslint:disable-next-line:max-func-body-length
const useStakingState: () => StakingState = () => {
    const { signer, address, getTokenAllowance, tokens, updateTokens } = useContext(EthersContext);
    const { enter, leave } = useBSCHBar();
    const [bschStaked, setBSCHStaked] = useState<ethers.BigNumber>();
    const [bschSupply, setBSCHSupply] = useState<ethers.BigNumber>();
    const [xBSCHSupply, setXBSCHSupply] = useState<ethers.BigNumber>();
    const [amount, setAmount] = useState("");
    const [bschAllowed, setBSCHAllowed] = useState(false);
    const [xBSCHAllowed, setXBSCHAllowed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [entering, setEntering] = useState(false);
    const [leaving, setLeaving] = useState(false);

    const bsch = useMemo(() => tokens.find(token => token.symbol === "BSCH"), [tokens]);
    const xBSCH = useMemo(() => tokens.find(token => token.symbol === "xBSCH"), [tokens]);

    useEffect(() => {
        setAmount("");
    }, [address]);

    useAsyncEffect(async () => {
        if (bsch && xBSCH && signer) {
            setBSCHAllowed(false);
            setXBSCHAllowed(false);
            setLoading(true);
            try {
                const minAllowance = ethers.BigNumber.from(2)
                    .pow(96)
                    .sub(1);
                const bschAllowance = await getTokenAllowance(bsch.address, BSCH_BAR);
                setBSCHAllowed(ethers.BigNumber.from(bschAllowance).gte(minAllowance));
                const xBSCHAllowance = await getTokenAllowance(xBSCH.address, BSCH_BAR);
                setXBSCHAllowed(ethers.BigNumber.from(xBSCHAllowance).gte(minAllowance));

                const bschContract = getContract("ERC20", bsch.address, signer);
                setBSCHStaked(await bschContract.balanceOf(BSCH_BAR));
                setBSCHSupply(await bschContract.totalSupply());
                const xBSCHContract = getContract("ERC20", xBSCH.address, signer);
                setXBSCHSupply(await xBSCHContract.totalSupply());
            } finally {
                setLoading(false);
            }
        }
    }, [bsch, xBSCH, signer]);

    const onEnter = useCallback(async () => {
        if (amount && bsch && signer) {
            setEntering(true);
            try {
                const parsed = parseBalance(amount, bsch.decimals);
                const tx = await enter(parsed, signer);
                if (tx) {
                    await tx.wait();
                    await updateTokens();
                    setAmount("");
                }
            } finally {
                setEntering(false);
            }
        }
    }, [amount, bsch, signer]);

    const onLeave = useCallback(async () => {
        if (amount && xBSCH && signer) {
            setLeaving(true);
            try {
                const parsed = parseBalance(amount, xBSCH.decimals);
                const tx = await leave(parsed, signer);
                if (tx) {
                    await tx.wait();
                    await updateTokens();
                    setAmount("");
                }
            } finally {
                setLeaving(false);
            }
        }
    }, [amount, xBSCH, signer]);

    return {
        bsch,
        xBSCH,
        bschStaked,
        bschSupply,
        xBSCHSupply,
        amount,
        setAmount,
        bschAllowed,
        setBSCHAllowed,
        xBSCHAllowed,
        setXBSCHAllowed,
        loading,
        onEnter,
        entering,
        onLeave,
        leaving
    };
};

export default useStakingState;
