// 出品する
function sell() {
    var itemName = document.getElementById("itemName").value;
    var description = document.getElementById("description").value;
    var price = document.getElementById("price").value;
    // var googleID = document.getElementById("googleID").value;
    var googleID = "";
    var IPFSHash = document.getElementById("IPFSHash").value;

    return contract.methods.sell(itemName, description, price, googleID, IPFSHash)
    .send({ from: coinbase })
    .on("receipt", function(receipt){
        console.log("success");
    })
    .on("error", function(error){
            console.log("error"); 
    });
}