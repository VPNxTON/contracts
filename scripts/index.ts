import {Address, TonClient} from "ton"

async function main () {

  const wallet = Address.parse('USER_WALLET_ADDRESS'); //adress of the user
  const collection = Address.parse('COLLECTION_ADDRESS'); //where do we add them 

  const client = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: 'YOUR_API_KEY',
  })

}

