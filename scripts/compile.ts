import { writeFile } from "fs/promises";
import path from "path";
import { Cell } from "ton";
import {
  VXTCollection,
  VXTItem,
} from "../src/VXT.source";
import { compileFunc } from "../src/utils/compileFunc";

const buildCollectionSourceContent = (collection: Cell, item: Cell) => `
import { Cell } from "ton";
import { combineFunc } from "./utils/combineFunc";

export const VXTCollection = () => {
  return combineFunc(__dirname, [
    "./contract/stdlib.fc",
    "./contract/params.fc",
    "./contract/op-codes.fc",
    "./contract/nft-collection.fc",
  ]);
};

const VXTCollectionCodeBoc =
  '${collection.toBoc().toString("base64")}'

export const VXTCollectionCodeCell = Cell.fromBoc(
  Buffer.from(VXTCollectionCodeBoc, "base64")
)[0];

export const VXTItem = () => {
  return combineFunc(__dirname, [
    "./contract/stdlib.fc",
    "./contract/params.fc",
    "./contract/op-codes.fc",
    "./contract/sbt-item.fc",
  ]);
};

const VXTItemCodeBoc =
  '${item.toBoc().toString("base64")}'

export const VXTItemCodeCell = Cell.fromBoc(
  Buffer.from(VXTItemCodeBoc, "base64")
)[0];
`;

async function main() {
  let collectionSource = await compileFunc(VXTCollection());
  let itemSource = await compileFunc(VXTItem());

  await writeFile(
    path.resolve(__dirname, "../src/VXT.source.ts"),
    buildCollectionSourceContent(collectionSource.cell, itemSource.cell)
  );
}

main();
