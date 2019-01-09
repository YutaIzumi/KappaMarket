// 出品する関数
function sell() {
    var itemName = document.getElementById("itemName").value;
    var description = document.getElementById("description").value;
    var price = document.getElementById("price").value;
    price = Number(price) * 1000000000000000000; // 単位をethからweiに変換する
    var googleID = document.getElementById("googleID").value;
    var IPFSHash = document.getElementById("IPFSHash").value;

    console.log(typeof(price));
    console.log(price);

    return contract.methods.sell(itemName, description, price, googleID, IPFSHash)
    .send({ from: coinbase })
    .on("receipt", function(receipt){
        console.log("success");
    })
    .on("error", function(error){
            console.log("error");
    });
}