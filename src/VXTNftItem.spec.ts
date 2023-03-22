import { Address, Cell } from "ton";
import { NftCollectionData } from "./VXNNftCollection.data";

import { VXNNftLocal } from "./VXTNftLocal";




const OWNER_ADDRESS = Address.parse(
    "EQALSQCRSAdi1bvetHnmhRCmli9jk8QBP-hVkW9j3nq6P09G"
  );
  
  const defaultConfig: NftCollectionData = {
    ownerAddress: OWNER_ADDRESS,
    nextItemIndex: 777,
    collectionContent: 'collection_content',
    commonContent: 'common_content',
    nftItemCode: new Cell(),
    royaltyParams: {
        royaltyFactor: 100,
        royaltyBase: 200,
        royaltyAddress:OWNER_ADDRESS
    }
}


it('should return collection data', async () => {
  let collection = await VXNNftLocal.createFromConfig(defaultConfig)

  let res = await collection.getCollectionData()

  expect(res.nextItemId).toEqual(defaultConfig.nextItemIndex)
  expect(res.collectionContent).toEqual(defaultConfig.collectionContent)
  expect(res.ownerAddress.toFriendly()).toEqual(defaultConfig.ownerAddress.toFriendly())
})