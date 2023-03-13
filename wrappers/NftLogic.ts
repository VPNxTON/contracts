import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type NftLogicConfig = {};

export function nftLogicConfigToCell(config: NftLogicConfig): Cell {
    return beginCell().endCell();
}

export class NftLogic implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new NftLogic(address);
    }

    static createFromConfig(config: NftLogicConfig, code: Cell, workchain = 0) {
        const data = nftLogicConfigToCell(config);
        const init = { code, data };
        return new NftLogic(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
