// メタマスクがインストールされているかのチェック
if (typeof web3 !== "undefined") {
    web3js = new Web3(web3.currentProvider);
} else {
    alert("MetaMaskをインストールして下さい．");
}
    
// コントラクトを呼び出すアカウントのアドレス
web3js.eth.getAccounts(function(err, accounts) {
    coinbase = accounts[0];
    console.log("coinbase is " + coinbase);
    if (typeof coinbase === "undefined") {
        alert("MetaMaskを起動してください．")
    }
});

// コントラクトのアドレス
// const address = "0xe0a5d61f329ca84c5a8e8d59130d7fe8c0a388f4"; // ver1.0
const address = "0xb54de6280f9b11fe39cd18a77446837d3aedb883";

// コントラクトのインスタンスを生成
contract = new web3js.eth.Contract(abi, address);