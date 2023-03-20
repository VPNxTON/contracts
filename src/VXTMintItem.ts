import { Address, beginCell, Cell, toNano } from "ton";

import qrcode from "qrcode-terminal";

// CONFIG CONSTANTS

const COLLECTION_ADDRESS = Address.parse(
  "EQCHa481zMpugJewHnkz0GVRb4YINC89oi8yvTVUkXAW4lz0"
);

const OWNER_ADDRESS = Address.parse(
  "EQALSQCRSAdi1bvetHnmhRCmli9jk8QBP-hVkW9j3nq6P09G"
);

const RECEIVER_ADDRESS = Address.parse(
  "EQALSQCRSAdi1bvetHnmhRCmli9jk8QBP-hVkW9j3nq6P09G"
);

const INDEX = 2;

const METADATA_URL =
  "https://gateway.pinata.cloud/ipfs/QmTJCbaoZGG3VCEcj57excMSkZVzPSrC4J38rw6SSxpfSL";

// ------------------------

const main = async () => {
  let itemContent = new Cell();
  itemContent.bits.writeBuffer(Buffer.from(METADATA_URL));
  let nftItemMessage = new Cell();
  nftItemMessage.bits.writeAddress(RECEIVER_ADDRESS);
  nftItemMessage.bits.writeAddress(OWNER_ADDRESS);
  nftItemMessage.refs.push(itemContent);

  const msg = beginCell()
    .storeUint(1, 32)
    .storeUint(1, 64)
    .storeUint(INDEX, 64)
    .storeCoins(toNano(0.01))
    .storeRef(nftItemMessage)
    .endCell();

  // flags work only in user-friendly address form
  const collectionAddr = COLLECTION_ADDRESS.toFriendly({
    urlSafe: true,
    bounceable: true,
  });
  // we must convert TON to nanoTON
  const amountToSend = toNano("0.05").toString();
  // BOC means Bag Of Cells here
  const preparedBodyCell = msg.toBoc().toString("base64url");

  // final method to build a payment url
  const tonDeepLink = (address: string, amount: string, body: string) => {
    return `ton://transfer/${address}?amount=${amount}&bin=${body}`;
  };

  const link = tonDeepLink(collectionAddr, amountToSend, preparedBodyCell);
  console.log(link);
  qrcode.generate(link, { small: true }, (code) => {
    console.log(code);
  });
};

main();
