var _numSell;
var _sellItem;

// メタマスクがインストールされているかのチェック
if (typeof web3 !== "undefined") {
    web3js = new Web3(web3.currentProvider);
} else {
    alert("MetaMaskをインストールして下さい．");
}

// コントラクトのアドレス
const address = "0xe0a5d61f329ca84c5a8e8d59130d7fe8c0a388f4";

// コントラクトのインスタンスを生成
contract = new web3js.eth.Contract(abi, address);

// コントラクトを呼び出すアカウントのアドレス
web3js.eth.getAccounts(function(err, accounts) {
    coinbase = accounts[0];
    console.log("coinbase is " + coinbase);
    if (typeof coinbase === "undefined") {
        alert("MetaMaskを起動してください．")
    }

    contract.methods.accounts(coinbase).call()
    .then(function(account) {
        _numSell = account.numSell;
        console.log("numSell is " + _numSell);
    
    }).then(function() {
        // DOMの作成
        var rows=[];
        // var table = document.createElement("table");
        var table = document.getElementById("table");
        var idx = 0;
        for (i = 0; i < _numSell; i++) {
            rows.push(table.insertRow(-1)); // 行の追加
            for(j = 0; j < 2; j++) {
                cell = rows[i].insertCell(-1);

                if (j == 0) {
                    // 商品の説明と画像を表示するDOMを作成
                    var image = document.createElement("a");
                    var description = document.createElement("div");
                    image.setAttribute("id", "image" + i);
                    description.setAttribute("id", "description" + i);
                    cell.appendChild(image);
                    cell.appendChild(description);
                
                } else {
                    // 取引の状態と取引を進めるボタン表示するDOMを作成
                    var state = document.createElement("div");
                    state.setAttribute("id", "state" + i);
                    cell.appendChild(state);

                    // cell.appendChild(document.createElement("hr"));
                    
                    var shipment = document.createElement("p");
                    var btn = document.createElement("button");
                    btn.setAttribute("id", "shipment" + i);
                    btn.textContent = "発送連絡";
                    btn.setAttribute("class", "btn btn-primary");
                    shipment.appendChild(btn);
                    cell.appendChild(shipment);
                    
                    var buyerEvaluate = document.createElement("p");
                    var btn = document.createElement("button");
                    btn.setAttribute("id", "buyerEvaluate" + i);
                    btn.textContent = "購入者を評価";
                    btn.setAttribute("class", "btn btn-primary");
                    
                    // 評価を選択するセレクトフォームを作成
                    var form = document.createElement("div");
                    form.setAttribute("class", "form-group");
                    var label = document.createElement("label");
                    label.textContent = "評価を選択して下さい";
                    label.setAttribute("for", "buyerValue" + i);
                    var select = document.createElement("select");
                    select.setAttribute("multiple", "");
                    select.setAttribute("class", "form-control");
                    select.setAttribute("id", "buyerValue" + i);
                    for(value = -2; value <= 2; value++) {
                        var option = document.createElement("option");
                        option.textContent = value;
                        option.value = value;
                        select.appendChild(option);
                    }
                    form.appendChild(label);
                    form.appendChild(select);

                    buyerEvaluate.appendChild(form);
                    buyerEvaluate.appendChild(btn);
                    cell.appendChild(buyerEvaluate);
                    
                    var sellerStop = document.createElement("p");
                    var btn = document.createElement("button");
                    btn.setAttribute("id", "sellerStop" + i);
                    btn.textContent = "出品取消し";
                    btn.setAttribute("class", "btn btn-primary");
                    sellerStop.appendChild(btn);
                    cell.appendChild(sellerStop);

                    var refund = document.createElement("p");
                    var btn = document.createElement("button");
                    btn.setAttribute("id", "refund" + i);
                    btn.textContent = "返金する";
                    btn.setAttribute("class", "btn btn-primary");
                    refund.appendChild(btn);
                    cell.appendChild(refund);
                    }
                // cell.style.border = "outset";
                // cell.style.width = "500px";
            }
        }
        document.body.appendChild(table);
        console.log("create DOM");
    
    // DOMに中身を入れる
    }).then(function() {
        var idx = 0;
        for (i = 0; i < _numSell; i++) {
            contract.methods.sellItems(coinbase, i).call()
            .then(function(sellItem) {
                _sellItem = sellItem;
            
            }).then(function() {
                console.log("idx " + idx);
                console.log("_sellItem " + _sellItem);
                
                image = document.getElementById("image" + idx);
                _shipment = document.getElementById("shipment" + idx);
                _buyerEvaluate = document.getElementById("buyerEvaluate" + idx);
                _sellerStop = document.getElementById("sellerStop" + idx);
                _refund = document.getElementById("refund" + idx);

                image.href = "item.html?" + _sellItem;
                _shipment.setAttribute("onclick", "ship(" + _sellItem + ");");
                _buyerEvaluate.setAttribute("onclick", "buyerEvaluate(" + idx + "," + _sellItem + ");");
                _sellerStop.setAttribute("onclick", "sellerStop(" + _sellItem + ");");
                _refund.setAttribute("onclick", "refund(" + _sellItem + ");");
                
                showItem(_sellItem, idx);
                showState(_sellItem, idx);
                idx++;
            });
        }
    });
});

