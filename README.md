# Ubi Governor Testing (Mainnet fork + Kleros Governor)

I've created this repo with a simple script to check if [this proposal](https://gov.proofofhumanity.id/t/execution-hip-22-finalize-split-of-ubi-dao-from-poh-dao/2373) will work fine.

In [the hip22 README.md](scripts/hip22/README.md) you have the outputs for each transaction execution. 

You can check each transaction isolated:

- Change admin of the UBI ERC20 proxy with the UBI DAO Governor --> `scripts/hip22/testTransferOwnership.js`
- Change Governor of UBI ERC20 from the PoH Governor to the UBI Governor --> `scripts/hip22/testChangeGovernor.js`
- Transfer 2M UBI to the UBI DAO Governor - Transfer --> `scripts/hip22/testTransferFunds.js`

Or try it all together (most real):

- Hip 22 --> `scripts/hip22/testHip22.js`

The right order for executing all together is: (1) changeGovernor (2) transfer funds (3) transferOwnership

I've pinned the block `15480189` of Ethereum Mainnet so everyone can reproduce the exact test. For other purposes, you may have to change some hardcoded things on the script and the block itself in `hardhat.config.js`.

## Usage
First of all, you'll need to install [hardhat](https://hardhat.org/hardhat-runner/docs/getting-started#overview). Then, return to this folder.

- Run `npm i --force` (idk why the f* doesn't work without the --force)
- Then, configure your `MAINNET_RPC_URL` in `hardhat.config.js`. Check the Hardhat [documentation about forking](https://hardhat.org/hardhat-network/docs/guides/forking-other-networks#forking-from-mainnet). I use [alchemy](https://alchemyapi.io/)
- Run `npx hardhat run <path_to_script>` and check if everything it's ok
