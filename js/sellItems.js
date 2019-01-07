var _numSell;  // 購入した商品数
var _sellItem; // 購入した商品番号
var col;      // スクリーンサイズに応じて表示する列数を変更する
var threshold = 750; // スクリーンサイズの閾値

// スクリーンサイズによって表示方法を変更する
if (screen.width > threshold) {
    col = 2.0;
} else {
    col = 1.0;
}

// メタマスクがインストールされているかチェックする
if (typeof web3 !== "undefined") {
    web3js = new Web3(web3.currentProvider);
} else {
    alert("MetaMaskをインストールして下さい．");
}

// コントラクトのアドレス
// const address = "0xe0a5d61f329ca84c5a8e8d59130d7fe8c0a388f4"; // ver.1.0
// const address = "0xb54de6280f9b11fe39cd18a77446837d3aedb883"; // ver.2.0
const address = "0x712fa6150b41798cb96f5d117e0954407750e335"; // ver.3.0

// コントラクトのインスタンスを生成する
contract = new web3js.eth.Contract(abi, address);

// コントラクトを呼び出すアカウントのアドレスを取得する
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
    
    // DOMを生成する
    }).then(function() {
        var rows=[];
        var table = document.getElementById("table");
        for (i = 0; i < _numSell; i++) {
            rows.push(table.insertRow(-1)); // 行の追加
            for (j = 0; j < col; j++) {
                cell = rows[i].insertCell(-1); // セルの追加

                if (col == 2) {
                    // 1列目の表示内容
                    if (j == 0) {
                        // 商品の説明と画像を表示するDOMを作成する
                        var image = document.createElement("a");
                        var description = document.createElement("div");
                        
                        image.id = "image" + i;
                        description.id = "description" + i;
                        cell.appendChild(image);
                        cell.appendChild(description);
                    
                    } else {
                        // 取引の状態を表示するDOMを作成する
                        var state = document.createElement("div");
                        
                        state.id = "state" + i;
                        cell.appendChild(state);
                        
                        // 取引を進めるボタンを作成する
                        var shipment = document.createElement("p");
                        var btn = document.createElement("button");

                        btn.id = "shipment" + i;
                        btn.textContent = "発送連絡";
                        btn.setAttribute("class", "btn btn-primary");
                        shipment.appendChild(btn);
                        cell.appendChild(shipment);
                        
                        var buyerEvaluate = document.createElement("p");
                        var btn = document.createElement("button");

                        btn.id = "buyerEvaluate" + i;
                        btn.textContent = "購入者を評価";
                        btn.setAttribute("class", "btn btn-primary");
                        
                        // 評価を選択するセレクトフォームを作成する
                        var form = document.createElement("div");
                        form.setAttribute("class", "form-group");

                        var label = document.createElement("label");
                        label.textContent = "評価を選択して下さい";
                        label.setAttribute("for", "buyerValue" + i);

                        var select = document.createElement("select");
                        select.setAttribute("multiple", "");
                        select.setAttribute("class", "form-control");
                        select.id = "buyerValue" + i;
                        
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
                        
                        // 例外処理を行うボタンを作成する
                        var sellerStop = document.createElement("p");
                        var btn = document.createElement("button");

                        btn.id = "sellerStop" + i;
                        btn.textContent = "出品取消し";
                        btn.setAttribute("class", "btn btn-primary");
                        sellerStop.appendChild(btn);
                        cell.appendChild(sellerStop);

                        var refund = document.createElement("p");
                        var btn = document.createElement("button");

                        btn.id = "refund" + i;
                        btn.textContent = "返金する";
                        btn.setAttribute("class", "btn btn-primary");
                        refund.appendChild(btn);
                        cell.appendChild(refund);
                    }

                } else {
                    // 商品の説明と画像を表示するDOMを作成
                    var image = document.createElement("a");
                    var image_div = document.createElement("div");
                    var description = document.createElement("div");
                    
                    image.id = "image" + i;
                    image_div.align = "center";
                    description.id = "description" + i;
                    image_div.appendChild(image);
                    cell.appendChild(image_div);
                    cell.appendChild(description);

                    // 取引の状態を表示するDOMを作成
                    var state = document.createElement("div");
                        
                    state.id = "state" + i;
                    cell.appendChild(state);
                    
                    // 取引を進めるボタンを作成する
                    var shipment = document.createElement("p");
                    var btn = document.createElement("button");

                    btn.id = "shipment" + i;
                    btn.textContent = "発送連絡";
                    btn.setAttribute("class", "btn btn-primary");
                    shipment.appendChild(btn);
                    cell.appendChild(shipment);
                    
                    var buyerEvaluate = document.createElement("p");
                    var btn = document.createElement("button");

                    btn.id = "buyerEvaluate" + i;
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
                    select.id = "buyerValue" + i;
                    
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
                    
                    // 例外処理を行うボタンを作成する
                    var sellerStop = document.createElement("p");
                    var btn = document.createElement("button");

                    btn.id = "sellerStop" + i;
                    btn.textContent = "出品取消し";
                    btn.setAttribute("class", "btn btn-primary");
                    sellerStop.appendChild(btn);
                    cell.appendChild(sellerStop);

                    var refund = document.createElement("p");
                    var btn = document.createElement("button");

                    btn.id = "refund" + i;
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

// 商品情報を表示する関数
function showItem(numItem, idx) {
    // numItem：商品番号，idx：DOMのインデックス
    // 商品説明
    itemKeyList = ["商品名", "価格(wei)", "商品説明", "状態", "出品者", "出品者のアドレス", "購入者のアドレス"];
    itemIdxList = [3, 5, 4, 11, 2, 0, 1];
    contract.methods.items(numItem).call().then(function(item) {
        for (var i = 0; i < itemIdxList.length; i++) {
            var elem = document.createElement("p");
            // 出品状態
            if (i == 3) {
                if (item[itemIdxList[i]] == true) {
                    elem.textContent = itemKeyList[i] + " : 売切れ";
                } else {
                    elem.textContent = itemKeyList[i] + " : 出品中";
                }
                document.getElementById("description" + idx).appendChild(elem);
            // その他の商品情報
            } else {
                elem.textContent = itemKeyList[i] + " : " + item[itemIdxList[i]];
                document.getElementById("description" + idx).appendChild(elem);
            }
            // 価格
            if (i == 1) {
                price = item[itemIdxList[i]];
            }
        }
    });
    
    // 商品画像
    contract.methods.images(numItem).call().then(function(image) {
        // imageUrl = "http://localhost:8080/ipfs/" + image.ipfsHash; // ipfsがインストールされている場合
        // imageUrl = "https://ipfs.io/ipfs/" + image.ipfsHash; // ipfs.io経由，動作しない？
        imageUrl = "http://drive.google.com/uc?export=view&id=" + image.googleDocID; // googleDriveを使用する場合
        
        // 生成する要素と属性
        var img = document.createElement("img");
        img.id = "ipfsImage" + idx;
        img.src = imageUrl;
        img.alt = "ipfsImage" + idx;
        
        // 画像の読込みを待ってから画像を加工
        img.addEventListener("load", function() {
            var orgWidth  = img.width;
            var orgHeight = img.height;
            
            // img.width = 300;
            // img.height = 168;
            // img.height = orgHeight * (img.width / orgWidth); // 高さを横幅の変化割合に合わせる

            if (screen.width < threshold) {
                img.width = screen.width * 0.85;
                img.height = orgHeight * (img.width / orgWidth); // 高さを横幅の変化割合に合わせる
            } else {
                img.height = 200;
                img.width = orgWidth * (img.height / orgHeight); // 横幅を高さの変化割合に合わせる
            }
            img.style.borderRadius = "10px";
            
            document.getElementById("image" + idx).appendChild(img);
        });
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

// 出品を取消する関数
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

// 返金する関数
function refund(numItem) {
    return contract.methods.refundFromSeller(numItem)
    .send({ from: coinbase })
    .on("receipt", function(receipt) {
        console.log("success");
    })
    .on("error", function(error) {
            console.log("error"); 
    });
}