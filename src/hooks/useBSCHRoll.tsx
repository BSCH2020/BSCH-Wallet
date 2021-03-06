import { useCallback, useContext } from "react";

import { signERC2612Permit } from "eth-permit";
import { ethers } from "ethers";
import { BSCH_ROLL } from "../constants/contracts";
import { EthersContext } from "../context/EthersContext";
import LPToken from "../types/LPToken";
import { getContract } from "../utils";
import { logTransaction } from "../utils/analytics-utils";

// tslint:disable-next-line:max-func-body-length
const useBSCHRoll = () => {
    const { ethereum } = useContext(EthersContext);
    const ttl = 60 * 20;

    const migrate = useCallback(
        async (lpToken: LPToken, amount: ethers.BigNumber, signer: ethers.Signer) => {
            const bschRoll = getContract("BSCHRoll", BSCH_ROLL, signer);
            const deadline = Math.floor(new Date().getTime() / 1000) + ttl;
            const args = [
                lpToken.tokenA.address,
                lpToken.tokenB.address,
                amount,
                ethers.constants.Zero,
                ethers.constants.Zero,
                deadline
            ];
            const gasLimit = await bschRoll.estimateGas.migrate(...args);
            const tx = await bschRoll.migrate(...args, {
                gasLimit: gasLimit.mul(120).div(100)
            });
            return logTransaction(tx, "BSCHRoll.migrate()", ...args.map(arg => arg.toString()));
        },
        [ethereum]
    );

    const migrateWithPermit = useCallback(
        async (lpToken: LPToken, amount: ethers.BigNumber, signer: ethers.Signer) => {
            const bschRoll = getContract("BSCHRoll", BSCH_ROLL, signer);
            const deadline = Math.floor(new Date().getTime() / 1000) + ttl;
            const permit = await signERC2612Permit(
                ethereum,
                lpToken.address,
                await signer.getAddress(),
                BSCH_ROLL,
                amount.toString(),
                deadline
            );
            const args = [
                lpToken.tokenA.address,
                lpToken.tokenB.address,
                amount,
                ethers.constants.Zero,
                ethers.constants.Zero,
                deadline,
                permit.v,
                permit.r,
                permit.s
            ];
            const gasLimit = await bschRoll.estimateGas.migrateWithPermit(...args);
            const tx = await bschRoll.migrateWithPermit(...args, {
                gasLimit: gasLimit.mul(120).div(100)
            });
            return logTransaction(tx, "BSCHRoll.migrateWithPermit()", ...args.map(arg => arg.toString()));
        },
        [ethereum]
    );

    return {
        migrate,
        migrateWithPermit
    };
};

export default useBSCHRoll;