// 商品を表示する関数
function showItem(numItem, idx) {
    // 商品説明
    itemKeyList = ["商品名", "価格(wei)", "商品説明", "状態", "出品者", "出品者のアドレス", "購入者のアドレス"]
    itemIdxList = [3, 5, 4, 11, 2, 0, 1];
    contract.methods.items(numItem).call().then(function(item) {
        for (var i = 0; i < itemIdxList.length; i++) {
            var elem = document.createElement("p");
            if (i == 3) {
                if (item[itemIdxList[i]] == true) {
                    elem.textContent = itemKeyList[i] + " : 売切れ";
                } else {
                    elem.textContent = itemKeyList[i] + " : 出品中";
                }
                document.getElementById("description" + idx).appendChild(elem);
            } else {
                elem.textContent = itemKeyList[i] + " : " + item[itemIdxList[i]];
                document.getElementById("description" + idx).appendChild(elem);
            }
            if (i == 1) {
                price = item[itemIdxList[i]];
            }
        }
    });
    
    // 商品画像
    contract.methods.images(numItem).call().then(function(image) {
        // imageUrl = "http://localhost:8080/ipfs/" + image.ipfsHash; // ipfsがインストールされている場合
        imageUrl = "https://ipfs.io/ipfs/" + image.ipfsHash;
        
        // 生成する要素と属性
        var img = document.createElement("img");
        img.setAttribute("id", "ipfsImage")
        img.setAttribute("src", imageUrl);
        img.setAttribute("alt", "image");
        
        var orgWidth  = img.width;
        var orgHeight = img.height;
        img.width = 300;
        img.height = 168;
        // img.height = orgHeight * (img.width / orgWidth); // 高さを横幅の変化割合に合わせる
        
        document.getElementById("image" + idx).appendChild(img);
    });
}

// 取引の状態を表示する関数
function showState(numItem, idx) {
    stateKeyList = ["支払い", "発送", "受取", "出品者評価", "購入者評価"];
    stateIdxList = [6, 7, 8, 9, 10];
    contract.methods.items(numItem).call().then(function(item) {
        for (var i = 0; i < stateIdxList.length; i++) {
            var elem = document.createElement("p");
            if (item[stateIdxList[i]] == true) {
                elem.textContent = stateKeyList[i] + " : 済み";
                document.getElementById("state" + idx).appendChild(elem);
            } else {
                elem.textContent = stateKeyList[i] + " : 完了していません";
                document.getElementById("state" + idx).appendChild(elem);
            }
        }
    });
}

// 発送連絡する関数
function ship(numItem) {
    return contract.methods.ship(numItem)
    .send({ from: coinbase })
    .on("receipt", function(receipt) {
        console.log("success");
    })
    .on("error", function(error) {
            console.log("error"); 
    });
}

// 購入者を評価する関数
function buyerEvaluate(i, numItem) {
    var buyerValue = document.getElementById("buyerValue" + i).value;

    return contract.methods.buyerEvaluate(numItem, buyerValue)
    .send({ from: coinbase })
    .on("receipt", function(receipt) {
        console.log("success");
    })
    .on("error", function(error) {
            console.log("error"); 
    });
}

// 出品取消し
function sellerStop(numItem) {
    return contract.methods.sellerStop(numItem)
    .send({ from: coinbase })
    .on("receipt", function(receipt) {
        console.log("success");
    })
    .on("error", function(error) {
            console.log("error"); 
    });
}

// 返金する
function refund(numItem) {
    return contract.methods.sellerRefund(numItem)
    .send({ from: coinbase })
    .on("receipt", function(receipt) {
        console.log("success");
    })
    .on("error", function(error) {
            console.log("error"); 
    });
}