const sha256 = require('sha256')
const { v4: uuidv4 } = require('uuid');
const tId = uuidv4().replace('-', '');
const currentNodeUrl = process.argv[3];
function Sidechain() {
    this.chain = [];
    this.pendingTransactions = [];
    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = [];
    //create genesis block

    this.setValues = function (id, mainchain, amount) {
        this.id = id;
        this.mainchain = mainchain;
        this.lockAmount = amount;
    }

    this.createNewBlock = function (nonce, previousBlockHash, hash) {
        const newBlock = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            transactions: this.pendingTransactions,
            nonce: nonce,
            hash: hash,
            previousBlockHash: previousBlockHash
        };

        this.pendingTransactions = [];
        this.chain.push(newBlock);

        return newBlock;
    }

    this.getLastBlock = function () {
        return this.chain[this.chain.length - 1];
    }

    this.createNewTransaction = function (amount, sender, recipient) {
        const newTransaction = {
            amount: amount,
            sender: sender,
            recipient: recipient,
            transactionId: tId
        };

        return newTransaction;
    }

    this.addTransactionToPendingTransactions = function (transactionObj) {
        this.pendingTransactions.push(transactionObj);
        return this.getLastBlock()['index'] + 1;
    };

    this.hashBlock = function (previousBlockHash, currentBlockData, nonce) {
        const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
        const hash = sha256(dataAsString);
        return hash;
    }

    this.proofOfWork = function (previousBlockHash, currentBlockData) {
        let nonce = 0;
        let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        while (hash.substring(0, 4) !== '0000') {
            nonce++;
            hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
            // console.log(hash);
        }
        return nonce;
    }

    this.chainIsValid = function (Sidechain) {
        let validChain = true;

        for (var i = 1; i < Sidechain.length; i++) {
            const currentBlock = Sidechain[i];
            const prevBlock = Sidechain[i - 1];
            const blockHash = this.hashBlock(prevBlock['hash'], { transactions: currentBlock['transactions'], index: currentBlock['index'] }, currentBlock['nonce']);
            if (blockHash.substring(0, 4) !== '0000') validChain = false;
            if (currentBlock['previousBlockHash'] !== prevBlock['hash']) validChain = false;

            // console.log('previousBlockHash =>',prevBlock['hash']);
            // console.log('currentBlockHash  =>',currentBlock['hash']);
        };

        const genesisBlock = Sidechain[0];
        const correctNonce = genesisBlock['nonce'] === 100;
        const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
        const correctHash = genesisBlock['hash'] === '0';
        const correctTransactions = genesisBlock['transactions'].length === 0;

        if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) validChain = false;

        return validChain;
    };

    this.getBlock = function (blockHash) {
        let correctBlock = null;
        this.chain.forEach(block => {
            if (block.hash === blockHash) correctBlock = block;
        });
        return correctBlock;
    };

    this.getTransaction = function (transactionId) {
        let correctTransaction = null;
        let correctBlock = null;

        this.chain.forEach(block => {
            block.transactions.forEach(transaction => {
                if (transaction.transactionId === transactionId) {
                    correctTransaction = transaction;
                    correctBlock = block;
                };
            });
        });

        return {
            transaction: correctTransaction,
            block: correctBlock
        };
    };


    this.getAddressData = function (address) {
        const addressTransactions = [];
        this.chain.forEach(block => {
            block.transactions.forEach(transaction => {
                if (transaction.sender === address || transaction.recipient === address) {
                    addressTransactions.push(transaction);
                };
            });
        });

        let balance = 0;
        addressTransactions.forEach(transaction => {
            if (transaction.recipient === address) balance += transaction.amount;
            else if (transaction.sender === address) balance -= transaction.amount;
        });

        return {
            addressTransactions: addressTransactions,
            addressBalance: balance
        };
    };

    this.createNewBlock(100, '0', '0');
    return this;
}

module.exports = Sidechain;