window.onload = function(){
    var _numItems;

    // 出品されている商品数を取得する
    contract.methods.numItems().call()
    .then(function(numItems) {
        _numItems = numItems;
        console.log("numItems is " + _numItems);
    
    // DOMの作成
    }).then(function() {
        var rows=[];
        var table = document.createElement("table");
        var col = Math.ceil(_numItems / 3.0);
        var idx = 0;
        for (i = 0; i < col; i++) {
            rows.push(table.insertRow(-1)); // 行の追加
            for(j = 0; j < 3; j++) {
                cell = rows[i].insertCell(-1);

                if (idx < _numItems) {
                    // 商品の説明と画像を表示するDOMを作成
                    var description = document.createElement("div");
                    var image = document.createElement("a");
                    description.setAttribute("id", "description" + idx);
                    image.setAttribute("id", "image" + idx);
                    image.href = "item.html?" + idx;
                    cell.appendChild(description);
                    cell.appendChild(image);

                    cell.style.border = "outset";
                    cell.style.width = "500px"; 
                    idx++;
                }
            }
        }
        document.body.appendChild(table);
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
        idxList = [3, 5, 2, 11];
        keyList = ["商品名", "価格(wei)", "出品者", "状態"];
            
        for (var i = 0; i < idxList.length; i++) {
            var elem = document.createElement("p");
            
            if (i == 3) {
                if (item[idxList[i]] == true) {
                    elem.textContent = keyList[i] + " : 売切れ";
                } else {
                    elem.textContent = keyList[i] + " : 出品中";
                }
                document.getElementById("description" + idx).appendChild(elem);
            } else {
                elem.textContent = keyList[i] + " : " + item[idxList[i]];
                document.getElementById("description" + idx).appendChild(elem);
            }
        }
    });
        
    // 商品画像を表示する
    // ipfsを使用する
    contract.methods.images(idx).call().then(function(image) {
        // imageUrl = "http://localhost:8080/ipfs/" + image.ipfsHash; // ipfsがインストールされている場合
        imageUrl = "https://ipfs.io/ipfs/" + image.ipfsHash; // ipfsがインストールされていない場合
            
        // 生成する要素と属性
        var img = document.createElement("img");
        img.setAttribute("id", "ipfsImage");
        img.setAttribute("src", imageUrl);
        img.setAttribute("alt", "image");
            
        // 画像のリサイズ
        var orgWidth  = img.width;
        var orgHeight = img.height;

        img.width = 300; // 横幅を300pxにリサイズ
        img.height = 168;
        // img.height = orgHeight * (img.width / orgWidth); // 高さを横幅の変化割合に合わせる

        document.getElementById("image" + idx).appendChild(img);
    });

    // 商品画像を表示する
    // googleドライブを使用する
    /*
    contract.methods.images(item).call().then(function(image){
        imageUrl = "http://drive.google.com/uc?export=view&id=" + image.googleDocID;
        // var win = window.open(imageUrl, "_blank");
                
        // 生成する要素と属性
        var img = document.createElement("img");
        img.setAttribute("id", "googleImage");
        img.setAttribute("src", imageUrl);
        img.setAttribute("alt", "image");
            
        // 画像のリサイズ
        var orgWidth  = img.width;
        var orgHeight = img.height;
        img.width = 400; // 横幅を400pxにリサイズ
        img.height = orgHeight * (img.width / orgWidth); // 高さを横幅の変化割合に合わせる
        
        document.getElementById("image" + idx).appendChild(img);
        document.getElementById("image" + idx).appendChild(document.createElement("br"));
    });
    */
}