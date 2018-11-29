pragma solidity ^0.4.25;

contract KappaMarket {

    address owner;        // コントラクトオーナーのアドレス
    address donation;     // ユニセフのアドレス 
    uint public numItems; // 商品数
    bool public stopped;  // trueの場合Circuit Breakerが発動し，全てのコントラクトが使用不可能になる

    // コンストラクタ
    constructor() public {
        owner = msg.sender;
        // ユニセフのアドレス
        // http://helpdesk.unicef.org.nz/knowledge_base/topics/donate-to-unicef-via-cryptocurrencies
        donation = 0xB9407f0033DcA85ac48126a53E1997fFdE04B746;
    }

    // コントラクトの呼び出しがコントラクトのオーナーか確認
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    // Circuit Breaker
    modifier isStopped {
        require(!stopped);
        _;
    }
    
    // Circuit Breakerを発動，停止する関数
    function toggleCircuit(bool _stopped) public onlyOwner {
        stopped = _stopped;
    }

    // コントラクトの呼び出しがアカウント情報登録済みユーザーか確認
    modifier onlyUser {
        require(accounts[msg.sender].resistered);
        _;
    }

    // 商品情報
    struct item {
        address sellerAddr;  // 出品者のethアドレス
        address buyerAddr;   // 購入者のethアドレス
        string seller;       // 出品者名
        string name;         // 商品名
        string description;  // 商品説明
        uint price;          // 価格
        bool payment;        // false:未支払い, true:支払済み
        bool shipment;       // false:未発送, true:発送済み
        bool receivement;    // false:未受取り, true:受取済み
        bool sellerReputate; // 出品者の評価完了フラグ, false:未評価, true:評価済み
        bool buyerReputate;  // 購入者の評価完了フラグ, false:未評価, true:評価済み
        bool stopSell;       // false:出品中, true:出品取消し
    }
    mapping(uint => item) public items;

    // 商品画像の在り処
    // 商品画像はgoogleドライブかIPFSに保存する
    struct image {
        string googleDocID; // ファイルのid
        string ipfsHash;    // ファイルのハッシュ
    }
    mapping(uint => image) public images;

    // アカウント情報
    struct account {
        string name;          // 名前
        string email;         // emailアドレス
        uint numTransactions; // 取引回数
        int reputations;      // 取引評価, 大きい値ほど良いユーザー
        bool resistered;      // アカウント未登録:false, 登録済み:true
        int numSell;          // 出品した商品の数
        int numBuy;           // 購入した商品の数
    }
    mapping(address => account) public accounts;

    // 各ユーザーが出品した商品の番号を記録する配列
    mapping(address => uint[]) public sellItems;

    // 各ユーザーが購入した商品の番号を記録する配列
    mapping(address => uint[]) public buyItems;
    
    // 返金する際に参照するフラグ
    mapping(uint => bool) public refundFlags; // 返金すると，falseからtrueに変わる

    // アカウント情報を登録する関数
    function registerAccount(string _name, string _email) public isStopped {
        require(!accounts[msg.sender].resistered); // 未登録のethアドレスか確認

        accounts[msg.sender].name = _name;   // 名前
        accounts[msg.sender].email = _email; // emailアドレス
        accounts[msg.sender].resistered = true;
    }

    // アカウント情報を修正する関数
    function modifyAccount(string _name, string _email) public onlyUser isStopped {
        accounts[msg.sender].name = _name;   // 名前
        accounts[msg.sender].email = _email; // emailアドレス
    }

    // 出品する関数
    function sell(string _name, string _description, uint _price, string _googleDocID, string _ipfsHash) public onlyUser isStopped {
        items[numItems].sellerAddr = msg.sender;            // 出品者のethアドレス
        items[numItems].seller = accounts[msg.sender].name; // 出品者名
        items[numItems].name = _name;                       // 商品名
        items[numItems].description = _description;         // 商品説明
        items[numItems].price = _price;                     // 商品価格
        images[numItems].googleDocID = _googleDocID;        // ファイルのid
        images[numItems].ipfsHash = _ipfsHash;              // ファイルのハッシュ
        accounts[msg.sender].numSell++;                     // 出品した商品数の更新
        sellItems[msg.sender].push(numItems);               // 各ユーザーが購入した商品の番号を記録
        numItems++;
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
        images[numItems].googleDocID = _googleDocID;         // ファイルのid
        images[numItems].ipfsHash = _IPFSHash;               // ファイルのハッシュ
    }

    // 購入する関数
    function buy(uint _numItems) public payable onlyUser isStopped {
        require(_numItems < numItems);                // 存在する商品か確認
        require(!items[_numItems].payment);           // 商品が売り切れていないか確認
        require(!items[_numItems].stopSell);          // 出品取消しになっていないか確認
        require(items[_numItems].price == msg.value); // 入金金額が商品価格と一致しているか確認

        items[_numItems].buyerAddr = msg.sender; // 購入者のethアドレス
        items[_numItems].payment = true;         // 支払済みにする
        items[_numItems].stopSell = true;        // 売れたので出品をストップする
        accounts[msg.sender].numBuy++;           // 購入した商品数の更新
        buyItems[msg.sender].push(_numItems);    // 各ユーザーが購入した商品の番号を記録
    }

    // 発送完了時に呼び出される関数
    function ship(uint _numItems) public onlyUser isStopped {
        require(items[_numItems].sellerAddr == msg.sender); // コントラクトの呼び出しが出品者か確認
        require(_numItems < numItems);       // 存在する商品か確認
        require(items[_numItems].payment);   // 入金済み商品か確認
        require(!items[_numItems].shipment); // 未発送の商品か確認

        items[_numItems].shipment = true;  // 発送済みにする
    }

    // 商品受取り時に呼び出される関数
    function receive(uint _numItems) public payable onlyUser isStopped {
        require(items[_numItems].buyerAddr == msg.sender); // コントラクトの呼び出しが購入者か確認
        require(_numItems < numItems);          // 存在する商品か確認
        require(items[_numItems].shipment);     // 発送済み商品か確認
        require(!items[_numItems].receivement); // 受取前の商品か確認

        items[_numItems].receivement = true;
        // 受取りが完了したら出品者とユニセフにethを送金する
        donation.transfer(items[_numItems].price * 1 / 20); // 売上の5%を寄付
        items[_numItems].sellerAddr.transfer(items[_numItems].price * 19 / 20); // 残りを出品者に送金する
    }

    // 購入者が出品者を評価する関数
    function sellerEvaluate(uint _numItems, int _reputate) public onlyUser isStopped {
        require(items[_numItems].buyerAddr == msg.sender); // コントラクトの呼び出しが購入者か確認
        require(_numItems < numItems);                     // 存在する商品か確認
        require(_reputate >= -2 && _reputate <= 2);        // 評価は-2 ~ +2の範囲で行う
        require(!items[_numItems].sellerReputate);         // 購入者の評価が完了をしていないことを確認

        accounts[items[_numItems].sellerAddr].numTransactions++;        // 購入者の取引回数の加算
        accounts[items[_numItems].sellerAddr].reputations += _reputate; // 購入者の評価の更新
        items[_numItems].sellerReputate = true;                         // 評価済みにする
    }

    // 出品者が購入者を評価する関数
    function buyerEvaluate(uint _numItems, int _reputate) public onlyUser isStopped {
        require(items[_numItems].sellerAddr == msg.sender); // コントラクトの呼び出しが出品者か確認
        require(_numItems < numItems);                      // 存在する商品か確認
        require(_reputate >= -2 && _reputate <= 2);         // 評価は-2 ~ +2の範囲で行う
        require(!items[_numItems].buyerReputate);           // 購入者の評価が完了をしていないことを確認

        accounts[items[_numItems].buyerAddr].numTransactions++;        // 購入者の取引回数の加算
        accounts[items[_numItems].buyerAddr].reputations += _reputate; // 購入者の評価の更新
        items[_numItems].buyerReputate = true;                         // 評価済みにする
    }

    // 出品を取り消す関数（出品者）
    function sellerStop(uint _numItems) public onlyUser isStopped {
        require(items[_numItems].sellerAddr == msg.sender); // コントラクトの呼び出しが出品者か確認
        require(_numItems < numItems);                      // 存在する商品か確認
        require(!items[_numItems].stopSell);                // 出品中の商品か確認
        require(!items[_numItems].payment);                 // 購入されていない商品か確認

        items[_numItems].stopSell = true; // 出品の取消し
    }

    // 出品を取り消す関数（オーナー）
    function ownerStop(uint _numItems) public onlyOwner isStopped {
        require(items[_numItems].sellerAddr == msg.sender); // コントラクトの呼び出しが出品者か確認
        require(_numItems < numItems);                      // 存在する商品か確認
        require(!items[_numItems].stopSell);                // 出品中の商品か確認
        require(!items[_numItems].payment);                 // 購入されていない商品か確認

        items[_numItems].stopSell = true;
    }

    // 購入者へ返金する関数
    // 商品が届かなかった時に使用する
    function ownerRefund(uint _numItems) public payable onlyOwner isStopped {
        require(_numItems < numItems);          // 存在する商品か確認
        require(items[_numItems].payment);      // 入金済み商品か確認
        require(!items[_numItems].receivement); // 出品者が代金を受取る前か確認
        require(!refundFlags[_numItems]);       // 既に返金していないか確認

        refundFlags[_numItems] = true; // 返金済みにする
        items[_numItems].buyerAddr.transfer(items[_numItems].price); // 購入者へ返金
    }

    function sellerRefund(uint _numItems) public payable onlyUser isStopped {
        require(_numItems < numItems);                      // 存在する商品か確認
        require(msg.sender == items[_numItems].sellerAddr); // コントラクトの呼び出しが出品者か確認
        require(items[_numItems].payment);                  // 入金済み商品か確認
        require(!items[_numItems].receivement);             // 出品者が代金を受取る前か確認
        require(!refundFlags[_numItems]);                   // 既に返金していないか確認

        refundFlags[_numItems] = true; // 返金済みにする
        items[_numItems].buyerAddr.transfer(items[_numItems].price); // 購入者へ返金
    }

    // コントラクトを破棄して，残金をオーナーに送る関数
    // クラッキング対策
    function kill() public onlyOwner {
        selfdestruct(owner);
    }
}