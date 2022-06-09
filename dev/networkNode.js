const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const { v4: uuidv4 } = require('uuid');
const nodeAddress = uuidv4().replace('-', '');
const port = process.argv[2];
const rp = require('request-promise');

const maincoin = new Blockchain();

//access the received json data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

function getChain(chain) {
	let chainToAdd = null;
	if (chain == 'main') {
		chainToAdd = maincoin;
	} else {
		for (let i = 0; i < maincoin.sidechains.length; i++) {
			if (maincoin.sidechains[i].id == chain) {
				chainToAdd = maincoin.sidechains[i];
				break;
			}
		}
	}
	return chainToAdd;
}

app.get('/blockchain', function (req, res) {
	let sidechains = [];
	for (let i = 0; i < maincoin.sidechains.length; i++) {
		let sidechain = maincoin.sidechains[i];
		sidechains.add({
			'id': sidechain.id,
			'lockAmount': sidechain.lockAmount,
			'pendingTransactions': sidechain.pendingTransactions,
			'chain': sidechain.chain,
		});
	}
	res.json({
		'pendingTransactions': maincoin.pendingTransactions,
		'currentNodeUrl': maincoin.currentNodeUrl,
		'networkNodes': maincoin.networkNodes,
		'chain': maincoin.chain,
		'sidechains': sidechain,
	});
});

app.post('/createSideChain', function (req, res) {
	maincoin.createSideChain(req.body.id, req.body.amount);
	res.json({ note: `Sidechain with id ${req.body.id} created successfully` })
});

app.post('/transaction', function (req, res) {
	const { newTransaction, chain } = req.body;
	if (chain && newTransaction) {
		let chainToAdd = getChain(chain);
		if (chainToAdd == null) {
			res.json({ note: `Chain not present.` });
			return;
		}
		const blockIndex = chainToAdd.addTransactionToPendingTransactions(newTransaction);
		res.json({ note: `Transaction will be added in block ${blockIndex}.` });
	} else {
		res.json({ note: `Transaction failed.` });
	}
});

app.post('/transaction/broadcast', function (req, res) {
	const { chain, amount, sender, recipient } = req.body;
	if (chain && amount && sender && recipient) {
		let chainToAdd = getChain(chain);
		if (chainToAdd == null) {
			res.json({ note: `Chain not present.` });
			return;
		}

		const newTransaction = chainToAdd.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
		chainToAdd.addTransactionToPendingTransactions(newTransaction);

		const requestPromises = [];
		chainToAdd.networkNodes.forEach(networkNodeUrl => {
			const requestOptions = {
				uri: networkNodeUrl + '/transaction',
				method: 'POST',
				body: {
					newTransaction,
					chain: chainToAdd.id,
				},
				json: true
			};

			requestPromises.push(rp(requestOptions));
		});

		Promise.all(requestPromises)
			.then(data => {
				res.json({ note: 'Transaction created and broadcasted successfully.' });
			});
	} else {
		res.json({ note: `Transaction failed.` });
	}
});

// ⬇️ correct from below
app.get('/mine', function (req, res) {
	const lastBlock = maincoin.getLastBlock();
	const previousBlockHash = lastBlock['hash'];
	const currentBlockData = {
		transactions: maincoin.pendingTransactions,
		index: lastBlock['index'] + 1
	};

	const nonce = maincoin.proofOfWork(previousBlockHash, currentBlockData);
	const blockHash = maincoin.hashBlock(previousBlockHash, currentBlockData, nonce);
	const newBlock = maincoin.createNewBlock(nonce, previousBlockHash, blockHash);

	const requestPromises = [];
	maincoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/receive-new-block',
			method: 'POST',
			body: { newBlock: newBlock },
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises)
		.then(data => {
			const requestOptions = {
				uri: maincoin.currentNodeUrl + '/transaction/broadcast',
				method: 'POST',
				body: {
					amount: 6.25,
					sender: "00",
					recipient: nodeAddress
				},
				json: true
			};

			return rp(requestOptions);
		})
		.then(data => {
			res.json({
				note: "New block mined & broadcast successfully",
				block: newBlock
			});

		});

});

