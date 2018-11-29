pragma solidity ^0.4.25;

contract KappaMarket {

    address owner;        // �R���g���N�g�I�[�i�[�̃A�h���X
    address donation;     // ���j�Z�t�̃A�h���X 
    uint public numItems; // ���i��
    bool public stopped;  // true�̏ꍇCircuit Breaker���������C�S�ẴR���g���N�g���g�p�s�\�ɂȂ�

    // �R���X�g���N�^
    constructor() public {
        owner = msg.sender;
        // ���j�Z�t�̃A�h���X
        // http://helpdesk.unicef.org.nz/knowledge_base/topics/donate-to-unicef-via-cryptocurrencies
        donation = 0xB9407f0033DcA85ac48126a53E1997fFdE04B746;
    }

    // �R���g���N�g�̌Ăяo�����R���g���N�g�̃I�[�i�[���m�F
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    // Circuit Breaker
    modifier isStopped {
        require(!stopped);
        _;
    }
    
    // Circuit Breaker�𔭓��C��~����֐�
    function toggleCircuit(bool _stopped) public onlyOwner {
        stopped = _stopped;
    }

    // �R���g���N�g�̌Ăяo�����A�J�E���g���o�^�ς݃��[�U�[���m�F
    modifier onlyUser {
        require(accounts[msg.sender].resistered);
        _;
    }

    // ���i���
    struct item {
        address sellerAddr;  // �o�i�҂�eth�A�h���X
        address buyerAddr;   // �w���҂�eth�A�h���X
        string seller;       // �o�i�Җ�
        string name;         // ���i��
        string description;  // ���i����
        uint price;          // ���i
        bool payment;        // false:���x����, true:�x���ς�
        bool shipment;       // false:������, true:�����ς�
        bool receivement;    // false:������, true:���ς�
        bool sellerReputate; // �o�i�҂̕]�������t���O, false:���]��, true:�]���ς�
        bool buyerReputate;  // �w���҂̕]�������t���O, false:���]��, true:�]���ς�
        bool stopSell;       // false:�o�i��, true:�o�i�����
    }
    mapping(uint => item) public items;

    // ���i�摜�݂̍菈
    // ���i�摜��google�h���C�u��IPFS�ɕۑ�����
    struct image {
        string googleDocID; // �t�@�C����id
        string ipfsHash;    // �t�@�C���̃n�b�V��
    }
    mapping(uint => image) public images;

    // �A�J�E���g���
    struct account {
        string name;          // ���O
        string email;         // email�A�h���X
        uint numTransactions; // �����
        int reputations;      // ����]��, �傫���l�قǗǂ����[�U�[
        bool resistered;      // �A�J�E���g���o�^:false, �o�^�ς�:true
        int numSell;          // �o�i�������i�̐�
        int numBuy;           // �w���������i�̐�
    }
    mapping(address => account) public accounts;

    // �e���[�U�[���o�i�������i�̔ԍ����L�^����z��
    mapping(address => uint[]) public sellItems;

    // �e���[�U�[���w���������i�̔ԍ����L�^����z��
    mapping(address => uint[]) public buyItems;
    
    // �ԋ�����ۂɎQ�Ƃ���t���O
    mapping(uint => bool) public refundFlags; // �ԋ�����ƁCfalse����true�ɕς��

    // �A�J�E���g����o�^����֐�
    function registerAccount(string _name, string _email) public isStopped {
        require(!accounts[msg.sender].resistered); // ���o�^��eth�A�h���X���m�F

        accounts[msg.sender].name = _name;   // ���O
        accounts[msg.sender].email = _email; // email�A�h���X
        accounts[msg.sender].resistered = true;
    }

    // �A�J�E���g�����C������֐�
    function modifyAccount(string _name, string _email) public onlyUser isStopped {
        accounts[msg.sender].name = _name;   // ���O
        accounts[msg.sender].email = _email; // email�A�h���X
    }

    // �o�i����֐�
    function sell(string _name, string _description, uint _price, string _googleDocID, string _ipfsHash) public onlyUser isStopped {
        items[numItems].sellerAddr = msg.sender;            // �o�i�҂�eth�A�h���X
        items[numItems].seller = accounts[msg.sender].name; // �o�i�Җ�
        items[numItems].name = _name;                       // ���i��
        items[numItems].description = _description;         // ���i����
        items[numItems].price = _price;                     // ���i���i
        images[numItems].googleDocID = _googleDocID;        // �t�@�C����id
        images[numItems].ipfsHash = _ipfsHash;              // �t�@�C���̃n�b�V��
        accounts[msg.sender].numSell++;                     // �o�i�������i���̍X�V
        sellItems[msg.sender].push(numItems);               // �e���[�U�[���w���������i�̔ԍ����L�^
        numItems++;
    }

    // �o�i���e��ύX����֐�
    function modifyItem(uint _numItems, string _name, string _description, uint _price, string _googleDocID, string _IPFSHash) public onlyUser isStopped {
        require(items[_numItems].sellerAddr == msg.sender);  // �R���g���N�g�̌Ăяo�����o�i�҂��m�F
        require(!items[_numItems].payment);                  // �w������Ă��Ȃ����i���m�F
        require(!items[_numItems].stopSell);                 // �o�i���̏��i���m�F

        items[_numItems].seller = accounts[msg.sender].name; // �o�i�Җ�
        items[_numItems].name = _name;                       // ���i��
        items[_numItems].description = _description;         // ���i����
        items[_numItems].price = _price;                     // ���i���i
        images[numItems].googleDocID = _googleDocID;         // �t�@�C����id
        images[numItems].ipfsHash = _IPFSHash;               // �t�@�C���̃n�b�V��
    }

    // �w������֐�
    function buy(uint _numItems) public payable onlyUser isStopped {
        require(_numItems < numItems);                // ���݂��鏤�i���m�F
        require(!items[_numItems].payment);           // ���i������؂�Ă��Ȃ����m�F
        require(!items[_numItems].stopSell);          // �o�i������ɂȂ��Ă��Ȃ����m�F
        require(items[_numItems].price == msg.value); // �������z�����i���i�ƈ�v���Ă��邩�m�F

        items[_numItems].buyerAddr = msg.sender; // �w���҂�eth�A�h���X
        items[_numItems].payment = true;         // �x���ς݂ɂ���
        items[_numItems].stopSell = true;        // ���ꂽ�̂ŏo�i���X�g�b�v����
        accounts[msg.sender].numBuy++;           // �w���������i���̍X�V
        buyItems[msg.sender].push(_numItems);    // �e���[�U�[���w���������i�̔ԍ����L�^
    }

    // �����������ɌĂяo�����֐�
    function ship(uint _numItems) public onlyUser isStopped {
        require(items[_numItems].sellerAddr == msg.sender); // �R���g���N�g�̌Ăяo�����o�i�҂��m�F
        require(_numItems < numItems);       // ���݂��鏤�i���m�F
        require(items[_numItems].payment);   // �����ςݏ��i���m�F
        require(!items[_numItems].shipment); // �������̏��i���m�F

        items[_numItems].shipment = true;  // �����ς݂ɂ���
    }

    // ���i���莞�ɌĂяo�����֐�
    function receive(uint _numItems) public payable onlyUser isStopped {
        require(items[_numItems].buyerAddr == msg.sender); // �R���g���N�g�̌Ăяo�����w���҂��m�F
        require(_numItems < numItems);          // ���݂��鏤�i���m�F
        require(items[_numItems].shipment);     // �����ςݏ��i���m�F
        require(!items[_numItems].receivement); // ���O�̏��i���m�F

        items[_numItems].receivement = true;
        // ���肪����������o�i�҂ƃ��j�Z�t��eth�𑗋�����
        donation.transfer(items[_numItems].price * 1 / 20); // �����5%����t
        items[_numItems].sellerAddr.transfer(items[_numItems].price * 19 / 20); // �c����o�i�҂ɑ�������
    }

    // �w���҂��o�i�҂�]������֐�
    function sellerEvaluate(uint _numItems, int _reputate) public onlyUser isStopped {
        require(items[_numItems].buyerAddr == msg.sender); // �R���g���N�g�̌Ăяo�����w���҂��m�F
        require(_numItems < numItems);                     // ���݂��鏤�i���m�F
        require(_reputate >= -2 && _reputate <= 2);        // �]����-2 ~ +2�͈̔͂ōs��
        require(!items[_numItems].sellerReputate);         // �w���҂̕]�������������Ă��Ȃ����Ƃ��m�F

        accounts[items[_numItems].sellerAddr].numTransactions++;        // �w���҂̎���񐔂̉��Z
        accounts[items[_numItems].sellerAddr].reputations += _reputate; // �w���҂̕]���̍X�V
        items[_numItems].sellerReputate = true;                         // �]���ς݂ɂ���
    }

    // �o�i�҂��w���҂�]������֐�
    function buyerEvaluate(uint _numItems, int _reputate) public onlyUser isStopped {
        require(items[_numItems].sellerAddr == msg.sender); // �R���g���N�g�̌Ăяo�����o�i�҂��m�F
        require(_numItems < numItems);                      // ���݂��鏤�i���m�F
        require(_reputate >= -2 && _reputate <= 2);         // �]����-2 ~ +2�͈̔͂ōs��
        require(!items[_numItems].buyerReputate);           // �w���҂̕]�������������Ă��Ȃ����Ƃ��m�F

        accounts[items[_numItems].buyerAddr].numTransactions++;        // �w���҂̎���񐔂̉��Z
        accounts[items[_numItems].buyerAddr].reputations += _reputate; // �w���҂̕]���̍X�V
        items[_numItems].buyerReputate = true;                         // �]���ς݂ɂ���
    }

    // �o�i���������֐��i�o�i�ҁj
    function sellerStop(uint _numItems) public onlyUser isStopped {
        require(items[_numItems].sellerAddr == msg.sender); // �R���g���N�g�̌Ăяo�����o�i�҂��m�F
        require(_numItems < numItems);                      // ���݂��鏤�i���m�F
        require(!items[_numItems].stopSell);                // �o�i���̏��i���m�F
        require(!items[_numItems].payment);                 // �w������Ă��Ȃ����i���m�F

        items[_numItems].stopSell = true; // �o�i�̎����
    }

    // �o�i���������֐��i�I�[�i�[�j
    function ownerStop(uint _numItems) public onlyOwner isStopped {
        require(items[_numItems].sellerAddr == msg.sender); // �R���g���N�g�̌Ăяo�����o�i�҂��m�F
        require(_numItems < numItems);                      // ���݂��鏤�i���m�F
        require(!items[_numItems].stopSell);                // �o�i���̏��i���m�F
        require(!items[_numItems].payment);                 // �w������Ă��Ȃ����i���m�F

        items[_numItems].stopSell = true;
    }

    // �w���҂֕ԋ�����֐�
    // ���i���͂��Ȃ��������Ɏg�p����
    function ownerRefund(uint _numItems) public payable onlyOwner isStopped {
        require(_numItems < numItems);          // ���݂��鏤�i���m�F
        require(items[_numItems].payment);      // �����ςݏ��i���m�F
        require(!items[_numItems].receivement); // �o�i�҂����������O���m�F
        require(!refundFlags[_numItems]);       // ���ɕԋ����Ă��Ȃ����m�F

        refundFlags[_numItems] = true; // �ԋ��ς݂ɂ���
        items[_numItems].buyerAddr.transfer(items[_numItems].price); // �w���҂֕ԋ�
    }

    function sellerRefund(uint _numItems) public payable onlyUser isStopped {
        require(_numItems < numItems);                      // ���݂��鏤�i���m�F
        require(msg.sender == items[_numItems].sellerAddr); // �R���g���N�g�̌Ăяo�����o�i�҂��m�F
        require(items[_numItems].payment);                  // �����ςݏ��i���m�F
        require(!items[_numItems].receivement);             // �o�i�҂����������O���m�F
        require(!refundFlags[_numItems]);                   // ���ɕԋ����Ă��Ȃ����m�F

        refundFlags[_numItems] = true; // �ԋ��ς݂ɂ���
        items[_numItems].buyerAddr.transfer(items[_numItems].price); // �w���҂֕ԋ�
    }

    // �R���g���N�g��j�����āC�c�����I�[�i�[�ɑ���֐�
    // �N���b�L���O�΍�
    function kill() public onlyOwner {
        selfdestruct(owner);
    }
}