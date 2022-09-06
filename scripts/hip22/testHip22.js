const { ethers } = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");

const someRandomAddressWithMoney = "0xc80890ec72acb291bde13c448c54582e0bf3b688"; 
const ubiContractAddress = "0xDd1Ad9A21Ce722C151A836373baBe42c868cE9a4";
const adminProxyAddress = "0x2b59500ad441bf5accf8ff89449552b6487132e0";
const pohGovernorAddress = "0x327a29fce0a6490e4236240be176daa282eccfdf";
const ubiGovernorAddress = "0x7510c77163683448b8Dc8fe9e019d9482Be1ed2b";

async function main() {
    const provider = ethers.provider;
    console.log(`the last block timestamp is ${(await provider.getBlock("latest")).timestamp}`);
    // I impersonate an account with money because I need to put the deposit for the governor
    const account = await impersonateAddress(someRandomAddressWithMoney);
    const ubiContract = await getUBIContract(account);
    const adminProxyContract = await getAdminProxy(account);
    const pohGovernorContract = await getPoHGovernorContract(account);
    const ubiGovernorContract = await getUBIGovernorContract(account);
    // I log the initial state
    console.log(`The admin proxy has the owner: ${await adminProxyContract.owner()}`)
    console.log(`The ubi contract has the governor: ${await ubiContract.governor()}`)
    let pohGovernorUBIAmount = await ubiContract.balanceOf(pohGovernorContract.address);
    let ubiGovernorUBIAmount = await ubiContract.balanceOf(ubiGovernorContract.address);
    console.log(`The poh governor contract ${pohGovernorContract.address} has ${pohGovernorUBIAmount}` )
    console.log(`The ubi governor contract ${ubiGovernorContract.address} has ${ubiGovernorUBIAmount}` )
    // Start the governor tx
    let currentSessionNumber = await pohGovernorContract.getCurrentSessionNumber()
    console.log(`The Governor getCurrentSessionNumber is ${currentSessionNumber}`)
    // I do this in order to clean the session. Without this, the submitList call will fail.
    await pohGovernorContract.executeSubmissions(); 
    console.log(`---------------------`)
    console.log(`executeSubmissions executed OK`)
    console.log(`---------------------`)

    // I submit the list
    const opts = {value: ethers.utils.parseEther("4.46")}
    await pohGovernorContract.submitList(
        ['0xDd1Ad9A21Ce722C151A836373baBe42c868cE9a4','0xDd1Ad9A21Ce722C151A836373baBe42c868cE9a4','0x2b59500ad441bf5accf8ff89449552b6487132e0',], // address[] target
        [0,0,0], //uint[] value
        '0xe4c0aaf40000000000000000000000007510c77163683448b8Dc8fe9e019d9482Be1ed2ba9059cbb0000000000000000000000007510c77163683448b8dc8fe9e019d9482be1ed2b00000000000000000000000000000000000000000001a784379d99db42000000f2fde38b0000000000000000000000007510c77163683448b8dc8fe9e019d9482be1ed2b', //bytes data
        ['36','68','36'], //uint[] datasize
        'Testing1',
        opts
        );
    console.log(`---------------------`)
    console.log(`submitList executed OK`)
    console.log(`---------------------`)
    const submissionTimeout = await pohGovernorContract.submissionTimeout();
    const lastApprovalTime = await pohGovernorContract.lastApprovalTime();
    console.log(`The base timeout for every submission is ${submissionTimeout}`);
    console.log(`The last approval is ${lastApprovalTime}`);
    // 8 days in the future so the window time for challenges is closed.
    const approvalTimeInFuture = parseInt(lastApprovalTime) + 726400; 
    console.log(`The next block timestamp will be ${approvalTimeInFuture}`);
    // I simulate the passing of time
    await provider.send("evm_setNextBlockTimestamp",[approvalTimeInFuture]);
    await provider.send("evm_mine");
    console.log(`The last block timestamp is ${(await provider.getBlock("latest")).timestamp}`);

    // I execute the submission approved
    await pohGovernorContract.executeSubmissions(); 
    console.log(`---------------------`)
    console.log(`executeSubmissions executed OK`)
    console.log(`---------------------`)
        
    // I finally execute the desired transactions
    await pohGovernorContract.executeTransactionList(7, 0, 0);
    console.log(`---------------------`)
    console.log(`executeTransactionList executed. The transaction info data ${await pohGovernorContract.getTransactionInfo(7, 0)}`)
    console.log(`The Admin proxy has the owner: ${await adminProxyContract.owner()}`)
    console.log(`The UBI contract has the governor: ${await ubiContract.governor()}`)
    pohGovernorUBIAmount = await ubiContract.balanceOf(pohGovernorContract.address);
    ubiGovernorUBIAmount = await ubiContract.balanceOf(ubiGovernorContract.address);
    console.log(`The poh governor contract ${pohGovernorContract.address} has ${pohGovernorUBIAmount}` )
    console.log(`The ubi governor contract ${ubiGovernorContract.address} has ${ubiGovernorUBIAmount}` )
    console.log(`---------------------`)
    
}

async function getAdminProxy(account) {
    return await ethers.getContractAt("ProxyAdmin", adminProxyAddress, account);
}

async function getUBIContract(account) {
    return await ethers.getContractAt("UBI", ubiContractAddress, account);
}

async function getPoHGovernorContract(account) {
    return await ethers.getContractAt("KlerosGovernor", pohGovernorAddress, account);
}

async function getUBIGovernorContract(account) {
    return await ethers.getContractAt("KlerosGovernor", ubiGovernorAddress, account);
}

async function impersonateAddress(address) {
    await helpers.impersonateAccount(address);
    return await ethers.getSigner(address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })