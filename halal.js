const crypto = require('crypto');

// Block class
class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data; // halal certification details
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    // Calculate hash of the block
    calculateHash() {
        return crypto.createHash('sha256')
            .update(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash)
            .digest('hex');
    }
}

// Blockchain class
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    // First block in the chain
    createGenesisBlock() {
        return new Block(0, new Date().toISOString(), { certification: 'Genesis Block' }, '0');
    }

    // Get the last block
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Add new block
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    // Check if blockchain is valid
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const current = this.chain[i];
            const previous = this.chain[i - 1];
            if (current.hash !== current.calculateHash()) {
                return false;
            }
            if (current.previousHash !== previous.hash) {
                return false;
            }
        }
        return true;
    }
}

// Usage
let halalChain = new Blockchain();

// Add halal certification blocks
halalChain.addBlock(new Block(1, new Date().toISOString(), { productId: "P001", halalCertId: "HC1001", issuedBy: "Halal Authority-Nasurdeen", validTill: "2026-12-31" }));
halalChain.addBlock(new Block(2, new Date().toISOString(), { productId: "P002", halalCertId: "HC1002", issuedBy: "Halal Authority-Ahamed", validTill: "2027-05-20" }));

// Print the blockchain
console.log(JSON.stringify(halalChain, null, 4));

// Check validity
console.log("Is blockchain valid? " + halalChain.isChainValid());
