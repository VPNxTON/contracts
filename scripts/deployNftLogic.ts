import { toNano } from 'ton-core';
import { NftLogic } from '../wrappers/NftLogic';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const nftLogic = provider.open(NftLogic.createFromConfig({}, await compile('NftLogic')));

    await nftLogic.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(nftLogic.address);

    // run methods on `nftLogic`
}
