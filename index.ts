/* import dotenv from "dotenv";
dotenv.config({ path: "/.env" }); */

import {Address, TonClient} from "ton";
import {unixNow} from '../contracts/contracts/lib/utils';
import {MineMessageParams, Queries} from "../contracts/contracts/giver/NftGiver.data";
import {BN} from 'bn.js';

async function main () {

// everything test net for now, .env config would be created later 
  const wallet = Address.parse(
    "kQCkB8cE4Yf1Y8HRkR-BcrMgj6ysce-YOnz6bIuNn0dZrLRN"
    ); //owner address 
  const collection = Address.parse(
    "EQDMyD57dbDgxbu7PQqJJuJCxoeU-advQpBjOgM48YY3vxxO"
    ); //where do we add them  

  const client = new TonClient({
  endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
  apiKey: "7af1a809e91c0df4d3969230e3a50dc58907637d069d8ca358838cc69dfeddde",
});
const miningData = await client.runMethod(collection, 'get_mining_data');

const parseStackNum = (sn: any) => new BN(sn[1].substring(2), 'hex');




const complexity = parseStackNum(miningData.stack[0]);

const mineParams : MineMessageParams = {
  expire: unixNow() + 300, // 5 min is enough to make a transaction
  mintTo: wallet, // your wallet
  data1: new BN(0), // temp variable to increment in the miner
  seed:new BN(0) // unique seed from get_mining_data - how to initialize 
};

let msg = Queries.mine(mineParams); // transaction builder

  while (new BN(msg.hash(), 'be').gt(complexity)) {
    mineParams.expire = unixNow() + 300
    mineParams.data1.iaddn(1)
    msg = Queries.mine(mineParams)
  }

  let progress = 0;

  while (new BN(msg.hash(), 'be').gt(complexity)) {
    progress += 1
    console.clear()
    console.log(`Mining started: please, wait for 30-60 seconds to mine your NFT!`)
    console.log(' ')
    console.log(`⛏ Mined ${progress} hashes! Last: `, new BN(msg.hash(), 'be').toString())

    mineParams.expire = unixNow() + 300
    mineParams.data1.iaddn(1)
    msg = Queries.mine(mineParams)
  }

  console.log(' ')
  console.log('💎 Mission completed: msg_hash less than pow_complexity found!');
  console.log(' ')
  console.log('msg_hash: ', new BN(msg.hash(), 'be').toString())
  console.log('pow_complexity: ', complexity.toString())
  console.log('msg_hash < pow_complexity: ', new BN(msg.hash(), 'be').lt(complexity))

}
main()
