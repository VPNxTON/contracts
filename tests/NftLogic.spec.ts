import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { NftLogic } from '../wrappers/NftLogic';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('NftLogic', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('NftLogic');
    });

    let blockchain: Blockchain;
    let nftLogic: SandboxContract<NftLogic>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        nftLogic = blockchain.openContract(NftLogic.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await nftLogic.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: nftLogic.address,
            deploy: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and nftLogic are ready to use
    });
});