app.post('/receive-new-block', function (req, res) {
	const newBlock = req.body.newBlock;
	const lastBlock = maincoin.getLastBlock();
	const correctHash = lastBlock.hash === newBlock.previousBlockHash;
	const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

	if (correctHash && correctIndex) {
		maincoin.chain.push(newBlock);
		maincoin.pendingTransactions = [];
		res.json({
			note: 'New block received and accepted.',
			newBlock: newBlock
		});
	} else {
		res.json({
			note: 'New block rejected.',
			newBlock: newBlock
		});
	}
});

// register a node and broadcast it the network
app.post('/register-and-broadcast-node', function (req, res) {
	const newNodeUrl = req.body.newNodeUrl;
	if (maincoin.networkNodes.indexOf(newNodeUrl) == -1) maincoin.networkNodes.push(newNodeUrl);

	const regNodesPromises = [];
	maincoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/register-node',
			method: 'POST',
			body: { newNodeUrl: newNodeUrl },
			json: true
		};

		regNodesPromises.push(rp(requestOptions));
	});

	Promise.all(regNodesPromises)
		.then(data => {
			const bulkRegisterOptions = {
				uri: newNodeUrl + '/register-nodes-bulk',
				method: 'POST',
				body: { allNetworkNodes: [...maincoin.networkNodes, maincoin.currentNodeUrl] },
				json: true
			};

			return rp(bulkRegisterOptions);
		})
		.then(data => {
			res.json({ note: 'New node registered with network successfully.' });
		});
});

// register a node with the network
app.post('/register-node', function (req, res) {
	const newNodeUrl = req.body.newNodeUrl;
	const nodeNotAlreadyPresent = maincoin.networkNodes.indexOf(newNodeUrl) == -1;
	const notCurrentNode = maincoin.currentNodeUrl !== newNodeUrl;
	if (nodeNotAlreadyPresent && notCurrentNode) maincoin.networkNodes.push(newNodeUrl);
	res.json({ note: 'New node registered successfully.' });
});

// register multiple nodes at once
app.post('/register-nodes-bulk', function (req, res) {
	const allNetworkNodes = req.body.allNetworkNodes;
	allNetworkNodes.forEach(networkNodeUrl => {
		const nodeNotAlreadyPresent = maincoin.networkNodes.indexOf(networkNodeUrl) == -1;
		const notCurrentNode = maincoin.currentNodeUrl !== networkNodeUrl;
		if (nodeNotAlreadyPresent && notCurrentNode) maincoin.networkNodes.push(networkNodeUrl);
	});

	res.json({ note: 'Bulk registration successful.' });
});

// consensus
app.get('/consensus', function (req, res) {
	const requestPromises = [];
	maincoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/blockchain',
			method: 'GET',
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises)
		.then(blockchains => {
			const currentChainLength = maincoin.chain.length;
			let maxChainLength = currentChainLength;
			let newLongestChain = null;
			let newPendingTransactions = null;

			blockchains.forEach(blockchain => {
				if (blockchain.chain.length > maxChainLength) {
					maxChainLength = blockchain.chain.length;
					newLongestChain = blockchain.chain;
					newPendingTransactions = blockchain.pendingTransactions;
				};
			});


			if (!newLongestChain || (newLongestChain && !maincoin.chainIsValid(newLongestChain))) {
				res.json({
					note: 'Current chain has not been replaced.',
					chain: maincoin.chain
				});
			}
			else {
				maincoin.chain = newLongestChain;
				maincoin.pendingTransactions = newPendingTransactions;
				res.json({
					note: 'This chain has been replaced.',
					chain: maincoin.chain
				});
			}
		});
});

// get block by blockHash
app.get('/block/:blockHash', function (req, res) {
	const blockHash = req.params.blockHash;
	const correctBlock = maincoin.getBlock(blockHash);
	res.json({
		block: correctBlock
	});
});

// get transaction by transactionId
app.get('/transaction/:transactionId', function (req, res) {
	const transactionId = req.params.transactionId;
	const trasactionData = maincoin.getTransaction(transactionId);
	res.json({
		transaction: trasactionData.transaction,
		block: trasactionData.block
	});
});

// get address by address
app.get('/address/:address', function (req, res) {
	const address = req.params.address;
	const addressData = maincoin.getAddressData(address);
	res.json({
		addressData: addressData
	});
});

// block explorer
app.get('/block-explorer', function (req, res) {
	res.sendFile('./block-explorer/index.html', { root: __dirname });
});

app.listen(port, function () {
	console.log(`Listening on port ${port}...`);
});