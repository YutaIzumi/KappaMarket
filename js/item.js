// 商品番号をurlから取得する
var numItem = window.location.search.substring(1,window.location.search.length);
numItem = Number(numItem);
var price;
console.log("numItem : " + numItem);

showItem(); // 商品を表示する

// 商品を表示する関数
function showItem() {
    // 商品説明を表示
    console.log("show description");
    itemKeyList = ["商品名", "価格", "商品説明", "状態", "出品者", "出品者のアドレス", "購入者のアドレス"];
    itemIdxList = [3, 5, 4, 11, 2, 0, 1];
    contract.methods.items(numItem).call()
    .then(function(item) {
        for (var i = 0; i < itemIdxList.length; i++) {
            var elem = document.createElement("p");
            if (i == 1) {
                elem.textContent = itemKeyList[i] + " : " + item[itemIdxList[i]] + "wei";
                document.getElementById("item").appendChild(elem);
            } else if (i == 3) {
                if (item[itemIdxList[i]] == true) {
                    elem.setAttribute("class", "text-danger");
                    elem.textContent = itemKeyList[i] + " : Sold Out";
                } else {
                    elem.setAttribute("class", "text-success");
                    elem.textContent = itemKeyList[i] + " : 出品中";
                }
                document.getElementById("item").appendChild(elem);
            } else {
                elem.textContent = itemKeyList[i] + " : " + item[itemIdxList[i]];
                document.getElementById("item").appendChild(elem);
            }

            if (i == 1) {
                price = item[itemIdxList[i]]; // 商品価格を取得
            }
        }
    });

    // 商品画像を表示
    console.log("show image")
    contract.methods.images(numItem).call()
    .then(function(image) {
        // imageUrl = "http://localhost:8080/ipfs/" + image.ipfsHash; // ipfsがインストールされている場合
        imageUrl = "https://ipfs.io/ipfs/" + image.ipfsHash;
        
        // 生成する要素と属性
        var img = document.createElement("img");
        img.setAttribute("id", "ipfsImage");
        img.setAttribute("src", imageUrl);
        img.setAttribute("alt", "image");
        
        var orgWidth  = img.width;
        var orgHeight = img.height;
        img.width = 600;  // 幅固定
        img.height = orgHeight * (img.width / orgWidth); // 高さを横幅の変化割合に合わせる
        
        document.getElementById("image").appendChild(img);
    });
}

// 購入する関数
function buy() {
    return contract.methods.buy(numItem)
    .send({ from: coinbase, value: price })
    .on("receipt", function(receipt) {
        console.log("success");
    })
    .on("error", function(error) {
            console.log("error"); 
    });
}