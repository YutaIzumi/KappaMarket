// アカウント登録
function registerAccount() {
    var userName = document.getElementById("userName").value;
    var userEmail = document.getElementById("userEmail").value;

    return contract.methods.registerAccount(userName, userEmail)
    .send({ from: coinbase })
    .on("receipt", function(receipt){
        console.log("success");
    })
    .on("error", function(error){
            console.log("error"); 
    });
}