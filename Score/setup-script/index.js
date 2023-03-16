
const IconService = require('icon-sdk-js').default
const fetch = require("node-fetch");

global.fetch = fetch
const IconConverter = IconService.IconConverter

const httpProvider = new IconService.HttpProvider('https://berlin.net.solidwallet.io/api/v3');
const iconService = new IconService(httpProvider);
const wallet = IconService.IconWallet.loadKeystore() 
const txObj = new IconService.IconBuilder.CallTransactionBuilder()
    .from('hx674f1ad69153bbcd6ff2302b9ed0d010f7ed3603')
    .to('cx32e9983c22c81fbf05bea804e5ab5d8d8912f4e3')
    .stepLimit(IconConverter.toBigNumber('2000000'))
    .nid(IconConverter.toBigNumber('7'))
    .nonce(IconConverter.toBigNumber('1'))
    .version(IconConverter.toBigNumber('3'))
    .timestamp((new Date()).getTime() * 1000)
    .method('setAssetAddress')
    .params({
        assetContract: 'cx804dc7c991ba0d9483aa0ffd175ed8a32a3ab382',
    })
    .build()
const signature = new IconService.SignedTransaction(txObj, wallet)

iconService.sendTransaction(signature).execute().then((tx)=>console.log(tx)).catch(e=>console.error(e));