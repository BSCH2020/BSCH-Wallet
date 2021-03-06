import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

import { NetworkConnector } from './NetworkConnector'
import { BscConnector } from './bsc/bscConnector'
import getEnvVars from '../../environment';
const {REACT_APP_NETWORK_URL,REACT_APP_CHAIN_ID} =getEnvVars()

const NETWORK_URL = REACT_APP_NETWORK_URL

export const NETWORK_CHAIN_ID: number = parseInt(REACT_APP_CHAIN_ID ?? '1')

if (typeof NETWORK_URL === 'undefined') {
    throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`)
}

export const network = new NetworkConnector({
    urls: { [NETWORK_CHAIN_ID]: NETWORK_URL }
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any))
}

export const injected = new InjectedConnector({
  supportedChainIds: [56, 97]
})

export const bsc = new BscConnector({ supportedChainIds: [56,97] })

// mainnet only
export const walletconnect = new WalletConnectConnector({
  rpc: { 1: NETWORK_URL },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 15000
})
