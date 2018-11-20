var abi = [
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "sellItems",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_name",
				"type": "string"
			},
			{
				"name": "_description",
				"type": "string"
			},
			{
				"name": "_price",
				"type": "uint256"
			},
			{
				"name": "_googleDocID",
				"type": "string"
			},
			{
				"name": "_ipfsHash",
				"type": "string"
			}
		],
		"name": "sell",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_numItems",
				"type": "uint256"
			}
		],
		"name": "ship",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_numItems",
				"type": "uint256"
			}
		],
		"name": "ownerStop",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_numItems",
				"type": "uint256"
			},
			{
				"name": "_name",
				"type": "string"
			},
			{
				"name": "_description",
				"type": "string"
			},
			{
				"name": "_price",
				"type": "uint256"
			},
			{
				"name": "_googleDocID",
				"type": "string"
			},
			{
				"name": "_IPFSHash",
				"type": "string"
			}
		],
		"name": "modifyItem",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "kill",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "numItems",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "accounts",
		"outputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "email",
				"type": "string"
			},
			{
				"name": "numTransactions",
				"type": "uint256"
			},
			{
				"name": "reputations",
				"type": "int256"
			},
			{
				"name": "resistered",
				"type": "bool"
			},
			{
				"name": "numSell",
				"type": "int256"
			},
			{
				"name": "numBuy",
				"type": "int256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "buyItems",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_numItems",
				"type": "uint256"
			},
			{
				"name": "_reputate",
				"type": "int256"
			}
		],
		"name": "sellerEvaluate",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_numItems",
				"type": "uint256"
			}
		],
		"name": "sellerStop",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "images",
		"outputs": [
			{
				"name": "googleDocID",
				"type": "string"
			},
			{
				"name": "ipfsHash",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_numItems",
				"type": "uint256"
			}
		],
		"name": "sellerRefund",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "items",
		"outputs": [
			{
				"name": "sellerAddr",
				"type": "address"
			},
			{
				"name": "buyerAddr",
				"type": "address"
			},
			{
				"name": "seller",
				"type": "string"
			},
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "description",
				"type": "string"
			},
			{
				"name": "price",
				"type": "uint256"
			},
			{
				"name": "payment",
				"type": "bool"
			},
			{
				"name": "shipment",
				"type": "bool"
			},
			{
				"name": "receivement",
				"type": "bool"
			},
			{
				"name": "sellerReputate",
				"type": "bool"
			},
			{
				"name": "buyerReputate",
				"type": "bool"
			},
			{
				"name": "stopSell",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_numItems",
				"type": "uint256"
			},
			{
				"name": "_reputate",
				"type": "int256"
			}
		],
		"name": "buyerEvaluate",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_numItems",
				"type": "uint256"
			}
		],
		"name": "receive",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_numItems",
				"type": "uint256"
			}
		],
		"name": "buy",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_name",
				"type": "string"
			},
			{
				"name": "_email",
				"type": "string"
			}
		],
		"name": "registerAccount",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_numItems",
				"type": "uint256"
			}
		],
		"name": "ownerRefund",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_name",
				"type": "string"
			},
			{
				"name": "_email",
				"type": "string"
			}
		],
		"name": "modifyAccount",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	}
]