import { ethers } from 'ethers';

// ABI for the ERC-20 token contract at 0x6fEA2f1b82aFC40030520a6C49B0d3b652A65915
const contractABI = [
  // Read functions
  {
    "inputs": [],
    "name": "_decimals",
    "outputs": [{"type": "uint8", "name": ""}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "_name",
    "outputs": [{"type": "string", "name": ""}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "_symbol",
    "outputs": [{"type": "string", "name": ""}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "address", "name": "account"}],
    "name": "balanceOf",
    "outputs": [{"type": "uint256", "name": ""}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getOwner",
    "outputs": [{"type": "address", "name": ""}],
    "stateMutability": "view",
    "type": "function"
  },
  // Write functions
  {
    "inputs": [
      {"type": "address", "name": "spender"},
      {"type": "uint256", "name": "amount"}
    ],
    "name": "approve",
    "outputs": [{"type": "bool", "name": ""}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256", "name": "amount"}],
    "name": "burn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256", "name": "amount"}],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"type": "address", "name": "recipient"},
      {"type": "uint256", "name": "amount"}
    ],
    "name": "transfer",
    "outputs": [{"type": "bool", "name": ""}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"type": "address", "name": "sender"},
      {"type": "address", "name": "recipient"},
      {"type": "uint256", "name": "amount"}
    ],
    "name": "transferFrom",
    "outputs": [{"type": "bool", "name": ""}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"type": "address", "name": "newOwner"}],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Contract address
const contractAddress = "0x6fEA2f1b82aFC40030520a6C49B0d3b652A65915";

// Initialize contract with provider or signer
const initContract = (providerOrSigner) => {
  if (!providerOrSigner) {
    throw new Error('Provider or signer is required');
  }
  
  return new ethers.Contract(
    contractAddress,
    contractABI,
    providerOrSigner
  );
};

// Read functions
const getTokenName = async (provider) => {
  const contract = initContract(provider);
  return await contract._name();
};

const getTokenSymbol = async (provider) => {
  const contract = initContract(provider);
  return await contract._symbol();
};

const getTokenDecimals = async (provider) => {
  const contract = initContract(provider);
  return await contract._decimals();
};

const getBalance = async (provider, address) => {
  const contract = initContract(provider);
  const balance = await contract.balanceOf(address);
  return balance;
};

const getOwner = async (provider) => {
  const contract = initContract(provider);
  return await contract.getOwner();
};

// Write functions
const approve = async (signer, spenderAddress, amount) => {
  const contract = initContract(signer);
  const tx = await contract.approve(spenderAddress, amount);
  return await tx.wait();
};

const transfer = async (signer, recipientAddress, amount) => {
  const contract = initContract(signer);
  const tx = await contract.transfer(recipientAddress, amount);
  return await tx.wait();
};

const transferFrom = async (signer, senderAddress, recipientAddress, amount) => {
  const contract = initContract(signer);
  const tx = await contract.transferFrom(senderAddress, recipientAddress, amount);
  return await tx.wait();
};

const mint = async (signer, amount) => {
  const contract = initContract(signer);
  const tx = await contract.mint(amount);
  return await tx.wait();
};

const burn = async (signer, amount) => {
  const contract = initContract(signer);
  const tx = await contract.burn(amount);
  return await tx.wait();
};

const transferOwnership = async (signer, newOwnerAddress) => {
  const contract = initContract(signer);
  const tx = await contract.transferOwnership(newOwnerAddress);
  return await tx.wait();
};

const renounceOwnership = async (signer) => {
  const contract = initContract(signer);
  const tx = await contract.renounceOwnership();
  return await tx.wait();
};

export {
  getTokenName,
  getTokenSymbol,
  getTokenDecimals,
  getBalance,
  getOwner,
  approve,
  transfer,
  transferFrom,
  mint,
  burn,
  transferOwnership,
  renounceOwnership
};
