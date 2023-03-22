import {Address, Cell} from "ton";
import BN from "bn.js";
import { encodeOffChainContent } from "./VXTUtils";

export type RoyaltyParams = {
    royaltyFactor: number
    royaltyBase: number
    royaltyAddress: Address
}

export type NftCollectionData = {
    ownerAddress: Address,
    nextItemIndex: number | BN
    collectionContent: string
    commonContent: string
    nftItemCode: Cell
    royaltyParams: RoyaltyParams
}

export function buildNftCollectionDataCell(data: NftCollectionData) {
    let dataCell = new Cell()

    dataCell.bits.writeAddress(data.ownerAddress)
    dataCell.bits.writeUint(data.nextItemIndex, 64)

    let contentCell = new Cell()

    let collectionContent = encodeOffChainContent(data.collectionContent)

    let commonContent = new Cell()
    commonContent.bits.writeBuffer(Buffer.from(data.commonContent))
    // commonContent.bits.writeString(data.commonContent)

    contentCell.refs.push(collectionContent)
    contentCell.refs.push(commonContent)
    dataCell.refs.push(contentCell)

    dataCell.refs.push(data.nftItemCode)

    let royaltyCell = new Cell()
    royaltyCell.bits.writeUint(data.royaltyParams.royaltyFactor, 16)
    royaltyCell.bits.writeUint(data.royaltyParams.royaltyBase, 16)
    royaltyCell.bits.writeAddress(data.royaltyParams.royaltyAddress)
    dataCell.refs.push(royaltyCell)

    return dataCell
}