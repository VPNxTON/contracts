import { Cell } from "ton";

const OFF_CHAIN_CONTENT_PREFIX = 0x01;

function bufferToChunks(buff: Buffer, chunkSize: number) {
  let chunks: Buffer[] = [];
  while (buff.byteLength > 0) {
    chunks.push(buff.slice(0, chunkSize));
    buff = buff.slice(chunkSize);
  }
  return chunks;
}

export function makeSnakeCell(data: Buffer) {
  let chunks = bufferToChunks(data, 127);
  let rootCell = new Cell();
  let curCell = rootCell;

  for (let i = 0; i < chunks.length; i++) {
    let chunk = chunks[i];

    curCell.bits.writeBuffer(chunk);

    if (chunks[i + 1]) {
      let nextCell = new Cell();
      curCell.refs.push(nextCell);
      curCell = nextCell;
    }
  }

  return rootCell;
}


export function flattenSnakeCell(cell: Cell) {
  let c: Cell|null = cell

  let res = Buffer.alloc(0)

  while (c) {
      let cs = c.beginParse()
      let data = cs.readRemainingBytes()
      res = Buffer.concat([res, data])
      c = c.refs[0]
  }

  return res
}
export function encodeOffChainContent(content: string) {
  let data = Buffer.from(content);
  let offChainPrefix = Buffer.from([OFF_CHAIN_CONTENT_PREFIX]);
  data = Buffer.concat([offChainPrefix, data]);
  return makeSnakeCell(data);
}

export function decodeOffChainContent(content: Cell) {
  let data = flattenSnakeCell(content)

  let prefix = data[0]
  if (prefix !== OFF_CHAIN_CONTENT_PREFIX) {
      throw new Error(`Unknown content prefix: ${prefix.toString(16)}`)
  }
  return data.slice(1).toString()
}
export function buildNftCollectionDataCell(data: any) {
  let dataCell = new Cell();

  dataCell.bits.writeAddress(data.ownerAddress);
  dataCell.bits.writeUint(data.nextItemIndex, 64);

  let contentCell = new Cell();

  let collectionContent = encodeOffChainContent(data.collectionContent);

  let commonContent = new Cell();
  commonContent.bits.writeBuffer(Buffer.from(data.commonContent));
  // commonContent.bits.writeString(data.commonContent)

  contentCell.refs.push(collectionContent);
  contentCell.refs.push(commonContent);
  dataCell.refs.push(contentCell);

  dataCell.refs.push(data.nftItemCode);

  let royaltyCell = new Cell();
  royaltyCell.bits.writeUint(data.royaltyParams.royaltyFactor, 16);
  royaltyCell.bits.writeUint(data.royaltyParams.royaltyBase, 16);
  royaltyCell.bits.writeAddress(data.royaltyParams.royaltyAddress);
  dataCell.refs.push(royaltyCell);

  return dataCell;
}
