const IconService = window['icon-sdk-js'];
const httpProvider = new IconService.HttpProvider('https://berlin.net.solidwallet.io/api/v3');
const iconService = new IconService(httpProvider);
const IconConverter = IconService.IconConverter
const mainGame = "cx32e9983c22c81fbf05bea804e5ab5d8d8912f4e3"
const asset = "cx804dc7c991ba0d9483aa0ffd175ed8a32a3ab382"

const connectWallet = () => {
  return new Promise((resolve, reject) => {
      if (window) {
          const customEvent = new CustomEvent('ICONEX_RELAY_REQUEST', {
              detail: {
                type: 'REQUEST_ADDRESS',
              },
          });
          window.dispatchEvent(customEvent);
          const eventHandler = (event) => {
              const { type, payload } = event?.detail;
              if (type === 'RESPONSE_ADDRESS') {
                  resolve(payload)
              }
              window.removeEventListener('ICONEX_RELAY_RESPONSE', eventHandler)
          };
          window.addEventListener('ICONEX_RELAY_RESPONSE', eventHandler);
      }else{
          reject()
      }
  })
};


const is_game_started = async () => {
    const txObj = new IconService.IconBuilder.CallBuilder().to(mainGame).method('isGameStarted').params({ owner: window.accounts}).build()
    const result = await iconService.call(txObj).execute();
    if(result==1){
      return false
    }
    return true
};

window.connect = async function () {
  const wallet = await connectWallet()
  window.accounts = wallet
 
  myGameInstance.SendMessage("RTS_Camera", "onConnect");
  if (await is_game_started()) {
    window.userdata()
  } else {
    myGameInstance.SendMessage('RTS_Camera','onNewUser');
  }
};

window.openMarketPlace = () => {
  window.open("https://dempire-market.b-cdn.net/");
};

window.startgame = async function () {
  const txObj = new IconService.IconBuilder.CallTransactionBuilder()
    .from(window.accounts)
    .to(mainGame)
    .stepLimit(IconConverter.toBigNumber('2000000'))
    .nid(IconConverter.toBigNumber('7'))
    .nonce(IconConverter.toBigNumber('1'))
    .version(IconConverter.toBigNumber('3'))
    .timestamp((new Date()).getTime() * 1000)
    .method('startGame')
    .build()
  
  const transaction = {
      jsonrpc: '2.0',
      method: 'icx_sendTransaction',
      params: IconService.IconConverter.toRawTransaction(txObj),
      id: 1001
  };

  const customEvent = new CustomEvent('ICONEX_RELAY_REQUEST', {
    detail: {
      type: 'REQUEST_JSON-RPC',
      payload: transaction
    }
  });
  window.dispatchEvent(customEvent);
    
  const eventHandler = event => {
    const { type, payload } = event.detail;
    if (type === 'RESPONSE_JSON-RPC') {
      if(payload.id==1001){
        window.userdata()
        window.removeEventListener('ICONEX_RELAY_RESPONSE', eventHandler)
      }
    }
  }
  window.addEventListener('ICONEX_RELAY_RESPONSE', eventHandler);
  
};

let graphkey = {
  0: "townhall",
  1: "miner",
  2: "cannon",
  3: "xbow",
  4: "tesla",
  5: "archer",
  6: "robot",
  7: "valkyriee",
};
const keys = Object.keys(graphkey);
keys.forEach((item, i) => {
  window[graphkey[item]] = 0;
});

