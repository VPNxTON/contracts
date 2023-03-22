import {SmartContract} from "ton-contract-executor";

import {Address, Cell,contractAddress,Slice} from "ton";
import {decodeOffChainContent} from "./VXTUtils";
import { getNftItemCodeCell} from "./VXNNftCollection.code";
import BN from "bn.js";
import { NftCollectionData, buildNftCollectionDataCell} from "./VXNNftCollection.data";


export class VXNNftLocal {
    private constructor(
        public readonly contract: SmartContract,
        public readonly address: Address
    ) {

    }
 

    async getCollectionData(): Promise<{ nextItemId: number, ownerAddress: Address, collectionContent: string }> {
        let res = await this.contract.invokeGetMethod('get_collection_data', [])
        if (res.exit_code !== 0) {
            throw new Error(`Unable to invoke get_collection_data on contract`)
        }
        let [nextItemId, collectionContent, ownerAddress] = res.result as [BN, Cell, Slice]

        return {
            nextItemId: nextItemId.toNumber(),
            collectionContent: decodeOffChainContent(collectionContent),
            ownerAddress: ownerAddress.readAddress()!
        }
    }

    async getNftContent(index: number, nftIndividualContent: Cell): Promise<string> {
        let res = await this.contract.invokeGetMethod('get_nft_content', [
            { type: 'int', value: index.toString() },
            { type: 'cell', value: nftIndividualContent.toBoc({ idx: false }).toString('base64')}
        ])

        if (res.type !== 'success') {
            throw new Error('Unable to invoke get_nft_content on collection')
        }

        let [contentCell] = res.result as [Cell]

        return decodeOffChainContent(contentCell)
    }

    static async createFromConfig(config: NftCollectionData) {
        let code = await getNftItemCodeCell()
        let data = buildNftCollectionDataCell(config)
        let contract = await SmartContract.fromCell(code, data)

        let address = contractAddress({
            workchain: 0,
            initialData: contract.dataCell,
            initialCode: contract.codeCell
        })

        contract.setC7Config({
            myself: address
        })

        return new VXNNftLocal(contract, address)
    }

}

