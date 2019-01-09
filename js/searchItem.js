var _numItems;    // 出品されている商品数
var itemIdx = {}; // 全ての商品名と商品番号を記録する連想配列
var col;          // 商品一覧表示の列数

// URLパラメータから表示する商品番号を抽出する
var searchedItems = window.location.search.substring(1,window.location.search.length);
searchedItems = searchedItems.split(',');
console.log("search item idx : " + searchedItems);

if (searchedItems == "") {
    window.onload = function() {
        console.log("nothing");
        message = document.createElement("h3");
        message.textContent = "お探しの商品は見つかりませんでした．";
        message.style.textAlign = "center";
        document.body.appendChild(message);

        // 出品されている商品数を取得する
        contract.methods.numItems().call()
        .then(function(numItems) {
            _numItems = numItems;
            console.log("numItems is " + _numItems);

        // 全ての商品名と商品番号を記録する
        }).then(function() {
            for (idx = 0; idx < _numItems; idx++) {
                getItemIdx(idx);
            }
        });
    }

} else {
    window.onload = function() {
        // スクリーンサイズによって商品一覧表示の列数を変更する
        if (screen.width > 900) {
            col = 3.0;
        } else if (screen.width < 900 && screen.width > 600) {
            col = 2.0;
        } else {
            col = 1.0;
        }
        
        // DOMを作成する
        var rows = [];
        var table = document.getElementById("table");
        var row = Math.ceil(searchedItems.length / col);
        var k = 0;
        for (i = 0; i < row; i++) {
            rows.push(table.insertRow(-1)); // 行の追加
            for (j = 0; j < col; j++) {
                cell = rows[i].insertCell(-1);

                if (i < searchedItems.length) {
                    idx = Number(searchedItems[k]);

                    // 商品の説明と画像を表示するDOMを作成
                    var name = document.createElement("a");          // 商品名
                    var description = document.createElement("div"); // 商品説明
                    var image = document.createElement("a");         // 商品画像
                        
                    // 商品名をクリックすると商品ページに移動する
                    name.id = "name" + idx;
                    name.href = "item.html?" + idx;
                    description.id = "description" + idx;

                    // 商品画像をクリックすると商品ページに移動する
                    image.id = "image" + idx;
                    image.href = "item.html?" + idx;

                    cell.appendChild(name);
                    cell.appendChild(description);
                    cell.appendChild(image);
                    cell.style.textAlign = "center";
                    // cell.style.border = "outset";
                    // cell.style.width = "300px";
                        
                    k++;
                }
            }
        }
        // document.body.appendChild(table);
        console.log("create DOM");
        
        // DOMに商品情報を入れる
        for (var idx of searchedItems) {
            idx = Number(idx);
            showItem(idx);
        }

        // 出品されている商品数を取得する
        contract.methods.numItems().call()
        .then(function(numItems) {
            _numItems = numItems;
            console.log("numItems is " + _numItems);

        // 全ての商品名と商品番号を記録する
        }).then(function() {
            for (idx = 0; idx < _numItems; idx++) {
                getItemIdx(idx);
            }
        });
    }
}

// 商品名と商品番号を記録する関数
function getItemIdx(idx) {
    contract.methods.items(idx).call().then(function(item) {
        itemIdx[item[3]] = idx;
    });
}

// 商品情報を表示する関数
function showItem(idx) {
    console.log("showItem numItems = " + idx);

    // DOMに商品情報を入れる
    contract.methods.items(idx).call().then(function(item) {
        idxList = [3, 5, 11];
            
        for (var i of idxList) {
            if (i == 5) {
                var elem = document.createElement("p");
                // elem.textContent = item[i] + "wei";
                elem.textContent = String(Number(item[i]) / 1000000000000000000) + "eth";
                document.getElementById("description" + idx).appendChild(elem);
            
            } else if (i == 11) {
                var elem = document.createElement("p");
                if (item[i] == true) {
                    elem.setAttribute("class", "text-danger");
                    elem.textContent = "Sold Out";
                } else {
                    elem.setAttribute("class", "text-success");
                    elem.textContent = "出品中";
                }
                document.getElementById("description" + idx).appendChild(elem);
            
            } else {
                var elem = document.createElement("h6");
                elem.textContent = item[i];
                document.getElementById("name" + idx).appendChild(elem);
            }
        }
    });
        
    // 商品画像を表示する
    contract.methods.images(idx).call().then(function(image) {
        // imageUrl = "http://localhost:8080/ipfs/" + image.ipfsHash; // ipfsがインストールされている場合
        // imageUrl = "https://ipfs.io/ipfs/" + image.ipfsHash; // ipfs.io経由，動作しない？
        imageUrl = "http://drive.google.com/uc?export=view&id=" + image.googleDocID; // googleDriveを使用する場合
        
        // 生成する要素と属性
        var img = document.createElement("img");
        img.id = "ipfsImage" + idx;
        img.src = imageUrl;
        img.alt = "ipfsImage" + idx;

        // 画像の読込みを待ってから画像を加工する
        img.addEventListener("load", function() {
            // 画像のリサイズ
            var orgWidth  = img.width;
            var orgHeight = img.height;
            console.log("orgWidth " + orgWidth);
            console.log("orgHeight " + orgHeight);

            // img.width = 400; // 横幅をリサイズ
            // img.height = 0.56 * img.width;
            // img.height = orgHeight * (img.width / orgWidth); // 高さを横幅の変化割合に合わせる

            if (col == 1) {
                img.height = 150; // 縦幅をリサイズ
            }
            else {
                img.height = 170; // 縦幅をリサイズ
            }
            img.width = orgWidth * (img.height / orgHeight); // 高さを横幅の変化割合に合わせる
            img.style.borderRadius = "10px";

            // ブラウザに表示する
            flag = document.getElementById("image" + idx).appendChild(img);
            console.log(flag);
            console.log("set image " + idx);
        });
    });
}

// 商品検索を行う関数
function search() {
    var searchResult = []; // 検索ワードと一致した商品のインデックスを保存する
    searchWord = document.getElementById("searchWord").value;
    
    for (var key in itemIdx) {
        if (key.toLowerCase().indexOf(searchWord) > -1) {
            console.log(key);
            searchResult.push(itemIdx[key]);
        }
    }
    console.log(searchResult);
    return searchResult;
}

document.addEventListener("DOMContentLoaded", function(){
    var btn = document.getElementById("searchBtn");
    btn.addEventListener('click', function() {
        searchResult = search(); // 商品検索の実行
        window.location.href = "searchItem.html?" + searchResult;
    });
});