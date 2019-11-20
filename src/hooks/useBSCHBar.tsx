import { useCallback } from "react";

import { ethers } from "ethers";
import { BSCH_BAR } from "../constants/contracts";
import { getContract } from "../utils";
import { logTransaction } from "../utils/analytics-utils";

const useBSCHBar = () => {
    const enter = useCallback(async (amount: ethers.BigNumber, signer: ethers.Signer) => {
        const bschBar = getContract("BSCHBar", BSCH_BAR, signer);
        const gasLimit = await bschBar.estimateGas.enter(amount);
        const tx = await bschBar.enter(amount, {
            gasLimit: gasLimit.mul(120).div(100)
        });
        return logTransaction(tx, "BSCHBar.enter()", amount.toString());
    }, []);

    const leave = useCallback(async (amount: ethers.BigNumber, signer: ethers.Signer) => {
        const bschBar = getContract("BSCHBar", BSCH_BAR, signer);
        const gasLimit = await bschBar.estimateGas.leave(amount);
        const tx = await bschBar.leave(amount, {
            gasLimit: gasLimit.mul(120).div(100)
        });
        return logTransaction(tx, "BSCHBar.leave()", amount.toString());
    }, []);

    return {
        enter,
        leave
    };
};

export default useBSCHBar;
