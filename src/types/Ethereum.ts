import { EventType, Listener } from "@ethersproject/abstract-provider";

interface JsonRPCRequest {
    jsonrpc: string;
    method: string;
    params: any[];
    id: number;
}

interface JsonRPCResponse {
    jsonrpc: string;
    id: number;
    result?: any;
    error?: string;
}

interface Callback<ResultType> {
    (error: Error): void;
    (error: null, val: ResultType): void;
}

interface RequestArguments {
    method: string;
    params?: unknown[] | object;
}

export default interface Ethereum {
    isMetaMask?: boolean;
    isWalletConnect?: boolean;
    disconnect?: () => Promise<void>;
    send(payload: any, callback: any): any;
    send(payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>): any;
    request(args: RequestArguments): Promise<any>;
    on(eventName: EventType, listener: Listener);
    off(eventName: EventType, listener: Listener);
    removeListener?: (...args: any[]) => void;
}
interface BinanceChain {
    send: unknown
    enable: () => Promise<string[]>
    on?: (method: string, listener: (...args: any[]) => void) => void
    removeListener?: (method: string, listener: (...args: any[]) => void) => void
  }
  

declare global {
    interface Window {
        ethereum?: Ethereum;
        web3?: {};
        BinanceChain?: BinanceChain;
    }
}
