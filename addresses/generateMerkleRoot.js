const { MerkleTree } = require('merkletreejs')
const SHA256 = require('crypto-js/sha256')
const {
    getMerkleProof,
    getMerkleRoot,
    getMerkleTree,
    

  } = require( "@metaplex-foundation/mpl-candy-machine");
const fs = require("fs");

const whitelistPath = __dirname + "/whitelist.csv";
const premintPath = __dirname + "/premint.csv";
const addressHashPath = __dirname + "/addresshash.json";
const addressesPath = __dirname + "/addresses.json";

let whitelistMerkleRoot = '';
let premintMerkleRoot = '';
// Function to read the CSV file and return an array of addresses
const getListOfAddresses = async (path) => {
    try {
        const data = await fs.promises.readFile(path, "utf8");
        const addresses = data.split("\n").map(line => line.trim()).filter(line => line);
        return addresses;
    } catch (err) {
        console.error("Error while reading:", err);
        return [];
    }
}

const main = async () => {
    // Read and process whitelist.csv
    const whitelistedAddresses = await getListOfAddresses(whitelistPath);
   
    if (whitelistedAddresses.length > 0) {
        whitelistMerkleRoot = getMerkleRoot(whitelistedAddresses).toString('hex')
        console.log("whitelist root",whitelistMerkleRoot )
    } else {
        console.log("No addresses found in whitelist.csv");
    }

    // Read and process premint.csv
    const premintAddresses = await getListOfAddresses(premintPath);
    fs.writeFileSync(addressesPath, JSON.stringify({whitelistedAddresses,premintAddresses }));
    if (premintAddresses.length > 0) {
        premintMerkleRoot =getMerkleRoot(premintAddresses).toString('hex')
        console.log("Premint Merkle Root:", premintMerkleRoot);
    } else {
        console.log("No addresses found in premint.csv");
    }


    const addressHashData = {
        whitelistMerkleRoot,
        premintMerkleRoot
    };

    fs.writeFileSync(addressHashPath, JSON.stringify(addressHashData));
    console.log("Merkle roots have been written to addresshash.json");
}

main();
