import { Address, Cell, contractAddress, StateInit, toNano } from "ton";
import {
  VXTCollectionCodeCell,
  VXTItemCodeCell,
} from "./VXT.source";
import qrcode from "qrcode-terminal";
import { buildNftCollectionDataCell } from "./VXTUtils";
import qs from "qs";

// CONFIG CONSTANTS

const MODE: "test" | "main" = "test";

const OWNER_ADDRESS = Address.parse(
  "EQALSQCRSAdi1bvetHnmhRCmli9jk8QBP-hVkW9j3nq6P09G"
);

// ------------------------

const main = async () => {
  const collectionCode = VXTCollectionCodeCell;
  const itemCode = VXTItemCodeCell;

  const defaultConfig = {
    ownerAddress: OWNER_ADDRESS,
    nextItemIndex: 0,
    collectionContent:
      "https://gateway.pinata.cloud/ipfs/QmeuDuwFnJTi1j5QXFVAqqm8mhZGxnBYD2bwDix6XD63cw",
    commonContent: "",
    nftItemCode: itemCode,
    royaltyParams: {
      royaltyFactor: 100,
      royaltyBase: 200,
      royaltyAddress: OWNER_ADDRESS,
    },
  };

  let data = buildNftCollectionDataCell(defaultConfig);

  const address = contractAddress({
    workchain: 0,
    initialCode: collectionCode,
    initialData: data,
  });

  // Prepare init message
  const initCell = new Cell();
  new StateInit({
    code: collectionCode,
    data: data,
  }).writeTo(initCell);

  // Encode link to deploy contract
  let link =
    `https://${MODE === "test" ? "test." : ""}tonhub.com/transfer/` +
    address.toFriendly({ testOnly: true }) +
    "?" +
    qs.stringify({
      text: "Deploy contract",
      amount: toNano(1).toString(10),
      init: initCell.toBoc({ idx: false }).toString("base64"),
    });
  console.log(link)
  console.log("Address: " + address.toFriendly({ testOnly: true }));
  qrcode.generate(link, { small: true }, (code) => {
    console.log(code);
  });
};

main();