window.collectwin = async function (buildingamount) {
  buildingamount = parseInt(buildingamount)
  console.log(buildingamount)
  if(buildingamount<=0){
    myGameInstance.SendMessage("Button_AD", "showData");
    return
  }
  const txObj = new IconService.IconBuilder.CallTransactionBuilder()
  .from(window.accounts)
  .to(mainGame)
  .stepLimit(IconConverter.toBigNumber('2000000000'))
  .nid(IconConverter.toBigNumber('7'))
  .nonce(IconConverter.toBigNumber('1'))
  .version(IconConverter.toBigNumber('3'))
  .timestamp((new Date()).getTime() * 1000)
  .method('reward')
  .params({
    buildings: buildingamount.toString()
  })
  .build()
  const transaction = {
    jsonrpc: '2.0',
    method: 'icx_sendTransaction',
    params: IconService.IconConverter.toRawTransaction(txObj),
    id: 1003
  };

  const customEvent = new CustomEvent('ICONEX_RELAY_REQUEST', {
    detail: {
      type: 'REQUEST_JSON-RPC',
      payload: transaction
    }
  });
  window.dispatchEvent(customEvent);
  
  const eventHandler = event => {
    const { type, payload } = event.detail;
    if (type === 'RESPONSE_JSON-RPC') {
      if(payload.id==1003){
        console.log(payload)
        myGameInstance.SendMessage("Button_AD", "showData");
        window.removeEventListener('ICONEX_RELAY_RESPONSE', eventHandler)
      }
    }
  }
  window.addEventListener('ICONEX_RELAY_RESPONSE', eventHandler);
 
};





window.savegame = async function (str) {
  const txObj = new IconService.IconBuilder.CallTransactionBuilder()
  .from(window.accounts)
  .to(mainGame)
  .stepLimit(IconConverter.toBigNumber('20000000000'))
  .nid(IconConverter.toBigNumber('7'))
  .nonce(IconConverter.toBigNumber('1'))
  .version(IconConverter.toBigNumber('3'))
  .timestamp((new Date()).getTime() * 1000)
  .method('saveGame')
  .params({
    data: str
  })
  .build()
  const transaction = {
    jsonrpc: '2.0',
    method: 'icx_sendTransaction',
    params: IconService.IconConverter.toRawTransaction(txObj),
    id: 1002
  };

  const customEvent = new CustomEvent('ICONEX_RELAY_REQUEST', {
    detail: {
      type: 'REQUEST_JSON-RPC',
      payload: transaction
    }
  });
  window.dispatchEvent(customEvent);
  
  const eventHandler = event => {
    const { type, payload } = event.detail;
    if (type === 'RESPONSE_JSON-RPC') {
      if(payload.id==1002){
        console.log(payload)
        myGameInstance.SendMessage("syncButton", "onSave");
        window.removeEventListener('ICONEX_RELAY_RESPONSE', eventHandler)
      }
    }
  }
  window.addEventListener('ICONEX_RELAY_RESPONSE', eventHandler);
};


function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}


window.fetchWar = async function () {
  const txObj = new IconService.IconBuilder.CallBuilder().to(mainGame).method('getNextPlayer').build()
  const result = await iconService.call(txObj).execute();
  const target = randomIntFromInterval(0, parseInt(result)-1)
  console.log(target)
  const txObj1 = new IconService.IconBuilder.CallBuilder().to(mainGame).method('getEmpireByID').params({ id: IconConverter.toBigNumber(target)}).build()
  const result1 = await iconService.call(txObj1).execute();
  myGameInstance.SendMessage("WarManager", "onWarData", result1);
}

const getAurues = async () =>{
  const txObj = new IconService.IconBuilder.CallBuilder().to(mainGame).method('balanceOf').params({ _owner: window.accounts}).build()
  const result = await iconService.call(txObj).execute();
  return result
}

const getAssetData = async () =>{
  const txObj = new IconService.IconBuilder.CallBuilder().to(asset).method('getAssets').params({ owner: window.accounts}).build()
  const result = await iconService.call(txObj).execute();
  return  result
}

const getBuildingsdata = async ()=>{
  const txObj = new IconService.IconBuilder.CallBuilder().to(mainGame).method('getEmpire').params({ owner: window.accounts}).build()
  const result = await iconService.call(txObj).execute();
  return  result
}

window.userdata = async function () {

  window.aureus = parseInt(await getAurues())
  const assetData = await getAssetData()
  window.townhall = parseInt(assetData[4])
  window.miner = parseInt(assetData[0])
  window.cannon = parseInt(assetData[1])
  window.xbow = parseInt(assetData[2])
  window.tesla = parseInt(assetData[3])
  window.archer = parseInt(assetData[5])
  window.robot = parseInt(assetData[6])
  window.valkyriee = parseInt(assetData[7])
  window.building_data = await getBuildingsdata()
  myGameInstance.SendMessage("RTS_Camera", "onDone");
};
