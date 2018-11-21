window.onload = function(){
    var _numItems;

    // 出品されている商品数を取得する
    contract.methods.numItems().call()
    .then(function(numItems) {
        _numItems = numItems;
        console.log("numItems is " + _numItems);
    
    // DOMの作成
    }).then(function() {
        var rows = [];
        var table = document.getElementById("table");
        var col = Math.ceil(_numItems / 3.0);
        var idx = 0;
        for (i = 0; i < col; i++) {
            rows.push(table.insertRow(-1)); // 行の追加
            for(j = 0; j < 3; j++) {
                cell = rows[i].insertCell(-1);

                if (idx < _numItems) {
                    // 商品の説明と画像を表示するDOMを作成
                    var name = document.createElement("a");          // 商品名
                    var description = document.createElement("div"); // 商品説明
                    var image = document.createElement("a");         // 商品画像
                    
                    name.id = "name" + idx;
                    name.href = "item.html?" + idx;

                    description.id = "description" + idx;

                    image.id = "image" + idx;
                    image.href = "item.html?" + idx;

                    cell.appendChild(name);
                    cell.appendChild(description);
                    cell.appendChild(image);
                    cell.style.textAlign   = "center";
                    // cell.style.border = "outset";
                    // cell.style.width = "300px";
                    
                    idx++;
                }
            }
        }
        // document.body.appendChild(table);
        console.log("create DOM");
    
    // DOMに商品情報を入れる
    }).then(function() {
        for (idx = 0; idx < _numItems; idx++) {
            showItem(idx)
        }
    });
}

// 商品一覧を表示する関数
function showItem(idx) {
    console.log("showItem numItems = " + idx);

    // DOMに商品情報を入れる
    contract.methods.items(idx).call().then(function(item) {
        idxList = [3, 5, 11];
            
        for (var i of idxList) {
            if (i == 5) {
                var elem = document.createElement("p");
                elem.textContent = item[i] + "wei";
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
        // imageUrl = "http://drive.google.com/uc?export=view&id=" + image.googleDocID; // googleDriveを使用する場合
        // imageUrl = "http://localhost:8080/ipfs/" + image.ipfsHash; // ipfsがインストールされている場合
        imageUrl = "https://ipfs.io/ipfs/" + image.ipfsHash; // ipfsがインストールされていない場合
        
        // 生成する要素と属性
        var img = document.createElement("img");
        img.id = "ipfsImage" + idx;
        img.src = imageUrl;
        img.alt = "ipfsImage" + idx;

        // 画像の読込みを待ってから実行
        img.addEventListener("load", function() {
            // 画像のリサイズ
            var orgWidth  = img.width;
            var orgHeight = img.height;
            console.log("orgWidth " + orgWidth);
            console.log("orgHeight " + orgHeight);

            // img.width = 400; // 横幅をリサイズ
            // img.height = 0.56 * img.width;
            // img.height = orgHeight * (img.width / orgWidth); // 高さを横幅の変化割合に合わせる

            img.height = 200; // 縦幅をリサイズ
            img.width = orgWidth * (img.height / orgHeight); // 高さを横幅の変化割合に合わせる
            img.style.borderRadius = "10px";

            // ブラウザに表示する
            flag = document.getElementById("image" + idx).appendChild(img);
            console.log(flag);
            console.log("set image " + idx);
        });
    });
}