const { MerkleTree } = require('merkletreejs')
const fs = require("fs");

const whitelistPath = __dirname + "/whitelist.csv";
const premintPath = __dirname + "/premint.csv";
const addressHashPath = __dirname + "/addresshash.json";

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
    console.log("Whitelisted Addresses:", whitelistedAddresses);
    if (whitelistedAddresses.length > 0) {
        let tree = new MerkleTree(whitelistedAddresses);
        whitelistMerkleRoot = tree.getHexRoot();
        console.log("Whitelist Merkle Root:", whitelistMerkleRoot);
    } else {
        console.log("No addresses found in whitelist.csv");
    }

    // Read and process premint.csv
    const premintAddresses = await getListOfAddresses(premintPath);
    console.log("Premint Addresses:", premintAddresses);
    if (premintAddresses.length > 0) {
        let tree  = new MerkleTree(premintAddresses);
        premintMerkleRoot = tree.getRoot()
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
