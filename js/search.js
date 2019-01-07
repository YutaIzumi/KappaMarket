var itemIdx = {}; // 全ての商品名と商品番号を記録する連想配列

function getItemIdx(idx) {
    contract.methods.items(idx).call().then(function(item) {
        itemIdx[item[3]] = idx; // item[3]：商品名
    });
}

window.onload = function() {
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

// 商品検索を行う関数
function search() {
    var searchResult = []; // 検索ワードと一致した商品のインデックスを保存する
    searchWord = document.getElementById("searchWord").value; // 検索ワードの取得
    
    for (var key in itemIdx) {
        if (key.toLowerCase().indexOf(searchWord) > -1) { // 商品名と検索ワードが部分一致した場合
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