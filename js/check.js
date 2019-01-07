// メタマスクがインストールされているかのチェックする
if (typeof web3 !== "undefined") {
    web3js = new Web3(web3.currentProvider);
} else {
    alert("MetaMaskをインストールして下さい．");
}
    
// コントラクトを呼び出すアカウントのアドレスを取得する
web3js.eth.getAccounts(function(err, accounts) {
    coinbase = accounts[0];
    console.log("coinbase is " + coinbase);
    if (typeof coinbase === "undefined") {
        alert("MetaMaskを起動してください．")
    }
});

// コントラクトのアドレス
// コントラクトのアドレス
// const address = "0xe0a5d61f329ca84c5a8e8d59130d7fe8c0a388f4"; // ver.1.0
// const address = "0xb54de6280f9b11fe39cd18a77446837d3aedb883"; // ver.2.0
const address = "0x712fa6150b41798cb96f5d117e0954407750e335"; // ver.3.0

// コントラクトのインスタンスを生成する
contract = new web3js.eth.Contract(abi, address);