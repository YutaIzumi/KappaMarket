// アカウント情報を表示する
var keyList = ["名前", "Eメールアドレス", "取引回数", "評価", "出品回数", "購入回数"];
var idxList = [0, 1, 2, 3, 5, 6];

function showAccount() {
    var address = document.getElementById("address").value;

    contract.methods.accounts(address).call().then(function(account) {
        for (var i = 0; i < idxList.length; i++) {
            var elem = document.createElement("p");
            elem.textContent = keyList[i] + " : " + account[idxList[i]];
            document.getElementById("account").appendChild(elem);
        }
    });
}