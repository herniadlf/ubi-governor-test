# Ubi Governor Testing (Mainnet fork + Kleros Governor)

I've created this repo with a simple script to check if [this proposal](https://gov.proofofhumanity.id/t/execution-hip-22-finalize-split-of-ubi-dao-from-poh-dao/2373) will work fine, specially the ticket for:

``` 
"Title: HIP 22 Change Governor of UBI ERC20 from the PoH Governor to the UBI Governor"
```

You can see the `scripts/testGovernorTransaction.js` for more details. 

I've pinned the block `15480189` of Ethereum Mainnet so everyone can reproduce the exact test. For other purposes, you may have to change some hardcoded things on the script and the block itself in `hardhat.config.js`.

## Usage
First of all, you'll need to install hardhat (https://hardhat.org/hardhat-runner/docs/getting-started#overview). Then, return to this folder.

- Run `npm i --force` (idk why the f* doesn't work without the --force)
- Then, configure your `MAINNET_RPC_URL` in `hardhat.config.js`. Check the Hardhat [documentation about forking](https://hardhat.org/hardhat-network/docs/guides/forking-other-networks#forking-from-mainnet). I use [alchemy](https://alchemyapi.io/)
- Run `npx hardhat run scripts/testGovernorTransaction.js` and check if everything it's ok
