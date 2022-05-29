//import the blockchain.js for testing 
const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

const bc1={
    "chain": [
    {
    "index": 1,
    "timestamp": 1650556750840,
    "transactions": [],
    "nonce": 100,
    "hash": "0",
    "previousBlockHash": "0"
    },
    {
    "index": 2,
    "timestamp": 1650557326005,
    "transactions": [],
    "nonce": 18140,
    "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
    "previousBlockHash": "0"
    },
    {
    "index": 3,
    "timestamp": 1650557409754,
    "transactions": [
    {
    "amount": 6.25,
    "sender": "00",
    "recipient": "87923f0c0ea3-4b4e-b265-79775e40c594",
    "transactionId": "82fa8291a1c4-492f-bfac-5062a6214181"
    },
    {
    "amount": 10,
    "sender": "6486286HJH67476BHFGHH",
    "recipient": "GDGISSG7HFDEGJK8876593HGFHG",
    "transactionId": "82fa8291a1c4-492f-bfac-5062a6214181"
    },
    {
    "amount": 20,
    "sender": "6486286HJH67476BHFGHH",
    "recipient": "GDGISSG7HFDEGJK8876593HGFHG",
    "transactionId": "82fa8291a1c4-492f-bfac-5062a6214181"
    },
    {
    "amount": 30,
    "sender": "6486286HJH67476BHFGHH",
    "recipient": "GDGISSG7HFDEGJK8876593HGFHG",
    "transactionId": "82fa8291a1c4-492f-bfac-5062a6214181"
    }
    ],
    "nonce": 44618,
    "hash": "00009eebc0b18979c0ef63c2bea19a7483f58204c8ee7aee96ff9f2a78a5b4ce",
    "previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
    },
    {
    "index": 4,
    "timestamp": 1650557491719,
    "transactions": [
    {
    "amount": 6.25,
    "sender": "00",
    "recipient": "87923f0c0ea3-4b4e-b265-79775e40c594",
    "transactionId": "82fa8291a1c4-492f-bfac-5062a6214181"
    },
    {
    "amount": 40,
    "sender": "6486286HJH67476BHFGHH",
    "recipient": "GDGISSG7HFDEGJK8876593HGFHG",
    "transactionId": "82fa8291a1c4-492f-bfac-5062a6214181"
    },
    {
    "amount": 50,
    "sender": "6486286HJH67476BHFGHH",
    "recipient": "GDGISSG7HFDEGJK8876593HGFHG",
    "transactionId": "82fa8291a1c4-492f-bfac-5062a6214181"
    },
    {
    "amount": 60,
    "sender": "6486286HJH67476BHFGHH",
    "recipient": "GDGISSG7HFDEGJK8876593HGFHG",
    "transactionId": "82fa8291a1c4-492f-bfac-5062a6214181"
    },
    {
    "amount": 70,
    "sender": "6486286HJH67476BHFGHH",
    "recipient": "GDGISSG7HFDEGJK8876593HGFHG",
    "transactionId": "82fa8291a1c4-492f-bfac-5062a6214181"
    }
    ],
    "nonce": 181088,
    "hash": "00005f187719c0cb8971603726ad5b92571f4ddc91b7cd6126e4022f8978544d",
    "previousBlockHash": "00009eebc0b18979c0ef63c2bea19a7483f58204c8ee7aee96ff9f2a78a5b4ce"
    },
    {
    "index": 5,
    "timestamp": 1650557526614,
    "transactions": [
    {
    "amount": 6.25,
    "sender": "00",
    "recipient": "87923f0c0ea3-4b4e-b265-79775e40c594",
    "transactionId": "82fa8291a1c4-492f-bfac-5062a6214181"
    }
    ],
    "nonce": 46243,
    "hash": "00005dbce7037e590a146bcb95e4a2fbc6b3b5554041a23cc0ffea15c7a15c03",
    "previousBlockHash": "00005f187719c0cb8971603726ad5b92571f4ddc91b7cd6126e4022f8978544d"
    },
    {
    "index": 6,
    "timestamp": 1650557532012,
    "transactions": [
    {
    "amount": 6.25,
    "sender": "00",
    "recipient": "87923f0c0ea3-4b4e-b265-79775e40c594",
    "transactionId": "82fa8291a1c4-492f-bfac-5062a6214181"
    }
    ],
    "nonce": 79058,
    "hash": "0000cce864e5c04e937a65398dbe84c0f0c97641e64354b5da69b7ac9916aac9",
    "previousBlockHash": "00005dbce7037e590a146bcb95e4a2fbc6b3b5554041a23cc0ffea15c7a15c03"
    }
    ],
    "pendingTransactions": [
    {
    "amount": 6.25,
    "sender": "00",
    "recipient": "87923f0c0ea3-4b4e-b265-79775e40c594",
    "transactionId": "82fa8291a1c4-492f-bfac-5062a6214181"
    }
    ],
    "currentNodeUrl": "http://localhost:3001",
    "networkNodes": []
}

console.log('VALID: ',bitcoin.chainIsValid(bc1.chain));
/*
//console.log(bitcoin);

bitcoin.createNewBlock(2389,'OINA90SDNF90N','90ANSD9F0N9009N');
//bitcoin.createNewBlock(219,'OINA90SDNF90N','90ANSD9F0N9009N');
//bitcoin.createNewBlock(2629,'OINA90SDNF90N','90ANSD9F0N9009N');
bitcoin.createNewTransaction(100,'OINA90SDNF90N','90ANSD9F0N9009N');

bitcoin.createNewBlock(2389,'GDJGVS7474SDNF90N','743GF47D009N');
bitcoin.createNewTransaction(200,'OINA90SDNF90N','90ANSD9F0N9009N');
bitcoin.createNewTransaction(300,'OINA90SDNF90N','90ANSD9F0N9009N');
bitcoin.createNewTransaction(400,'OINA90SDNF90N','90ANSD9F0N9009N');

//bitcoin.createNewBlock(2000,'GDJGVS7474SDNF90N','743GF47D009N');
console.log(bitcoin.chain);

const previousBlockHash='HFGFJJGGHGYYUD75JX';
const currentBlockData=[
    {
        amount :10,
        sender:'GFJGDHSIEITHF',
        recipient:'JKRADHKKIH643'
    },
    {
        amount :20,
        sender:'KHJGDHSIEITHF',
        recipient:'IIDRADHKKIH643'
    },
    {
        amount:30,
        sender:'SKJGDHSIEITHF',
        recipient:'WEDRADHKKIH643'
    }];

//const nonce=1000;
console.log(bitcoin.proofOfWork(previousBlockHash,currentBlockData));

console.log(bitcoin.hashBlock(previousBlockHash,currentBlockData,9190));
*/