pragma solidity ^0.4.25;

contract EthereumMarket {

    address owner;        // コントラクトオーナーのアドレス
    uint public numItems; // 商品数
    bool public stopped;  // trueの場合Circuit Breakerが発動し，全てのコントラクトが使用不可能になる

    // コンストラクタ
    constructor() public {
        owner = msg.sender; // コントラクトをデプロイしたアドレスをオーナーに指定する
        numItems = 0;
        stopped = false;
    }

    // 呼び出しがコントラクトのオーナーか確認
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    // 呼び出しがアカウント登録済みのEthアドレスか確認
    modifier onlyUser {
        require(accounts[msg.sender].resistered);
        _;
    }

    // ===========================
    // 取引を行うためのステートと関数
    // ===========================

    // アカウント情報
    struct account {
        string name;          // 名前
        string email;         // emailアドレス
        uint numTransactions; // 取引回数
        int reputations;      // 取引評価, 大きい値ほど良いアカウント
        bool resistered;      // アカウント未登録:false, 登録済み:true
        int numSell;          // 出品した商品の数
        int numBuy;           // 購入した商品の数
    }
    mapping(address => account) public accounts;

    // 各ユーザーが出品，購入した商品番号
    // 本来は各ユーザーが出品，購入した商品番号はaccountのメンバにするべきですが，
    // solidityの構造体は配列をメンバにすることができません．
    // そこで，新たにこれらを記録するデータ構造体を宣言しています．
    mapping(address => uint[]) public sellItems;
    mapping(address => uint[]) public buyItems;

    // アカウント登録する関数
    function registerAccount(string _name, string _email) public isStopped {
        require(!accounts[msg.sender].resistered); // 未登録のEthアドレスか確認

	accounts[msg.sender].resistered = true;
        accounts[msg.sender].name = _name;   // 名前
        accounts[msg.sender].email = _email; // emailアドレス
    }

    // 商品情報
    struct item {
        address sellerAddr;  // 出品者のEthアドレス
        address buyerAddr;   // 購入者のEthアドレス
        string seller;       // 出品者名
        string name;         // 商品名
        string description;  // 商品説明
        uint price;          // 価格(単位：wei)
        bool payment;        // false:未支払い, true:支払済み
        bool shipment;       // false:未発送, true:発送済み
        bool receivement;    // false:未受取り, true:受取済み
        bool sellerReputate; // 出品者の評価完了ステート, false:未評価, true:評価済み
        bool buyerReputate;  // 購入者の評価完了ステート, false:未評価, true:評価済み
        bool stopSell;       // false:出品中, true:出品取消し
    }
    mapping(uint => item) public items;

    // 商品画像の在り処
    // solidityの構造体は12個までしかメンバを持てないので，商品画像の在り処はitemのメンバにすることができません．
    // そこで，新たにimagesというデータ構造体を作成します．
    struct image {
        string googleDocID; // googleドライブのファイルのid
        string ipfsHash;    // IPFSのファイルハッシュ
    }
    mapping(uint => image) public images;

    // 出品する関数
    function sell(string _name, string _description, uint _price, string _googleDocID, string _ipfsHash) public onlyUser isStopped {
        items[numItems].sellerAddr = msg.sender;            // 出品者のEthアドレス
        items[numItems].seller = accounts[msg.sender].name; // 出品者名
        items[numItems].name = _name;                       // 商品名
        items[numItems].description = _description;         // 商品説明
        items[numItems].price = _price;                     // 商品価格
        images[numItems].googleDocID = _googleDocID;        // googleドライブのファイルid
        images[numItems].ipfsHash = _ipfsHash;              // IPFSのファイルハッシュ
        accounts[msg.sender].numSell++;                     // 各アカウントが出品した商品数の更新
        sellItems[msg.sender].push(numItems);               // 各アカウントが出品した商品の番号を記録
        numItems++;                                         // 出品されている商品数を１つ増やす
    }

    // 購入する関数
    // 代金は購入者が商品を受取るまでコントラクトに預けられます
    function buy(uint _numItems) public payable onlyUser isStopped {
        require(!items[_numItems].payment);           // 商品が売り切れていないか確認
        require(!items[_numItems].stopSell);          // 出品取消しになっていないか確認
        require(items[_numItems].price == msg.value); // 入金金額が商品価格と一致しているか確認

        items[_numItems].payment = true;         // 支払済みにする
        items[_numItems].stopSell = true;        // 売れたので出品をストップする
	items[_numItems].buyerAddr = msg.sender; // 購入者のEthアドレスを登録する
        accounts[msg.sender].numBuy++;           // 各アカウントが購入した商品数の更新
        buyItems[msg.sender].push(_numItems);    // 各アカウントが購入した商品の番号を記録
    }

    // 発送完了を通知する関数
    function ship(uint _numItems) public onlyUser isStopped {
        require(items[_numItems].sellerAddr == msg.sender); // 呼び出しが出品者か確認
        require(items[_numItems].payment);   // 入金済み商品か確認
        require(!items[_numItems].shipment); // 未発送の商品か確認

        items[_numItems].shipment = true;    // 発送済みにする
    }

    // 商品受取の通知と出品者へ代金を送金する関数
    function receive(uint _numItems) public payable onlyUser isStopped {
        require(items[_numItems].buyerAddr == msg.sender); // 呼び出しが購入者か確認
        require(items[_numItems].shipment);     // 発送済み商品か確認
        require(!items[_numItems].receivement); // 受取前の商品か確認
		
        items[_numItems].receivement = true; 	// 受取済みにする
        // 受取りが完了したら出品者に代金を送金する
        items[_numItems].sellerAddr.transfer(items[_numItems].price);
    }
	
    // 取引評価を行う
    // 購入者が出品者を評価する関数
    function sellerEvaluate(uint _numItems, int _reputate) public onlyUser isStopped {
        require(items[_numItems].buyerAddr == msg.sender); // 呼び出しが購入者か確認
        require(items[_numItems].receivement);             // 商品の受取が完了していることを確認
        require(_reputate >= -2 && _reputate <= 2);        // 評価は-2 ~ +2の範囲で行う
        require(!items[_numItems].sellerReputate);         // 出品者の評価が完了をしていないことを確認

	items[_numItems].sellerReputate = true;                         // 評価済みにする
        accounts[items[_numItems].sellerAddr].numTransactions++;        // 出品者の取引回数の加算
        accounts[items[_numItems].sellerAddr].reputations += _reputate; // 出品者の評価の更新
    }

    // 出品者が購入者を評価する関数
    function buyerEvaluate(uint _numItems, int _reputate) public onlyUser isStopped {
        require(items[_numItems].sellerAddr == msg.sender); // 呼び出しが出品者か確認
        require(items[_numItems].receivement);              // 商品の受取が完了していることを確認
        require(_reputate >= -2 && _reputate <= 2);         // 評価は-2 ~ +2の範囲で行う
        require(!items[_numItems].buyerReputate);           // 購入者の評価が完了をしていないことを確認

	items[_numItems].buyerReputate = true;                         // 評価済みにする
        accounts[items[_numItems].buyerAddr].numTransactions++;        // 購入者の取引回数の加算
        accounts[items[_numItems].buyerAddr].reputations += _reputate; // 購入者の評価の更新
    }

    // ===============================
    // 例外処理を行うためのステートと関数
    // ===============================

    // アカウント情報を修正する関数
    function modifyAccount(string _name, string _email) public onlyUser isStopped {
        accounts[msg.sender].name = _name;   // 名前
        accounts[msg.sender].email = _email; // emailアドレス
    }
    
    // 出品内容を変更する関数
    function modifyItem(uint _numItems, string _name, string _description, uint _price, string _googleDocID, string _IPFSHash) public onlyUser isStopped {
        require(items[_numItems].sellerAddr == msg.sender);  // コントラクトの呼び出しが出品者か確認
        require(!items[_numItems].payment);                  // 購入されていない商品か確認
        require(!items[_numItems].stopSell);                 // 出品中の商品か確認

        items[_numItems].seller = accounts[msg.sender].name; // 出品者名
        items[_numItems].name = _name;                       // 商品名
        items[_numItems].description = _description;         // 商品説明
        items[_numItems].price = _price;                     // 商品価格
        images[_numItems].googleDocID = _googleDocID;        // googleドライブのファイルのid
        images[_numItems].ipfsHash = _IPFSHash;              // IPFSのファイルハッシュ
    }

    // 出品を取り消す関数（出品者）
    function sellerStop(uint _numItems) public onlyUser isStopped {
        require(items[_numItems].sellerAddr == msg.sender); // 呼び出しが出品者か確認
        require(!items[_numItems].stopSell);                // 出品中の商品か確認
        require(!items[_numItems].payment);                 // 購入されていない商品か確認

        items[_numItems].stopSell = true; // 出品の取消し
    }

    // 出品を取り消す関数（オーナー）
    function ownerStop(uint _numItems) public onlyOwner isStopped {
        require(!items[_numItems].stopSell); // 出品中の商品か確認
        require(!items[_numItems].payment);  // 購入されていない商品か確認

        items[_numItems].stopSell = true; // 出品の取消し
    }

    // 返金する際に参照するステート
    mapping(uint => bool) public refundFlags; // 返金すると，falseからtrueに変わる

    // 購入者へ返金する関数（出品者）
    // 商品を発送できなくなった時に使用する
    function refundFromSeller(uint _numItems) public payable onlyUser isStopped {
        require(msg.sender == items[_numItems].sellerAddr); // 呼び出しが出品者か確認
        require(items[_numItems].payment);                  // 入金済み商品か確認
        require(!items[_numItems].receivement);             // 出品者が代金を受取る前か確認
        require(!refundFlags[_numItems]);                   // 既に返金された商品ではないか確認

        refundFlags[_numItems] = true; // 返金済みにする
        items[_numItems].buyerAddr.transfer(items[_numItems].price); // 購入者へ返金
    }

    // 購入者へ返金する関数（オーナー）
    function refundFromOwner(uint _numItems) public payable onlyOwner isStopped {
        require(items[_numItems].payment);      // 入金済み商品か確認
        require(!items[_numItems].receivement); // 出品者が代金を受取る前か確認
        require(!refundFlags[_numItems]);       // 既に返金された商品ではないか確認

        refundFlags[_numItems] = true; // 返金済みにする
        items[_numItems].buyerAddr.transfer(items[_numItems].price); // 購入者へ返金
    }

    // ================
    // セキュリティー対策
    // ================

    // Circuit Breaker
    modifier isStopped {
        require(!stopped);
        _;
    }
    
    // Circuit Breakerを発動，停止する関数
    function toggleCircuit(bool _stopped) public onlyOwner {
        stopped = _stopped;
    }

    // コントラクトを破棄して，残金をオーナーに送る関数
    // クラッキング対策
    function kill() public onlyOwner {
        selfdestruct(owner);
    }
}
